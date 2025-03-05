import fs from "fs";
import { IncomingForm } from 'formidable';
import { google } from "googleapis";
import { getSession } from "next-auth/react";
import { parse } from "cookie";


export const config = {
    api: {
        bodyParser: false,
    },
};
const parseForm = (req) => {
    return new Promise((resolve, reject) => {
        const form = new IncomingForm();
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            else resolve({ fields, files });
        });
    });
};
export default async function handler(req, res) {
    const session = await getSession({req})
    const cookies = parse(req.headers.cookie || "");
    const accessToken = session.accessToken; 

    if (!accessToken) {
        return res.status(401).json({ error: "Unauthorized - No access token" });
    }
    const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,  // ✅ Client ID buraya
    process.env.GOOGLE_CLIENT_SECRET,  // ✅ Client Secret buraya
    "http://localhost:3000/api/auth/callback/google"  // ✅ Redirect URI ile uyuşmalı!
        );
    oauth2Client.setCredentials({ 
        access_token: session.accessToken,
        refresh_token: session.refreshToken,
     });
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    if (req.method === "GET") {
        const { type,bluefFolderId,redFolderId } = req.query;
        if(type === "blue"){
            try {
            const response = await drive.files.list({
                q: "mimeType='application/vnd.google-apps.folder' and 'root' in parents",
                fields: "files(id, name)",
            });
            return res.status(200).json({ folders: response.data.files });
            } catch (error) {
                console.error("🚨 Error fetching folders:", error);
                return res.status(500).json({ error: "Failed to fetch folders" });
            }
        } else if (type === "red") {
            if (!bluefFolderId) {
                return res.status(400).json({ error: "Kırmızı klasörler için 'bluefFolderId' belirtilmeli." });
            }
            try {
                const response = await drive.files.list({
                    q: `mimeType='application/vnd.google-apps.folder' and '${bluefFolderId}' in parents`,
                    fields: "files(id, name)",
                });
                return res.status(200).json({ folders: response.data.files });
            } catch (error) {
                console.error("🚨 Error fetching folders:", error);
                return res.status(500).json({ error: "Failed to fetch folders" });
            }
        } else if(type === "getData") {
            if (!redFolderId) {
                return res.status(400).json({ error: "Eksik parametre: redFolderId" });
            }    
            try {
                const response = await drive.files.get({
                    fileId: redFolderId,
                    fields: "properties"
                });
                return res.status(200).json({ metadata: response.data.properties });
            } catch (error) {
                console.error("Metadata alınırken hata:", error);
                return res.status(500).json({ error: "Metadata alınamadı." });
            }
        }
        else if(type === "getFile") {
            if (!redFolderId) {
                return res.status(400).json({ error: "Kırmızı klasörler için 'bluefFolderId' belirtilmeli." });
            }
            try {
                const response = await drive.files.list({
                    q: `'${redFolderId}' in parents`,
                    fields: "files(id, name, mimeType)",
                });
                return res.status(200).json({ folders: response.data.files });
            } catch (error) {
                console.error("🚨 Error fetching folders:", error);
                return res.status(500).json({ error: "Failed to fetch folders" });
            }
        }
    } 
    else if (req.method === "POST") {
        const form = new IncomingForm();
        const { fields, files } = await parseForm(req);
        let { name, metadata, blueFolderId, redFolderId } = fields;
        let type = Array.isArray(fields.type) ? fields.type[0] : fields.type;
        try {
            if (type === "blue") {
                const response = await drive.files.create({
                    requestBody: {
                        name: name,
                        mimeType: "application/vnd.google-apps.folder",
                        parents: ["root"],
                    },
                    fields: "id",
                });
                return res.status(200).json({ 
                    folderId: response.data.id, 
                    message: "Folder created successfully" 
                });
            }
            else if (type === "red") {
                if (!blueFolderId) {
                    return res.status(400).json({ error: "Kırmızı klasör oluşturmak için 'parentId' gerekli." });
                }
                try {
                    const fileMetadata = {
                        name,
                        mimeType: "application/vnd.google-apps.folder",
                        parents: [blueFolderId], // Mavi klasörün içinde oluştur
                    };
                    const folder = await drive.files.create({
                        resource: fileMetadata,
                        fields: "id",
                    });
                    return res.status(201).json({ 
                        message: "Kırmızı klasör başarıyla oluşturuldu.", 
                        folderId: folder.data.id 
                    });
                } catch (error) {
                    console.error("🚨 Kırmızı klasör eklenirken hata:", error);
                    return res.status(500).json({ error: "Kırmızı klasör oluşturulamadı." });
                }
            }
            else if (type === "metadata") {
                if (!redFolderId || !metadata) {
                    return res.status(400).json({ error: "Eksik parametreler: redFolderId veya metadata eksik." });
                }
                try {
                    const response = await drive.files.update({
                        fileId: redFolderId,
                        requestBody: {
                            properties: metadata
                        }
                    });
                    return res.status(200).json({ message: "Metadata başarıyla eklendi.", data: response.data });
                } catch (error) {
                    return res.status(500).json({ error: "Metadata eklenemedi." });
                }
            }
            else if (type === "postFile") {
                const file = files.file?.[0];
                redFolderId = redFolderId[0]
                if (!redFolderId || !file) {
                    return res.status(400).json({ error: "Red Folder ID ve dosya gerekli!" });
                }
                try {
                    const fileMetadata = {
                        name: file.originalFilename,
                        parents: [redFolderId], 
                    };
                    const media = {
                        mimeType: file.mimetype,
                        body: fs.createReadStream(file.filepath),
                    };
                    const uploadedFile = await drive.files.create({
                        resource: fileMetadata,
                        media: media,
                        fields: "id, name",
                    });
                    return res.status(200).json({
                        id: uploadedFile.data.id,
                        name: uploadedFile.data.name,
                    });
            
                } catch (error) {
                    return res.status(500).json({ error: "Dosya yüklenemedi." });
                }
            }
        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ error: "An error occurred." });
        } 
    } 
    else if (req.method === "DELETE") {
        const { type, blueFolderId,redFolderId, currentFileId } = req.query;
        if (type === "blue") { 
            if (!blueFolderId) {
                return res.status(400).json({ error: "Blue Folder ID is required." });
            }
            try {
                const response = await drive.files.delete({ fileId: blueFolderId });                    
                return res.status(200).json({ folders: response.data.files });
            } catch (error) {
                res.status(500).json({ error: "Klasör silinirken bir hata oluştu." });
            }
        } 
        else if (type === "red") {
            if (!redFolderId) {
                return res.status(400).json({ error: "Kırmızı klasör silmek için redFolderId gerekli." });
            }
            try {
                const response = await drive.files.delete({ fileId: redFolderId });                    
                return res.status(200).json({ folders: response.data.files });
            } catch (error) {
                res.status(500).json({ error: "Klasör silinirken bir hata oluştu." });
            }
        } 
        else if (type === "deleteFile") {
            if (!currentFileId) {
                return res.status(400).json({ error: "Dosya klasör silmek için fileId gerekli." });
            }
            try {
                const response = await drive.files.delete({ fileId: currentFileId });                    
                return res.status(200).json({ folders: response.data.files });
            } catch (error) {
                res.status(500).json({ error: "Klasör silinirken bir hata oluştu." });
            }
         }
    } 
     else if (req.method === "PUT") {
        const form = new IncomingForm();
        form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).json({ error: "Error parsing form data" });
        }
        let {newName, type, blueFolderId, redFolderId } = fields;
        if (type === "blue") {
            try {    
                if (!blueFolderId || !newName.trim()) {
                    return res.status(400).json({ error: "Eksik parametreler." });
                }    
                const response = await drive.files.update({
                    fileId: blueFolderId,
                    requestBody: {
                        name: newName,
                    },
                });
                return res.status(200).json({
                    message: "Klasör adı başarıyla güncellendi.",
                    updatedName: response.data.name,
                });
    
            } catch (error) {
                return res.status(500).json({
                    error: "Klasör adı değiştirilemedi.",
                    details: error.message,
                });
            }
        } else if (type === "red") {
            try {    
                if (!redFolderId || !newName.trim()) {
                    return res.status(400).json({ error: "Eksik parametreler." });
                }   
                const response = await drive.files.update({
                    fileId: redFolderId,
                    requestBody: {
                        name: newName,
                    },
                });
                return res.status(200).json({
                    message: "Klasör adı başarıyla güncellendi.",
                    updatedName: response.data.name,
                });
            } catch (error) {
                return res.status(500).json({
                    error: "Klasör adı değiştirilemedi.",
                    details: error.message,
                });
            }
        }
    })
}
}