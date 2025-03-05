"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getSession } from "next-auth/react";

const FolderContext = createContext();

export const useFolderContext = () => {
    const context = useContext(FolderContext);
    if (!context) {
        throw new Error("useFolderContext must be used within a FolderProvider");
    }
    return context;
};



export const FolderProvider = ({ children }) => {
    const [blueFolders, setBlueFolders] = useState([]);
    const [redFolders, setRedFolders] = useState([]);
    const [currentBlueFolder, setCurrentBlueFolder] = useState(null);
    const [currentBlueFolderId, setCurrentBlueFolderId] = useState(null);
    const [currentRedFolder, setCurrentRedFolder] = useState(null);
    const [currentRedFolderId, setCurrentRedFolderId] = useState(null);
    const [newBlueFolderName, setBlueNewFolderName] = useState("");
    const [newRedFolderName, setNewRedFolderName] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [editedBlueName, setEditedBlueName] = useState("");
    const [editedRedName, setEditedRedName] = useState("");
    const [user, setUser] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [currentFileId, setCurrentFileId] = useState(null);
    const [search, setSearch] = useState("");
    const [previewFile, setPreviewFile] = useState(null);

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    useEffect(() => {
        fetch('/api/getHeaders')
        .then((res) => res.json())
        .then((data) => console.log(data.headers))
        .catch((error) => console.error("Error fetching headers:", error));
        fetchBlueFolders();
    }, []);

    const fetchBlueFolders = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/upload?type=blue`, {
                headers: { "Content-Type": "application/json" }
            });
    
            if (!response.ok) throw new Error("Failed to fetch blue folders");
    
            const data = await response.json();
            console.log("Blue folder Klasörler:", data);
            setBlueFolders(data.folders);
        } catch (error) {
            console.error("🚨 Failed to fetch blue folders:", error.message);
        }
    };
    const addBlueFolder = async (newBlueFolderName) => {
        if (!newBlueFolderName.trim()) return;

        try {
            const session = await getSession();
            if (!session || !session.accessToken) {
                console.error("❌ Yetkilendirme Token'ı Yok!");
                return;
            }
            const response = await axios.post(`${BASE_URL}/api/upload`, 
                { name: newBlueFolderName, type: "blue" },
                { headers: { "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.accessToken}` 
                 } }
            );
    
            setBlueFolders((prev) => [...prev, { id: response.data.folderId, name: newBlueFolderName }]);
            setBlueNewFolderName("")
        } catch (error) {
            console.error("Error adding blue folder:", error.message);
        }
    };
    const editBlueFolder = async ( newName, blueFolderId) => {
        if (!newName.trim()) return;
        try {
            console.log("🚀 PUT isteği gönderiliyor:", { blueFolderId, newName });

            const response = await axios.put(`${BASE_URL}/api/upload`, {
                type: "blue", 
                blueFolderId,
                newName,
            }, {
                headers: { "Content-Type": "application/json" }
            });

            console.log("✅ PUT isteği başarılı, API yanıtı:", response.data);
            //fetchBlueFolders();  // Güncellenmiş listeyi tekrar çek
            setBlueFolders((prevFolders) =>
                prevFolders.map((folder) =>
                    folder.id === blueFolderId ? { ...folder, name: newName } : folder
                )
            );
    
        } catch (error) {
            console.error("❌ Klasör adı değiştirilemedi:", error.response?.data || error.message);
        }
        
    };
    const deleteBlueFolder = async (blueFolderId) => {
        try {
            console.log("🚀 Silinecek Blue Folder ID:", blueFolderId);
            const response = await axios.delete(`${BASE_URL}/api/upload`, {
                params: {
                    type: "blue",
                    blueFolderId,
                },
                headers: { "Content-Type": "application/json" }
            });    
            console.log("✅ DELETE isteği başarılı, API yanıtı:", response.data);
            setBlueFolders((prevFolders) =>
                prevFolders.filter((folder) =>
                    folder.id !== blueFolderId )
            );
        } catch (error) {
            console.error("Error deleting blue folder:", error.message);
        }
    };
    const fetchRedFolders = async (bluefFolderId) => {
        try {
            const response = await fetch(`${BASE_URL}/api/upload?type=red&bluefFolderId=${bluefFolderId}`, {
                headers: { "Content-Type": "application/json" }
            });
    
            if (!response.ok) throw new Error("Failed to fetch red folders");
    
            const data = await response.json();
            console.log("📂 Red folders Klasörler:", data);
            setRedFolders(data.folders);
        } catch (error) {
            console.error("🚨 Failed to fetch blue folders:", error.message);
        }
    }; 
    const addRedFolder = async (blueFolderId,newRedFolderName) => {
        if (!newRedFolderName.trim()) return;
        try {
            const session = await getSession();
            if (!session || !session.accessToken) {
                console.error("❌ Yetkilendirme Token'ı Yok!");
                return;
            }
            const response = await axios.post(`${BASE_URL}/api/upload`, 
                { name: newRedFolderName, blueFolderId: blueFolderId, type: "red" },
                { headers: { "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.accessToken}` 
                 } }
            );
    
            setRedFolders((prev) => [...prev, { id: response.data.folderId, name: newRedFolderName }]);
            setNewRedFolderName("")
        } catch (error) {
            console.error("Error adding blue folder:", error.message);
        }
    };
    const editRedFolder = async (redFolderId, newName) => {
        if (!newName.trim()) return;
        try {
            console.log("🚀 PUT isteği gönderiliyor:", { redFolderId, newName });

            const response = await axios.put(`${BASE_URL}/api/upload`, {
                type: "red", 
                redFolderId,
                newName,
            }, {
                headers: { "Content-Type": "application/json" }
            });

            console.log("✅ PUT isteği başarılı, API yanıtı:", response.data);
            //fetchRedFolders(bluefFolderId)
            setRedFolders((prevFolders) =>
                prevFolders.map((folder) =>
                    folder.id === redFolderId ? { ...folder, name: newName } : folder
                )
            );
    
        } catch (error) {
            console.error("❌ Klasör adı değiştirilemedi:", error.response?.data || error.message);
        }
    };

    const deleteRedFolder = async (redFolderId) => {
        try {
            const response = await axios.delete(`${BASE_URL}/api/upload`, {
                params: {
                    type: "red",
                    redFolderId,
                },
                headers: { "Content-Type": "application/json" }
            });    
            console.log("✅ DELETE isteği başarılı, API yanıtı:", response.data);
            setRedFolders((prevFolders) =>
                prevFolders.filter((folder) =>
                    folder.id !== redFolderId )
            );
        } catch (error) {
            console.error("Error deleting red folder:", error.message);
        }
    };
    const addRedFolderData = async (redFolderId, metadata) => {
        if (!redFolderId || !metadata) {
            console.error("Eksik parametre: redFolderId veya metadata boş!");
            return;
        }
    
        try {
            const response = await axios.post(
                `${BASE_URL}/api/upload`,
                {
                    redFolderId,
                    metadata, // Gereksiz spread operatörünü kaldırdık
                    type: "metadata",
                },
                { headers: { "Content-Type": "application/json" } }
            );
            console.log("Metadata başarıyla kaydedildi:", response.data);
            return response.data;
        } catch (err) {
            console.error("Metadata kaydedilirken hata:", err.message);
        }
    };
    const fetchRedFolderData = async (redFolderId) => {
        if (!redFolderId) {
            console.error("Eksik parametre: redFolderId boş!");
            return null;
        }
    
        try {
            const response = await axios.get(`${BASE_URL}/api/upload`, {
                params: { redFolderId, type: "getData" },
            });
            return response.data.metadata || null; // Eğer metadata yoksa `null` döndür
        } catch (err) {
            console.error("Metadata yüklenirken hata:", err.message);
            return null;
        }
    };
    const getFile = async (redFolderId) => {
        try {
            const response = await fetch(`${BASE_URL}/api/upload?type=getFile&redFolderId=${redFolderId}`, {
                headers: { "Content-Type": "application/json" }
            });
    
            if (!response.ok) throw new Error("Failed to fetch files");
    
            const data = await response.json();
            console.log("📂 GetFile Klasörleri:", data);
            setUploadedFiles((data.folders) ? [...data.folders] : []); 
        } catch (error) {
            console.error("🚨 Failed to fetch blue folders:", error.message);
        }
    };
    const addFile = async (file, redFolderId) => {
        if (!file || !redFolderId) {
            console.error("❌ Dosya veya Red Folder ID eksik!");
            return;
        }
       
        try {
            const session = await getSession();
            if (!session || !session.accessToken) {
                console.error("❌ Yetkilendirme Token'ı Yok!");
                return;
            }
            const formData = new FormData();
            formData.append("file", file);
            formData.append("redFolderId", redFolderId);
            formData.append("type", "postFile"); // Backend için gerekli flag
            const response = await axios.post(`${BASE_URL}/api/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data", // ✅ Form verisi gönderiyoruz!
                    "Authorization": `Bearer ${session.accessToken}`
                }
            });

            setUploadedFiles((prev) => [...prev, response.data]); // Yeni dosyayı listeye ekle
            console.log("context uploaded files", response.data)
        } catch (error) {
            console.error("❌ Dosya yüklenirken hata oluştu:", error.message);
        }
    };
    const deleteFile = async (currentFileId) => {
        try {
            const response = await axios.delete(`${BASE_URL}/api/upload`, {
                params: {
                    type: "deleteFile",
                    currentFileId,
                },
                headers: { "Content-Type": "application/json" }
            });    
            console.log("✅ DELETE isteği başarılı, API yanıtı:", response.data);
            setUploadedFiles((prevFolders) =>
                prevFolders.filter((file) =>
                    file.id !== currentFileId )
            );
        } catch (error) {
            console.error("Error deleting file", error.message);
        }
    };

    return (
        <FolderContext.Provider
            value={{
                blueFolders,
                redFolders,
                currentBlueFolder,
                currentRedFolder,
                newBlueFolderName,
                newRedFolderName,
                showConfirmation,
                selectedFolder,
                editMode,
                editedBlueName,
                editedRedName,
                user,
                currentBlueFolderId,
                currentRedFolderId,
                uploadedFiles,
                currentFileId,
                search,
                previewFile,
                setCurrentBlueFolder,
                setCurrentRedFolder,
                fetchBlueFolders,
                addBlueFolder,
                deleteBlueFolder,
                fetchRedFolders,
                addRedFolder,
                deleteRedFolder,
                setBlueNewFolderName,
                setNewRedFolderName,
                setShowConfirmation,
                setSelectedFolder,
                setEditMode,
                setEditedBlueName,
                editBlueFolder,
                editRedFolder,
                setEditedRedName,
                fetchRedFolderData,
                addRedFolderData,
                setUser,
                setCurrentBlueFolderId,
                setCurrentRedFolderId,
                setUploadedFiles,
                getFile,
                addFile,
                deleteFile,
                setCurrentFileId,
                setSearch,
                setPreviewFile,
            }}
        >
            {children}
        </FolderContext.Provider>
    );
};
