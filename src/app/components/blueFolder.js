"use client";
import { useFolderContext } from "./Context";
import Image from "next/image";
import dhmi from "@/app/icons/dhmi.png";
import { Input, Button } from "@material-tailwind/react"

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
            <div className="fixed inset-0 flex items-center justify-center z-50">
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
        deleteBlueFolder(currentBlueFolderId);
    };

    const cancelDelete = () => {
        setShowConfirmation(false);
    };
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

    const filteredFolders = blueFolders
        .slice()
        .sort((a, b) => collator.compare(a.name, b.name)) // Doğal sıralama
        .filter(folder => 
            folder.name.toLowerCase().includes(search.toLowerCase())
        );

    return (
        <div >
            <div className="flex text-xl justify-between space-x-2 mb-4 mt-0.5">
                <h3 className=" w-full max-w-[16rem]" >Mavi Klasörler</h3>
                <div className="relative flex  w-full max-w-[20rem]">
                    <Input
                        type="text"
                        value={newBlueFolderName}
                        onChange={(e) => setBlueNewFolderName(e.target.value)}
                        placeholder="Yeni Mavi Klasör Adı"
                        className=" px-4 py-2 w-full max-w-[16rem]  border rounded-lg shadow-sm  focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <Button
                        size="sm"
                        className="text-sm h-10 bg-purple-500 text-white rounded-lg flex items-center justify-center w-auto px-4"
                        onClick={() => addBlueFolder(newBlueFolderName)}>
                    Ekle</Button>
                </div>
                <Input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Klasör Ara"
                    className="px-4 py-2 ml-8 w-full max-w-[16rem] border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 justify-center">
                {filteredFolders.length > 0 ? (
                    filteredFolders.map((folderPath, index) => {
                    const folderName = folderPath.name;
                    const blueFolderId = folderPath.id
                    return (
                        <div key={index} 
                        className="relative bg-blue-500 rounded-lg overflow-hidden shadow-lg h-60 w-full max-w-[12rem] flex flex-col items-center p-4 text-white">
                            {editMode && selectedFolder === folderName ? (
                            <div className="flex flex-col items-center  p-2 sm:p-4 w-full">
                                <Input className="text-black w-full p-2 rounded-md text-sm sm:text-base"
                                    type="text"
                                    value={editedBlueName}
                                    onChange={(e) => setEditedBlueName(e.target.value)}
                                    placeholder="Yeni Klasör Adı"
                                />
                                <div className=" grid grid-row-2 lg:flex lg:justify-center gap-2 mt-2 w-full" >
                                    <button
                                        className=" z-10 pointer-events-auto bg-green-500 px-4 py-1 rounded-md text-white text-xs sm:text-sm "
                                        onClick={() => {
                                            console.log("edited")
                                            editBlueFolder( editedBlueName,blueFolderId);
                                            setEditMode(false);
                                        }}
                                    >Kaydet</button>
                                    <button
                                        className="z-10 bg-red-500 px-4 py-1 rounded-md text-white text-xs sm:text-sm "
                                        onClick={() => {
                                            console.log("edited")
                                            setEditMode(false)}}
                                    >İptal</button>
                                </div>
                            </div>
                            ) : (
                            <>
                                <Image className="mx-auto mb-2" src={dhmi} alt="dhmi" width={80} height={80} />
                                <h2 className="text-lg font-bold flex-grow flex items-center justify-center text-center">
                                    {folderName}</h2>
                                <div className="grid grid-row-3 md:grid-cols-3 w-full bg-white text-gray-600 rounded-lg overflow-hidden mt-auto gap-1">
                                    <button
                                        className="px-2 py-2 h-6 md:h-full text-xs sm:text-sm w-full text-center hover:bg-gray-100 transition"
                                        onClick={() => {
                                        setCurrentBlueFolder(folderName);
                                        //fetchBlueFolders();
                                        fetchRedFolders(blueFolderId)
                                        setCurrentBlueFolderId(blueFolderId)
                                    }}>
                                        Aç</button>
                                    <button
                                        className="px-2 py-2 h-6 md:h-full text-xs sm:text-sm w-full text-center hover:bg-gray-100 transition"
                                        onClick={() => {
                                            setSelectedFolder(folderName);
                                            setEditedBlueName(folderName);
                                            setEditMode(true);
                                        }}
                                    >
                                        Düzelt
                                    </button>
                                    <button
                                        className="px-2 py-2 h-6 md:h-full text-xs sm:text-sm w-full text-center hover:bg-gray-100 transition"
                                        onClick={() => {
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
