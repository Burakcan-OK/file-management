"use client";
import { useFolderContext } from "./Context";
import { useState, useEffect } from "react";
import Image from "next/image";
import bbGif from "@/app/icons/bb.gif";
import { Input, Button } from "@material-tailwind/react"
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
        <div  >
            <div className="flex items-center text-xl gap-x-2 mb-4 mt-0.5">
                <Button onClick={() => {
                    fetchRedFolders(currentBlueFolderId);
                    setCurrentRedFolder(null);
                }}>
                    <Image src={bbGif} alt="gif" width={40} height={40} />
                </Button>
                <h3 className="ml-2 md:pt-1 text-sm md:text-lg">
                    {currentBlueFolder?.split("/").pop()}'a ait 
                    {currentRedFolder?.split("/").pop()} içindeki dosyalar
                </h3>
            </div>
            {previewFile ? (
                <div className="flex flex-col">
                {/* Buton ve Çizgi İçin Esnek Satır */}
                <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold">Dosya Önizleme</span>
                    <Button
                        className="text-sm px-4 py-1 h-8 bg-purple-500 text-white rounded-lg"
                        onClick={() => setPreviewFile(null)}
                    > ❌ Dosyayı Kapat</Button>
                </div>
                
                <hr className="divider"></hr>
            
                {/* PDF Önizleme */}
                <iframe
                    src={previewFile}
                    width="100%"
                    height="750px"
                    className="rounded-lg"
                ></iframe>
            </div>
            
            ) : (
                <div >
                    <div className="flex text-xl justify-between space-x-2 mb-4">
                        <Input
                            className=" px-4 py-2 w-full max-w-[16rem]  border rounded-lg shadow-sm  focus:outline-none focus:ring-2 focus:ring-purple-400"
                            type="file" 
                            onChange={handleFileChange} 
                        />
                        <Input
                            className="px-4 py-2  w-full max-w-[16rem] border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Dosya Ara"
                           
                        />
                    </div>
                    <div >
                    
                        {uploadedFiles.length === 0 ? (
                            <p>Henüz yüklenmiş dosya yok.</p>
                        ) : (
                            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-4 justify-center">
                                {filteredFiles.length > 0 ? (
                                    (filteredFiles).map((file, index) => (
                                    <div key={index}
                                        className=" bg-gray-300 rounded-lg overflow-hidden shadow-lg h-48 w-full max-w-[16rem] flex flex-col items-center p-4 text-white"
                                        >
                                        <h2 title={file.name} className="text-base w-full p-x-2 font-bold text-center break-words whitespace-normal">
                                            {file.name}
                                        </h2>
                                        <div className="grid grid-row-2 md:grid-cols-2 w-full bg-white text-gray-600 rounded-lg overflow-hidden mt-auto gap-1">
                                            <button
                                                className="px-2 py-2 h-6 md:h-full text-xs sm:text-sm w-full text-center hover:bg-gray-100 transition"
                                                onClick={() => setPreviewFile(`https://drive.google.com/file/d/${file.id}/preview`)}>
                                                Önizle
                                            </button>
                                            <button 
                                                className="px-2 py-2 h-6 md:h-full text-xs sm:text-sm w-full text-center hover:bg-gray-100 transition"
                                                onClick={() => {
                                                setCurrentFileId(file.id)
                                                handleDelete(file.name)}}
                                                >Sil</button>
                                            {showConfirmation && (
                                            <DeleteConfirmation
                                            folderName={selectedFolder}
                                            onConfirm={confirmDelete}
                                            onCancel={cancelDelete}/>)}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: "gray" }}>Eşleşen klasör bulunamadı.</p>
                            )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
    
}
export default FileUpload;
