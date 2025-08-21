import dbConnect from "@/db/connect";
import ImageModel from "@/db/models/Image";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Methode nicht erlaubt" });
  }

  try {
    const { userId, limit = "100" } = req.query;

    const filter = {};
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      filter.uploadedBy = userId;
    }


    const images = await ImageModel.find(filter)
      .select("name url uploadedBy createdAt") 
      .sort({ createdAt: -1 })             
      .limit()
      .lean();                               

    return res.status(200).json(images);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
}
