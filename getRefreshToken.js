const { google } = require("googleapis");
const readline = require("readline");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: ["https://www.googleapis.com/auth/drive.file", "profile", "email"],
  prompt: "select_account consent",
});

console.log("Bu URL'yi tarayıcıda aç ve kodu kopyala:\n", authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Tarayıcıdan aldığın kodu yapıştır: ", (code) => {
  oauth2Client.getToken(code, (err, token) => {
    if (err) {
      console.error("Token alma hatası:", err);
      return;
    }
    console.log("Refresh Token:", token.refresh_token);
    rl.close();
  });
});
