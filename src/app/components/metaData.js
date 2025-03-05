"use client";
import { useEffect,useState } from "react";
import { useFolderContext } from "./Context";

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
        <div className="edit-input">
            <label>Mahkeme</label>
            <textarea
                type="text"
                name="court"
                value={metadata.court}
                onChange={handleInputChange}
                placeholder="Mahkeme"
                disabled={loading}
            />
            <label>Davacı</label>
            <textarea
                type="text"
                name="plaintiff"
                value={metadata.plaintiff}
                onChange={handleInputChange}
                placeholder="Davacı"
                disabled={loading}
            />
            <label>Davalı</label>
            <textarea
                type="text"
                name="defendant"
                value={metadata.defendant}
                onChange={handleInputChange}
                placeholder="Davalı"
                disabled={loading}
            />
            <label>Konu</label>
            <textarea
                type="text"
                name="subject"
                value={metadata.subject}
                onChange={handleInputChange}
                placeholder="Konu"
                disabled={loading}
            />
            <button onClick={handleSave} disabled={loading}>
                {loading ? "Yükleniyor..." : "Kaydet"}
            </button>
        </div>
    );
};

export default MetadataForm;