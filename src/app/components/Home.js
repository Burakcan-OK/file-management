"use client";
import { useFolderContext } from "./Context";
import { useEffect } from "react";
import BlueFolder from "./blueFolder";
import RedFolder from "./redFolder";
import FileUpload from "./fileUpload"
import { useSession, signIn } from "next-auth/react";

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
        await fetch("/api/auth/logout");
        setUser(null);
    };


    if (!user) {
        return (
            <div className="auth-container">
                <h1>Giriş Yap</h1>
                <button className="login-btn" onClick={() => signIn("google")}>
                    Google ile Giriş Yap
                </button>
            </div>
        );
    }

    return (
        <div>
            <h1 className="folder-container" >Dosya Yönetimi</h1>
            <div className="auth-buttons">
                <p>Hoşgeldin, <strong>{user.name}</strong></p>
                <button className="logout-btn" onClick={handleLogout}>Çıkış Yap</button>
            </div>
            {currentBlueFolder ? 
            (currentRedFolder ? <FileUpload /> : <RedFolder />
            ) : <BlueFolder />}
        </div>

    );
};
