"use client";
import { useFolderContext } from "./Context";
import Image from "next/image";
import dhmi from "@/app/icons/dhmi.png";

const BlueFolder = () => {
    const { 
        blueFolders, 
        addBlueFolder, 
        deleteBlueFolder, 
        setCurrentBlueFolder, 
        newBlueFolderName, 
        setBlueNewFolderName ,
        fetchBlueFolders,
        fetchRedFolders,
        showConfirmation,
        setShowConfirmation,
        selectedFolder,
        setSelectedFolder,
        editMode,
        editedBlueName,
        setEditMode,
        setEditedBlueName,
        editBlueFolder,
        setCurrentBlueFolderId,
        currentBlueFolderId,
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
        deleteBlueFolder(currentBlueFolderId);
    };

    const cancelDelete = () => {
        setShowConfirmation(false);
    };
    const filteredFolders = blueFolders
        .slice() // Orijinal diziyi değiştirmemek için slice() kullanıyoruz
        .sort((a, b) => a.name.localeCompare(b.name)) // Alfabetik sıralama
        .filter(folder => 
            folder.name.toLowerCase().includes(search.toLowerCase()) // Büyük-küçük harf duyarsız arama
        );

    return (
        <div className="folder-container">
            <h3 style={{color:"blue"}} >Mavi Klasörler</h3>
            <div className="folder-input">
                <div>
                <input
                    type="text"
                    value={newBlueFolderName}
                    onChange={(e) => setBlueNewFolderName(e.target.value)}
                    placeholder="Yeni Mavi Klasör Adı"
                />
                <button onClick={() => addBlueFolder(newBlueFolderName)}>Ekle</button>
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Klasör Ara"
                />
            </div>
            <div className="folder-grid">
                {filteredFolders.length > 0 ? (
                    filteredFolders.map((folderPath, index) => {
                    const folderName = folderPath.name;
                    const blueFolderId = folderPath.id
                    return (
                        <div key={index} className="folder blue-folder">
                            {editMode && selectedFolder === folderName ? (
                            <div>
                                <input className="edit-name"
                                    type="text"
                                    value={editedBlueName}
                                    onChange={(e) => setEditedBlueName(e.target.value)}
                                    placeholder="Yeni Klasör Adı"
                                />
                                <div className="folder-buttons" >
                                <button
                                    onClick={() => {
                                        editBlueFolder( editedBlueName,blueFolderId);
                                        setEditMode(false);
                                    }}
                                >Kaydet</button>
                                <button onClick={() => setEditMode(false)}>İptal</button>
                                </div>
                            </div>
                            ) : (
                            <>
                                <Image className="red-image" src={dhmi} alt="dhmi" width={80} height={80} />
                                <span>{folderName}</span>
                                <div className="folder-buttons">
                                <button onClick={() => {
                                    setCurrentBlueFolder(folderName);
                                    //fetchBlueFolders();
                                    fetchRedFolders(blueFolderId)
                                    setCurrentBlueFolderId(blueFolderId)
                                }}>
                                    Aç</button>
                                <button
                                        onClick={() => {
                                            setSelectedFolder(folderName);
                                            setEditedBlueName(folderName);
                                            setEditMode(true);
                                        }}
                                    >
                                        Düzelt
                                    </button>
                                <button onClick={() => {
                                    handleDelete(folderName)
                                    setCurrentBlueFolderId(blueFolderId)
                                    }}>Sil</button>
                                {showConfirmation && (
                                <DeleteConfirmation
                                    folderName={selectedFolder}
                                    onConfirm={confirmDelete}
                                    onCancel={cancelDelete}
                                />
                                )}
                                </div>
                            </>
                    )}
                        </div>
                    );
                })
            ) : (
                <p style={{ color: "gray" }}>Eşleşen klasör bulunamadı.</p>
            )}
            </div>
        </div>
    );
};

export default BlueFolder;
