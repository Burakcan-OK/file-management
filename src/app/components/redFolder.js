"use client";
import { useFolderContext } from "./Context";
import MetadataForm from "./metaData";
import Image from "next/image";
import bbGif from "@/app/icons/bb.gif";
import dhmi from "@/app/icons/dhmi.png";
import { Input, Button } from "@material-tailwind/react"

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
            <div className="fixed inset-0 flex items-center justify-center  z-50">
                <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-sm">
                    <p className="text-center font-semibold mb-4">
                        {folderName} klasörünü silmek istediğinizden emin misiniz?
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            className="bg-red-500 px-4 py-2 rounded-md text-white text-sm"
                            onClick={onConfirm}
                        >
                            Evet
                        </button>
                        <button
                            className="bg-gray-400 px-4 py-2 rounded-md text-white text-sm"
                            onClick={onCancel}
                        >
                            Hayır
                        </button>
                    </div>
                </div>
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
        <div>
            <div className="flex text-xl justify-between space-x-2  mb-4 mt-0.5">
                <div className="flex flex-row md:pb-4 pb-2 w-full max-w-[24rem]" >
                    <Button
                        className=" mx-auto pt-4 md:pt-0"
                        onClick={() => setCurrentBlueFolder(null)}>
                        <Image src={bbGif} alt="gif"  />
                    </Button>
                    <h3 className=" ml-4 mr-4 md:pt-1 w-full max-w-[24rem] text-sm md:text-xl" >
                        {currentBlueFolder?.split("/").pop()} içindeki 
                        Kırmızı Klasörler
                    </h3>
                    
                </div>
                <div className="relative flex w-full max-w-[24rem]">
                    <Input
                        className=" px-4 py-2 w-full max-w-[16rem]  border rounded-lg shadow-sm  focus:outline-none focus:ring-2 focus:ring-purple-400"
                        type="text"
                        value={newRedFolderName}
                        onChange={(e) => setNewRedFolderName(e.target.value)}
                        placeholder="Yeni Kırmızı Klasör Adı"
                    />
                    <Button
                        size="sm"
                        className="text-sm h-10 bg-purple-500 text-white rounded-lg flex items-center justify-center w-auto px-4"
                        onClick={() => addRedFolder(currentBlueFolderId, newRedFolderName)}
                    >Ekle</Button>
                </div>
                <Input
                    className="px-4 py-2  w-full max-w-[16rem] border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Klasör Ara"
                />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 justify-center" >
                {filteredFolders.length > 0 ? (
                    filteredFolders.map((folderPath, index)=> {
                    const folderName = folderPath.name;
                    const redFolderId = folderPath.id
                    return (
                        <div key={index} 
                        className="relative bg-red-500 rounded-lg overflow-hidden shadow-lg h-full max-h-[48rem] w-full max-w-[20rem] flex flex-col items-center p-4 text-white">
                            {editMode && selectedFolder === folderName ? (
                            <div className="flex flex-col items-center  p-2 sm:p-4 w-full">
                                <Input className="text-black w-full p-2 rounded-md text-sm sm:text-base"
                                type="text"
                                value={editedRedName}
                                onChange={(e) =>setEditedRedName(e.target.value)}
                                placeholder="Yeni Klasör Adı"
                                />
                                <div className=" grid grid-row-2 lg:flex lg:justify-center gap-2 mt-2 w-full" >
                                    <Button
                                        className=" z-10 bg-green-500 px-4 py-1 rounded-md text-white text-xs sm:text-sm "
                                        onClick={() => {
                                            editRedFolder(redFolderId, editedRedName);
                                            setEditMode(false);
                                        }}
                                    >Kaydet</Button>
                                    <Button
                                        className="bg-red-500 px-4 py-1 rounded-md text-white text-xs sm:text-sm "
                                        onClick={() => setEditMode(false)}>İptal</Button>
                                </div>
                            </div>
                            ): (
                            <>
                                <Image className="mx-auto mb-2" src={dhmi} alt="dhmi" width={40} height={40} />
                                <h2 className="text-lg font-bold flex-grow flex items-center justify-center text-center">
                                    {folderName}</h2>
                                <MetadataForm key={redFolderId} redFolderId={redFolderId} />
                                <div className="grid grid-row-3 md:grid-cols-3 w-full bg-white text-gray-600 rounded-lg overflow-hidden mt-auto gap-1">
                                    <button
                                        className="px-2 py-2 h-6 md:h-full text-xs sm:text-sm w-full text-center hover:bg-gray-100 transition "
                                        onClick={() => {
                                        setCurrentRedFolder(folderName)
                                        setCurrentRedFolderId(redFolderId)
                                        getFile(redFolderId)
                                    }}>Aç</button>
                                    <button
                                        className="px-2 py-2 h-6 md:h-full text-xs sm:text-sm w-full text-center hover:bg-gray-100 transition "
                                        onClick={() => {
                                        setSelectedFolder(folderName)
                                        setEditedRedName(folderName)
                                        setEditMode(true)
                                    }} >
                                        Düzelt
                                    </button>
                                    <button
                                        className="px-2 py-2 h-6 md:h-full text-xs sm:text-sm w-full text-center hover:bg-gray-100 transition "
                                        onClick={() => {
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
