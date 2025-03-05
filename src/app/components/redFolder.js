"use client";
import { useFolderContext } from "./Context";
import MetadataForm from "./metaData";
import Image from "next/image";
import bbGif from "@/app/icons/bb.gif";
import dhmi from "@/app/icons/dhmi.png";

const RedFolder = () => {
    const { 
        redFolders, 
        addRedFolder, 
        deleteRedFolder,
        setCurrentBlueFolder,
        currentBlueFolder,  
        setCurrentRedFolder, 
        newRedFolderName,
        editedRedName,
        setNewRedFolderName,
        showConfirmation,
        setShowConfirmation,
        selectedFolder,
        setSelectedFolder,
        setEditedRedName,
        editMode,
        setEditMode,
        editRedFolder,
        fetchRedFolders,
        currentBlueFolderId,
        setCurrentRedFolderId,
        currentRedFolderId,
        getFile,
        setSearch,
        search,
    } = useFolderContext();

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
                    color:"black"
                }}
            >
                <p>
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
        setShowConfirmation(false);
        deleteRedFolder(currentRedFolderId)
    };

    const cancelDelete = () => {
        setShowConfirmation(false);
    };
    const filteredFolders = redFolders
        .slice() // Orijinal diziyi değiştirmemek için slice() kullanıyoruz
        .sort((a, b) => a.name.localeCompare(b.name)) // Alfabetik sıralama
        .filter(folder => 
            folder.name.toLowerCase().includes(search.toLowerCase()) // Büyük-küçük harf duyarsız arama
        );
    return (
        <div className="folder-container">
            <h3 >
                <span style={{color:"blue"}} > {currentBlueFolder?.split("/").pop()} içindeki </span>
                <span style={{color:"red"}}>Kırmızı Klasörler</span>
            </h3>
            <div className="folder-back" >
                <button onClick={() => setCurrentBlueFolder(null)}>
                    <Image src={bbGif} alt="gif" width={50} height={50} />
                </button>
                <span>Geri Dön</span>
            </div>
            <div className="folder-input">
                <div>
                <input
                    type="text"
                    value={newRedFolderName}
                    onChange={(e) => setNewRedFolderName(e.target.value)}
                    placeholder="Yeni Kırmızı Klasör Adı"
                />
                <button style={{backgroundColor:"red"}} onClick={() => addRedFolder(currentBlueFolderId, newRedFolderName)}>Ekle</button>
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Klasör Ara"
                />
            </div>
            <div className="folder-grid" >
                {filteredFolders.length > 0 ? (
                    filteredFolders.map((folderPath, index)=> {
                    const folderName = folderPath.name;
                    const redFolderId = folderPath.id
                    return (
                        <div key={index} className="folder red-folder" >
                            {editMode && selectedFolder === folderName ? (
                                <div className="edit-name-input" >
                                <input className="edit-name"
                                type="text"
                                value={editedRedName}
                                onChange={(e) =>setEditedRedName(e.target.value)}
                                placeholder="Yeni Klasör Adı"
                                />
                                <div className="folder-buttons" >
                                <button
                                    onClick={() => {
                                        editRedFolder(redFolderId, editedRedName);
                                        setEditMode(false);
                                    }}
                                >Kaydet</button>
                                <button onClick={() => setEditMode(false)}>İptal</button>
                                </div>
                            </div>
                            ): (
                            <>
                                <Image className="red-image" src={dhmi} alt="dhmi" width={80} height={80} />
                                <span>{folderName}</span>
                                <MetadataForm key={redFolderId} redFolderId={redFolderId} />
                                <div className="folder-buttons">
                                    <button onClick={() => {
                                        setCurrentRedFolder(folderName)
                                        setCurrentRedFolderId(redFolderId)
                                        getFile(redFolderId)
                                    }}>Aç</button>
                                    <button onClick={() => {
                                        setSelectedFolder(folderName)
                                        setEditedRedName(folderName)
                                        setEditMode(true)
                                    }} >
                                        Düzelt
                                    </button>
                                    <button onClick={() => {
                                        setCurrentRedFolderId(redFolderId)
                                        handleDelete(folderName)}}>Sil</button>
                                    {showConfirmation && (
                                    <DeleteConfirmation
                                    folderName={selectedFolder}
                                    onConfirm={confirmDelete}
                                    onCancel={cancelDelete}/>
                                )}
                                </div>
                            </>
                            )}
                        </div>
                    )
                })) : (
                    <p style={{ color: "gray" }}>Eşleşen klasör bulunamadı.</p>
                )}
            </div>
        </div>
    );
};

export default RedFolder;
