"use client";
import { useEffect,useState } from "react";
import { useFolderContext } from "./Context";
import { Button } from "@material-tailwind/react"

const MetadataForm = ({ redFolderId}) => {
    const {
        fetchRedFolderData,
        addRedFolderData,
    } = useFolderContext ();
    const [loading, setLoading] = useState(true);
    const [metadataMap, setMetadataMap] = useState({});
    const metadata = metadataMap[redFolderId] ?? {
        court: "",
        plaintiff: "",
        defendant: "",
        subject: "",
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await fetchRedFolderData(redFolderId);
                setMetadataMap((prev) => ({
                    ...prev,
                    [redFolderId]: data || {
                        court: "",
                        plaintiff: "",
                        defendant: "",
                        subject: "",
                    }, // Eğer metadata yoksa varsayılan boş değerleri koy
                }));
            } catch (error) {
                console.error("Metadata yüklenirken hata:", error);
            } finally {
                setLoading(false); // API çağrısı tamamlanınca loading'i kapat
            }
        };
    
        fetchData();
    }, [redFolderId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMetadataMap((prev) => ({
            ...prev,
            [redFolderId]: {
                ...prev[redFolderId],
                [name]: value,
            },
        }));
    };
    

    const handleSave = () => {
        addRedFolderData(redFolderId, metadataMap[redFolderId]); // metadata'yı kopyalayıp gönder
    };

    return (
        <div className="">
            <label
                className="block text-sm text-gray-500 dark:text-gray-300"
                >Mahkeme</label>
            <textarea
                className=" block mt-1 ml-2 w-full max-w-[8rem] h-full max-h-[3rem] placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-4 h-32 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                type="text"
                name="court"
                value={metadata.court}
                onChange={handleInputChange}
                placeholder="Mahkeme"
                disabled={loading}
            />
            <label
                className="block text-sm text-gray-500 dark:text-gray-300"
                >Davacı</label>
            <textarea
                className="block mt-1 ml-2 w-full max-w-[8rem] h-full max-h-[3rem]  placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-4 h-32 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                type="text"
                name="plaintiff"
                value={metadata.plaintiff}
                onChange={handleInputChange}
                placeholder="Davacı"
                disabled={loading}
            />
            <label
                className="block text-sm text-gray-500 dark:text-gray-300"
                >Davalı</label>
            <textarea
                className="block  mt-1 ml-2 w-full max-w-[8rem] h-full max-h-[3rem]  placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-4 h-32 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                type="text"
                name="defendant"
                value={metadata.defendant}
                onChange={handleInputChange}
                placeholder="Davalı"
                disabled={loading}
            />
            <label
                className="block text-sm text-gray-500 dark:text-gray-300"
                >Konu</label>
            <textarea
                className="block  mt-1 ml-2 w-full max-w-[8rem] h-full max-h-[3rem]  placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-4 h-32 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                type="text"
                name="subject"
                value={metadata.subject}
                onChange={handleInputChange}
                placeholder="Konu"
                disabled={loading}
            />
            <Button
                className="text-sm mt-1 mb-1 px-4 ml-8 mr-8 h-10 bg-purple-500 text-white rounded-lg"
                onClick={handleSave} disabled={loading}>
                {loading ? "Yükleniyor..." : "Kaydet"}
            </Button>
        </div>
    );
};

export default MetadataForm;