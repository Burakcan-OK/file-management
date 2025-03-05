import { serialize } from "cookie";

export default function handler(req, res) {
    res.setHeader("Set-Cookie", serialize("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0
    }));

    res.redirect("/");
}
