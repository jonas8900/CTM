import dbConnect from "@/db/connect";
import Guest from "@/db/models/Guest";
import cookie from "cookie";

export default async function handler(req, res) {
  try {
    const { guest_id } = cookie.parse(req.headers.cookie || "");
    if (!guest_id) return res.status(404).json({ known: false  });

    await dbConnect();
   const guest = await Guest.findById(guest_id).lean();

    if (!guest) return res.status(404).json({ known: false  });

    return res.status(200).json({
      known: true,
      user: {
        firstname: guest.firstname,
        lastname: guest.lastname,
        _id: guest._id,
      },
      
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ known: false, error: "Internal Server Error", });
  }
}
