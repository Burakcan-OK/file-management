"use client";
import { FolderProvider } from "./components/Context";
import Home from "./components/Home";
import { SessionProvider } from "next-auth/react"; 

export default function App() {
    return (
        <SessionProvider >  {/* ✅ NextAuth Sağlayıcı Eklendi */}
            <FolderProvider>
                <Home />
            </FolderProvider>
        </SessionProvider>
    );
}


// "use client";
// import { useState, useEffect } from 'react';
// import axios from 'axios';

// export default function Home() {
//     const [blueFolders, setBlueFolders] = useState([]);
//     const [currentBlueFolder, setCurrentBlueFolder] = useState(null);
//     const [newFolderName, setNewFolderName] = useState('');
//     const [newRedFolderName, setRedNewFolderName] = useState('');
//     const [redFolders, setRedFolders] = useState([]);
//     const [currentRedFolder, setCurrentRedFolder] = useState(null);
//     const [redFoldersByBlueFolder, setRedFoldersByBlueFolder] = useState({});

//     const port = 3000
//     const http = 'http://localhost'
//     const locDir = 'api/upload'


//     useEffect(() => {
//         axios
//             .get(`${http}:${port}/${locDir}`,{ params: { type: "blue" } })
//             .then((response) => {
//               console.log("blueget",response)
//                 setBlueFolders(response.data.folderPath);
//             })
//             .catch((error) => {
//                 console.error("Dosya listesi alınırken bir hata oluştu:", error.message);
//             });
//     }, []);

//     const addBlueFolder = () => {
//         if (!newFolderName.trim()) {
//             console.error("Klasör adı boş olamaz");
//             return;
//         }
    
//         console.log("Yeni klasör adı gönderiliyor:", newFolderName);  // Hangi klasör adının gönderildiğini logla
    
//         axios
//             .post(`${http}:${port}/${locDir}`, { name: newFolderName, type: "blue" })
//             .then((response) => {
//                 console.log("Addblue:", response);  // API'den gelen yanıtı logla
//                 setBlueFolders([...blueFolders, response.data.folderPath]);
//                 console.log("blueFolders",blueFolders)
//                 setNewFolderName('');
//             })
//             .catch((error) => {
//                 console.error("Klasör ekleme hatası:", error);  // Hata mesajını logla
//                 if (error.response) {
//                     console.error("Sunucudan gelen hata:", error.response.data);
//                     alert("Klasör ekleme hatası: " + error.response.data.error);
//                 } else {
//                     alert("Klasör ekleme hatası: " + error.message);
//                 }
//             });
//     };

//     const deleteBlueFolder = (folderName) => {
//       axios
//       .delete(`${http}:${port}/${locDir}`, { data: { name: folderName, type: "blue" } })
//       .then((response) => {
//         console.log("Deletelue:", response);
//           alert(response.data.message);
//           axios
//                 .get(`${http}:${port}/${locDir}`, { params: { type: "blue" } })
//                 .then((response) => {
//                     setBlueFolders(response.data.folderPath);
//                 })
//                 .catch((error) => {
//                     console.error("Dosya listesi alınırken bir hata oluştu:", error.message);
//                 });

//       })
//       .catch((error) => {
//           console.error("Klasör silme hatası:", error);
//           alert("Klasör silme hatası: " + error.message);
//       });
//   };
  
//   const addRedFolder = (blueFolder) => {
//     if (!newRedFolderName.trim()) {
//         console.error("Klasör adı boş olamaz");
//         return;
//     }

//     axios
//         .post(`${http}:${port}/${locDir}`, { name: newRedFolderName, parentFolder: blueFolder, type: "red" })
//         .then((response) => {
//           console.log("Addred:", response);
//             setRedFolders((prev) => [...prev, response.data.folderPath]); // Yeni kırmızı klasörü ekle
//             setRedNewFolderName('');
//         })
//         .catch((error) => {
//             console.error("Kırmızı klasör ekleme hatası:", error.message);
//         });
// };




//   const deleteRedFolder = (blueFolder, redFolderName) => {
//     axios
//         .delete(`${http}:${port}/${locDir}`, { data: { name: redFolderName, parentFolder: blueFolder, type: "red" } })
//         .then((response) => {
//           console.log("Deletered:", response);
//           axios
//           .get(`${http}:${port}/${locDir}`,{ params: {blueFolder:blueFolder, type: "red" } })
//           .then((response) => {
//             console.log("getred:", response);
//             setRedFolders(response.data.folderPath)
//           })
            

//         })
//         .catch((error) => {
//             console.error("Kırmızı klasör silme hatası:", error.message);
//         });
//   };


//   const loadRedFolders = (blueFolder) => {
//     axios
//         .get(`${http}:${port}/${locDir}`,{ params: {blueFolder:blueFolder, type: "red" } })
//         .then((response) => {
//           console.log("getred:", response);
//           setRedFolders(response.data.folderPath)
//         })
//         .catch((error) => {
//             console.error("Kırmızı klasörler alınırken bir hata oluştu:", error.message);
//         });
//   };

//   return (
//     <div>
//         <h1>Dosya Yükleme ve Önizleme</h1>
//         {currentBlueFolder ? (
//             <div>
//                 <button onClick={() => setCurrentBlueFolder(null)}>Geri Dön</button>

//                 {/* Yeni kırmızı klasör ekleme */}
//                 <input
//                     type="text"
//                     value={newRedFolderName}
//                     onChange={(e) => setRedNewFolderName(e.target.value)}
//                     placeholder="Yeni Kırmızı Klasör Adı"
//                 />
//                 <button onClick={() => addRedFolder(currentBlueFolder)}>Yeni Kırmızı Klasör Ekle</button>

//                 {/* Kırmızı klasörlerin listelenmesi */}
//                 <ul>
//                     {redFolders.map((redFolderPath, index) => {
//                         const folderName = redFolderPath.split('/').pop(); // Klasör adı
//                         return (
//                             <li key={index}>
//                                 <span>{folderName}</span>
//                                 <button onClick={() => setCurrentRedFolder(redFolderPath)}>Önizle</button>
//                                 <button onClick={() => deleteRedFolder(currentBlueFolder, folderName)}>Sil</button>
//                             </li>
//                         );
//                     })}
//                 </ul>
//             </div>
//         ) : (
//             <div>
//                 {/* Mavi klasörlerin listelenmesi */}
//                 <input
//                     type="text"
//                     value={newFolderName}
//                     onChange={(e) => setNewFolderName(e.target.value)}
//                     placeholder="Yeni Mavi Klasör Adı"
//                 />
//                 <button onClick={addBlueFolder}>Mavi Klasör Ekle</button>
//                 <ul>
//                     {blueFolders.map((folderPath, index) => {
//                         const folderName = folderPath.split('/').pop();
//                         return (
//                             <li key={index}>
//                                 <span>{folderName}</span>
//                                 <button
//                                     onClick={() => {
//                                         setCurrentBlueFolder(folderPath);
//                                         loadRedFolders(folderPath);
//                                     }}
//                                 >
//                                     Önizle
//                                 </button>
//                                 <button onClick={() => deleteBlueFolder(folderName)}>Sil</button>
//                             </li>
//                         );
//                     })}
//                 </ul>
//             </div>
//         )}
//     </div>
//   );
// }
