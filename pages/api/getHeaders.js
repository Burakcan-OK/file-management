import { headers } from 'next/headers';

export default function handler(req, res) {
    res.status(200).json({ message: "Headers endpoint çalışıyor!" });
}

