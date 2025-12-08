// pages/api/gallery/download-zip.js
import archiver from "archiver";
import { Readable } from "stream";

export const config = {
  api: {
    responseLimit: false,
    bodyParser: { sizeLimit: "2mb" },
  },
};

const MIME_TO_EXT = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
  "image/heic": ".heic",
  "image/heif": ".heif",
  "image/bmp": ".bmp",
  "image/tiff": ".tiff",
};

function hasExt(name) { return /\.[a-z0-9]{2,5}$/i.test(name || ""); }
function getExtFromUrl(u) {
  try {
    const last = new URL(u).pathname.split("/").pop() || "";
    const m = last.match(/(\.[a-z0-9]{2,5})$/i);
    return m ? m[1].toLowerCase() : "";
  } catch { return ""; }
}
function getNameFromContentDisposition(cd) {
  if (!cd) return "";
  const star = /filename\*\s*=\s*([^']*)''([^;]+)$/i.exec(cd);
  if (star) return safeBase(decodeURIComponent(star[2]).trim());
  const plain = /filename\s*=\s*"?([^";]+)"?/i.exec(cd);
  return plain ? safeBase(plain[1].trim()) : "";
}
function safeBase(name) {
  const n = (name || "file").trim();
  return n.replace(/[\\/:*?"<>|]+/g, "_");
}
function baseFromUrl(u) {
  try {
    const raw = decodeURIComponent(new URL(u).pathname.split("/").pop() || "file");
    return safeBase(raw);
  } catch { return "file"; }
}
function ensureExt(name, { urlExt = "", mime = "" } = {}) {
  if (hasExt(name)) return name;
  if (urlExt) return name + urlExt;
  const mimeExt = MIME_TO_EXT[(mime || "").toLowerCase()] || ".jpg";
  return name + mimeExt;
}

function extractItemsFromBody(req) {
  let items = [];
  const b = req.body;
  if (!b) return items;

  if (Array.isArray(b.items)) return b.items;
  if (typeof b.items === "string") { try { return JSON.parse(b.items); } catch { return []; } }
  if (typeof b === "string") {
    try {
      const parsed = JSON.parse(b);
      return Array.isArray(parsed.items) ? parsed.items : [];
    } catch {
      const m = b.match(/(?:^|&)items=([^&]+)/);
      if (m) { try { return JSON.parse(decodeURIComponent(m[1])); } catch { return []; } }
    }
  }
  return items;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const items = extractItemsFromBody(req);
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "No items provided" });
  }

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", 'attachment; filename="gallery.zip"');

  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.on("error", (err) => {
    console.error("Archiver error:", err);
    try { res.status(500).json({ error: "ZIP error" }); } catch {}
  });
  archive.pipe(res);

  try {
    for (const it of items) {
      const url = it?.url;
      if (!url) continue;

      const response = await fetch(url); // <— global fetch
      if (!response.ok || !response.body) continue;

      const cdName = getNameFromContentDisposition(response.headers.get("content-disposition"));
      const clientName = safeBase(it?.name) || baseFromUrl(url);
      const base = cdName || clientName;

      const urlExt = getExtFromUrl(url);
      const mime = response.headers.get("content-type") || "";
      const finalName = ensureExt(base, { urlExt, mime });

      const nodeStream = Readable.fromWeb ? Readable.fromWeb(response.body) : response.body;
      archive.append(nodeStream, { name: finalName });
    }

    await archive.finalize();
  } catch (e) {
    console.error("ZIP failed:", e);
    if (!res.headersSent) res.status(500).json({ error: "ZIP failed" });
    try { archive.destroy(e); } catch {}
  }
}
