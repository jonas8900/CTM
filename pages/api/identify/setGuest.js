import dbConnect from "@/db/connect";
import Guest from "@/db/models/Guest";
import { randomUUID } from "crypto";
import cookie from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await dbConnect();

    const { firstname, lastname } = req.body || {};
    if (!firstname || !lastname) {
      return res.status(400).json({ error: "firstname and lastname required" });
    }

    const id = randomUUID();

    await Guest.create({ _id:id, firstname, lastname });

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("guest_id", id, {
        maxAge: 60 * 60 * 24 * 400,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
      })
    );

    return res.status(201).json({ ok: true, id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
