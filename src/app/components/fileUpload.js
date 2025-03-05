"use client";
import { useFolderContext } from "./Context";
import { useState, useEffect } from "react";
import Image from "next/image";
import bbGif from "@/app/icons/bb.gif";

const FileUpload = () => {
    const { 
        setCurrentRedFolder,
        currentBlueFolder,
        currentRedFolder, 
        fetchRedFolders,
        showConfirmation,
        setShowConfirmation,
        setSelectedFolder,
        selectedFolder,
        setUploadedFiles,
        uploadedFiles,
        currentBlueFolderId,
        addFile,
        currentRedFolderId,
        deleteFile,
        setCurrentFileId,
        currentFileId,
        setSearch,
        search,
        setPreviewFile,
        previewFile,
    } = useFolderContext();
    

     // Önizleme için seçilen dosya
    const [blueFolderName, setBlueFolderName] = useState("");
    const [redFolderName, setRedFolderName] = useState("");
    
    
    function handleFileChange(e) {
        const file = e.target.files[0];
        console.log("file",file)
        console.log("currenRedFolderId",currentRedFolderId)
        addFile(file, currentRedFolderId)
    }
    const DeleteConfirmation = ({ folderName, onConfirm, onCancel }) => {
        return (
            <div
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "white",
                    padding: "1rem",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
                    textAlign: "center",
                    color:"black",
                    borderRadius: "8px",
                }}
            >
                <p style={{color:'#007bff',fontSize:'110%'}} >
                    {folderName} klasörünü silmek istediğinizden emin misiniz?
                </p>
                <button
                    style={{ margin: "0.5rem", padding: "0.5rem 1rem", backgroundColor: "crimson", color: "white", border: "none", cursor: "pointer" }}
                    onClick={onConfirm}
                >
                    Evet
                </button>
                <button
                    style={{ margin: "0.5rem", padding: "0.5rem 1rem", backgroundColor: "gray", color: "white", border: "none", cursor: "pointer" }}
                    onClick={onCancel}
                >
                    Hayır
                </button>
            </div>
        );
    };

    const handleDelete = (fileUrl) => {
        setSelectedFolder(fileUrl);
        setShowConfirmation(true);
        
    };

    const confirmDelete = () => {
        console.log( "Güncellenen currentFileId:", currentFileId)
        setShowConfirmation(false);
        deleteFile(currentFileId)
    };

    const cancelDelete = () => {
        setShowConfirmation(false);
    };
    const filteredFiles = uploadedFiles
    .slice() // Orijinal diziyi değiştirmemek için slice() kullanıyoruz
    .sort((a, b) => a.name.localeCompare(b.name)) // Alfabetik sıralama
    .filter(folder => 
        search ? folder.name.toLowerCase().includes(search.toLowerCase()) : true
    );
    return (
        <div className="folder-container" >
            <h3 >
                <span style={{color:"blue"}} > {currentBlueFolder?.split("/").pop()}'a ait </span>
                <span style={{color:"red"}}> {currentRedFolder?.split("/").pop()} içindeki dosyalar </span>
            </h3>
            <div className="folder-back" >
                
                <button onClick={() => {
                    fetchRedFolders(currentBlueFolderId);
                    setCurrentRedFolder(null)}}>
                    <Image src={bbGif} alt="gif" width={40} height={40} />
                </button>
                <span>Geri Dön</span>
            </div>
            {previewFile ? (
                <div className="file" >
                    <button style={{marginBottom:'2%'}} onClick={() => setPreviewFile(null)}> ❌ Dosyayı Kapat</button>
                    <hr className="divider"></hr>
                    <iframe
                        src={previewFile}
                        width="100%"
                        height="750px"
                        style={{ border: "none" }}
                    ></iframe>
                </div>
            ) : (
                <div className="file-input" >
                    <div className="folder-input">
                    <div >
                        <input style={{width:"76%"}} type="file" onChange={handleFileChange} />
                    </div>
                    <div>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Dosya Ara"
                           
                        />
                    </div>
                    </div>
                    <div className="file-buttons">
                    
                    {uploadedFiles.length === 0 ? (
                        <p>Henüz yüklenmiş dosya yok.</p>
                    ) : (
                        <ul>
                            {filteredFiles.length > 0 ? (
                                (filteredFiles).map((file, index) => (
                                <li key={index}>
                                    <span>{file.name}</span>
                                    <div className="file-pre-del">
                                    <button style={{marginLeft:'-5%'}} onClick={() => setPreviewFile(`https://drive.google.com/file/d/${file.id}/preview`)}>
                                        Önizle
                                    </button>
                                    <button style={{marginLeft:'10%'}} onClick={() => {
                                        setCurrentFileId(file.id)
                                        handleDelete(file.name)}}
                                        >Sil</button>
                                    {showConfirmation && (
                                    <DeleteConfirmation
                                    folderName={selectedFolder}
                                    onConfirm={confirmDelete}
                                    onCancel={cancelDelete}/>)}
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p style={{ color: "gray" }}>Eşleşen klasör bulunamadı.</p>
                        )}
                        </ul>
                    )}
                </div>
                </div>
            )}
        </div>
    );
    
}
export default FileUpload;
