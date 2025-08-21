import dbConnect from "@/db/connect";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

import Musicwish from "@/db/models/Musicwish";


export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Ungültige ID" });
    return;
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user?.role !== "admin") {
    res.status(401).json({ error: "Nicht autorisiert" });
    return;
  }

  await dbConnect();

  try {
    switch (method) {
      case "PATCH": {
        const { status } = req.body || {};
        const allowed = ["Angenommen", "Abgelehnt"];
        if (!allowed.includes(status)) {
          res.status(400).json({ error: "Ungültiger Status (Angenommen|Abgelehnt)" });
          return;
        }

        const updated = await Musicwish.findByIdAndUpdate(
          id,
          { status },
          { new: true, runValidators: true, lean: true }
        );


        if (!updated) {
          res.status(404).json({ error: "Wunsch nicht gefunden" });
          return;
        }

        res.status(200).json(updated);
        return;
      }

      case "DELETE": {

        const deleted = await Musicwish.findByIdAndDelete(id).lean();
        if (!deleted) {
          res.status(404).json({ error: "Wunsch nicht gefunden" });
          return;
        }
        res.status(204).end();
        return;
      }

      default: {
        res.setHeader("Allow", ["PATCH", "DELETE"]);
        res.status(405).json({ error: `Methode ${method} nicht erlaubt` });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
}
