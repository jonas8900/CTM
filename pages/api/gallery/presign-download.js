import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export default async function handler(req, res) {
  try {
    const { key, filename } = req.query;
    if (!key) return res.status(400).json({ error: "Missing key" });

    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${(filename || key.split("/").pop()).replace(/"/g, '')}"`,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 60 });
    res.status(200).json({ url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to presign" });
  }
}
