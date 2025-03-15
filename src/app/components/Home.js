"use client";
import { useFolderContext } from "./Context";
import { useEffect } from "react";
import BlueFolder from "./blueFolder";
import RedFolder from "./redFolder";
import FileUpload from "./fileUpload"
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
    const { currentBlueFolder, currentRedFolder,setUser,user} = useFolderContext();
    const { data: session, status, update } = useSession();
    useEffect(() => {
        if (status === "authenticated" && session) {
            setUser({
                name: session.user.name,
                email: session.user.email,
            });
        }
    }, [status, session]);

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" }); 
    };


    if (!user) {
        return (
            <div className="bg-gray-100 h-screen flex items-center justify-center">
                <div className="w-[90%] mb-48 bg-white shadow-xl rounded-2xl p-6 flex flex-col items-center">
                    <h1 className=" flex text-center">
                        Merhaba, "Dosya Yönetim" sistemine erişebilmek için geçerli gmail hesabı ile oturum açmış olmalısın. Eğer oturumun açıksa Google ile giriş yap düğmesine tıkla.
                        </h1>
                    <button className=" w-full max-w-[32rem] bg-purple-500 text-white px-4 py-2 rounded-lg" onClick={() => signIn("google")}>
                        Google ile Giriş Yap
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 h-screen flex justify-center" >
            <div className="w-[90%]  bg-white shadow-xl rounded-2xl p-6 flex flex-col" >
                {/* Sticky Header */}
                <div className="sticky top-0 bg-white z-10 p-4 shadow-md rounded-2xl">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold">Dosya Yönetimi</h1>
                        <p>Hoş Geldin, <strong>{user.name}</strong></p>
                        <button className="bg-purple-500 text-white px-4 py-2 rounded-lg" onClick={handleLogout}>Çıkış Yap</button>
                    </div>
                </div>

                {/* İçerik Alanı */}
                <div className="flex-1 overflow-auto mt-4">
                    {currentBlueFolder ? 
                        (currentRedFolder ? <FileUpload /> : <RedFolder />) 
                        : <BlueFolder />
                    }
                </div>
            </div>
        </div>

    );
};
