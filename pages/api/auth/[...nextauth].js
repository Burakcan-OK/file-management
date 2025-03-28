import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: "openid email profile https://www.googleapis.com/auth/drive.file",
                    access_type: "offline", // Refresh token almak için gerekli
                    prompt: "consent", // Her girişte onay alır
                },
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
            },
        },
    },
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token || process.env.GOOGLE_REFRESH_TOKEN;
                token.accessTokenExpires = Date.now() + account.expires_in * 1000;
            }
    
            if (Date.now() < token.accessTokenExpires) {
                return token;
            }
    
            return await refreshAccessToken(token);
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            session.accessTokenExpires = token.accessTokenExpires;
            return session;
        },
        async redirect({ url, baseUrl }) {
            return baseUrl; // Kullanıcı giriş yaptıktan sonra direkt baseUrl'e yönlendirilir
        },
    },
});

// ✅ **Token süresi dolduğunda otomatik yenileyen fonksiyon**
async function refreshAccessToken(token) {
    try {
        const response = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                refresh_token: token.refreshToken || process.env.GOOGLE_REFRESH_TOKEN,
                grant_type: "refresh_token",
            }),
        });

        const refreshedTokens = await response.json();

        if (!response.ok) throw refreshedTokens;

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, 
        };
    } catch (error) {
        console.error("🔴 Refresh Token Yenilenirken Hata:", error);
        return { ...token, error: "RefreshAccessTokenError" };
    }
}

