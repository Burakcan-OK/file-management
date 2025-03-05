import { google } from "googleapis";
import { getSession } from "next-auth/react";

// Google OAuth istemcisi oluştur
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

// Google giriş URL'sini oluştur
export default async function handler(req, res) {
    const session = await getSession({ req });

    if (session && session.accessToken) {
        return res.redirect("/"); // Zaten giriş yaptıysa yönlendir
    }
    const state = Math.random().toString(36).substring(7);
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/drive", 
            "https://www.googleapis.com/auth/drive.file",
            "https://www.googleapis.com/auth/drive.readonly", 
            "https://www.googleapis.com/auth/drive.metadata.readonly",
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
            "openid"
        ],
        state,
        prompt: "consent",
    });

    res.redirect(authUrl);
}