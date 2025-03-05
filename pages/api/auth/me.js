import { getSession } from "next-auth/react";

export default async function handler(req, res) {
    let session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ error: "Giriş yapmanız gerekiyor" });
    }

    if (!session.accessToken) {
        return res.status(403).json({ error: "Token eksik, lütfen yeniden giriş yapın" });
    }

    return res.status(200).json({ user: session.user });
}
// export default async function handler(req, res) {
//     const session = await getSession({ req });

//     if (!session || !session.accessToken) {
//         return res.status(401).json({ error: "Yetkilendirme hatası. Tekrar giriş yapın." });
//     }
    
//     const oauth2Client = new google.auth.OAuth2(
//         process.env.GOOGLE_CLIENT_ID,
//         process.env.GOOGLE_CLIENT_SECRET,
//         process.env.NEXT_PUBLIC_BASE_URL + "/api/auth/callback"
//     );

//     oauth2Client.setCredentials({ 
//         access_token: session.accessToken,
//         refresh_token: session.refreshToken 
//     });

//     try {
//         const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
//         const { data } = await oauth2.userinfo.get();
//         session.user = session.user || { name: data.name, email: data.email };
//         return res.status(200).json({ name: data.name, email: data.email });
//     } catch (error) {
//         console.error("Kullanıcı bilgisi alınırken hata:", error);
//         return res.status(500).json({ error: "Kullanıcı bilgisi alınamadı" });
//     }
// }
