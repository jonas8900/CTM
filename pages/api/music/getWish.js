import dbConnect from "@/db/connect";
import Musicwish from "@/db/models/Musicwish";

export default async function handler(req, res) {
    if (req.method === 'GET') {

        dbConnect();

        try {
            const wishes = await Musicwish.find();
            res.status(200).json(wishes);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch wishes' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}