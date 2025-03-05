import { google } from "googleapis";
import { serialize } from "cookie";

// Google OAuth istemcisi
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

export default async function handler(req, res) {
    const { code } = req.query;
    if (!code) return res.status(400).json({ error: "Kod bulunamadı" });

    try {
        // Google'dan token al
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Kullanıcı bilgilerini al
        const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
        const { data } = await oauth2.userinfo.get();

        // Refresh Token varsa çerez olarak sakla
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 30, // 30 gün açık tut
            path: "/",
        };

        const cookieHeaders = [
            serialize("access_token", tokens.access_token, cookieOptions),
        ];
        
        if (tokens.refresh_token) {
            cookieHeaders.push(serialize("refresh_token", tokens.refresh_token, cookieOptions));
        }
        
        res.setHeader("Set-Cookie", cookieHeaders);
        

        // Kullanıcıyı ana sayfaya yönlendir
        res.redirect("/");
    } catch (error) {
        res.status(500).json({ error: "Giriş işlemi başarısız" });
    }
}