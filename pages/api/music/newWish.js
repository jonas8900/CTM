import dbConnect from "@/db/connect";
import mongoose from "mongoose";
import Guest from "@/db/models/Guest";
import Musicwish from "@/db/models/Musicwish";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await dbConnect();

    const { title, artist, image, userId } = req.body;

    if (!title || !artist || !image || !userId) {
      return res.status(400).json({ message: "Fehlende Daten" });
    }

    const user = await Guest.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    const newWish = await Musicwish.create({
      title,
      artist,
      image,
      status: "Wartet",
      time: Date.now(), 
      user: user._id,   
    });

    await newWish.populate("user", "firstname lastname");
    return res.status(201).json(newWish);
    
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Serverfehler", error: err.message });
  }
}
