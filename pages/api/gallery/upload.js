// pages/api/gallery/upload.js
import dbConnect from "@/db/connect";
import ImageModel from "@/db/models/Image";
import formidable from "formidable";
import sharp from "sharp";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import path from "path";
import fs from "fs/promises";

export const config = { api: { bodyParser: false } };

const s3 = new S3Client({ region: process.env.AWS_REGION });

function safeBaseName(name = "image") {
  const base = path.parse(name).name || "image";
  return base.replace(/[^\w\-]+/g, "_").slice(0, 200);
}

function pickFirstFile(files) {
  if (!files) return null;
  let f = files.image ?? files.file ?? Object.values(files)[0];
  if (Array.isArray(f)) f = f[0];
  return f || null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end();
  }

  await dbConnect();

  // 1) Multipart einlesen (kein bodyParser!)
  const { fields, files } = await new Promise((resolve, reject) => {
    const form = formidable({ multiples: true, maxFileSize: 20 * 1024 * 1024 });
    form.parse(req, (err, fields, files) => (err ? reject(err) : resolve({ fields, files })));
  });

  const file = pickFirstFile(files);
  if (!file) return res.status(400).json({ error: "Keine Datei hochgeladen" });

  const filepath = file.filepath || file.path || file.tempFilePath;
  if (!filepath) return res.status(400).json({ error: "Upload-Datei hat keinen Pfad" });

  if (file.mimetype && !file.mimetype.startsWith("image/")) {
    return res.status(400).json({ error: "Nur Bilddateien erlaubt" });
  }

  // 4) Datei als Buffer lesen und per sharp verarbeiten
  const input = await fs.readFile(filepath); // <-- wichtig: Buffer statt Pfad
  const webpBuffer = await sharp(input)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 }) // smartSubsample ist für JPEG, daher raus
    .toBuffer();

  const base = safeBaseName(file.originalFilename || file.newFilename || "image");
  const rand = crypto.randomBytes(6).toString("hex");
  const key = `uploads/${new Date().toISOString().slice(0, 10)}/${Date.now()}_${base}_${rand}.webp`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: webpBuffer,
      ContentType: "image/webp",
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  const doc = await ImageModel.create({ name: base, url });

  return res.status(201).json(doc);
}
