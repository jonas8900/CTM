import useGuest from "@/components/customhooks/useGuest";
import Header from "@/components/header/header";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { TfiLayoutGrid3Alt } from "react-icons/tfi";
import { TbLayoutListFilled } from "react-icons/tb";
import {
  IoClose,
  IoChevronBack,
  IoChevronForward,
  IoImages,
  IoImage,
  IoCamera,
} from "react-icons/io5";
import useSWR from "swr";

export default function Gallery() {
  const router = useRouter();
  const { user, ready, known } = useGuest();
  const [menu, setMenu] = useState("square");
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const multiRef = useRef(null);
  const singleRef = useRef(null);
  const camRef = useRef(null);
  const { data: images, isLoading: isLoadingImages, mutate } = useSWR(
    `/api/gallery/getImages?`,
  );
  const MAX_FILES = 10;

  console.log(images);

  useEffect(() => {
    if (ready && known === false) router.push("/login");
  }, [ready, known, router]);

  useEffect(() => {
    if (!lbOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLbOpen(false);
      if (e.key === "ArrowRight")
        setLbIndex((i) => (i + 1) % images?.length);
      if (e.key === "ArrowLeft")
        setLbIndex((i) => (i - 1 + images?.length) % images?.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lbOpen]);

  const openLightbox = (idx) => {
    setLbIndex(idx);
    setLbOpen(true);
  };

  // Fallback für Browser ohne createImageBitmap 
  async function decodeToBitmap(file) {
    if ("createImageBitmap" in window) {
      try {
        return await createImageBitmap(file);
      } catch {}
    }
    // Fallback
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = url;
      });
      // Canvas->Bitmap 
      const c = document.createElement("canvas");
      c.width = img.naturalWidth || img.width;
      c.height = img.naturalHeight || img.height;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const blob = await new Promise((res) => c.toBlob(res));
      return await createImageBitmap(blob);
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async function fileToWebP(
    file,
    {
      maxDim = 1600, // lange Kante
      quality = 0.82, // Anfangsqualität
      targetBytes = 500 * 1024, // Zielgröße ~500KB
      minQuality = 0.65,
      steps = 5, // max 5 steps zur qualitätsreduktion
    } = {}
  ) {
    if (!(file instanceof File) || !file.type.startsWith("image/")) return file;

    const bitmap = await decodeToBitmap(file);
    const { width, height } = bitmap;

    const scale = Math.min(1, maxDim / Math.max(width, height));
    const tw = Math.max(1, Math.round(width * scale));
    const th = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = tw;
    canvas.height = th;
    const ctx = canvas.getContext("2d", { alpha: true });
    ctx.drawImage(bitmap, 0, 0, tw, th);

    const encode = (q) =>
      new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/webp", q)
      );

    let q = quality;
    let blob = await encode(q);
    if (!blob) return file;

    if (targetBytes && blob.size > targetBytes) {
      for (let i = 0; i < steps && q > minQuality && blob.size > targetBytes; i++) {
        q = Math.max(minQuality, q - 0.08);
        const next = await encode(q);
        if (next && next.size <= blob.size) blob = next;
      }
    }

    const name = file.name.replace(/\.[^.]+$/, ".webp");
    return new File([blob], name, { type: "image/webp", lastModified: Date.now() });
  }


  async function uploadFiles(fileList) {
    const files = Array.from(fileList || []);
      if (!files.length) return;

      // nur die ersten 10 zulassen
      let selected = files;
      if (files.length > MAX_FILES) {
        alert(`Maximal ${MAX_FILES} Bilder pro Upload. Es werden nur die ersten ${MAX_FILES} hochgeladen.`);
        selected = files.slice(0, MAX_FILES);
      }
    setUploading(true);
      try {
        for (const original of selected) {
          const processed = await fileToWebP(original, {
            maxDim: 1600,
            quality: 0.82,
            targetBytes: 700 * 1024,
            minQuality: 0.65,
            steps: 5,
          });

          const fd = new FormData();
          fd.append("image", processed, processed.name);

          const res = await fetch("/api/gallery/upload", { method: "POST", body: fd });
          if (!res.ok) throw new Error("upload failed");
        }

        setPickerOpen(false);
        router.reload(); // oder: await mutate(); dann ohne Full-Reload
      } catch (e) {
        console.error("Failed to upload image(s)", e);
        setPickerOpen(false);
      } finally {
        setUploading(false);
      }
    }

  function handleSubmit(e) {
    e.preventDefault();
    setPickerOpen((o) => !o);
  }

  return (
    <main className="relative h-screen">
      <Header />
      <div className="flex gap-4">
        <TfiLayoutGrid3Alt
          className="w-7 h-7 m-2 mr-0 cursor-pointer"
          onClick={() => setMenu("square")}
        />
        <TbLayoutListFilled
          className="w-7 h-7 m-2 ml-0 cursor-pointer"
          onClick={() => setMenu("portrait")}
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="fixed z-[99] bottom-0 pb-4 pt-4 flex items-center justify-center w-full px-4"
      >
        <button
          className="p-2 bg-[#FF8730] text-white rounded disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={uploading}
          type="submit"
        >
          {uploading ? "Lade hoch…" : "Foto hinzufügen"}
        </button>
      </form>

      {menu === "square" && (
        <section className="w-full pb-24">
          <ul className="grid grid-cols-3 gap-1 w-full">
            {images?.map((item, idx) => (
              <li
                key={item.id}
                className="relative aspect-square overflow-hidden cursor-zoom-in"
                onClick={() => openLightbox(idx)}
              >
                <Image
                  src={item.url}
                  alt={item.name}
                  fill
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  className="object-cover object-center"
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {menu === "portrait" && (
        <section className="w-full pb-24">
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full p-1">
            {images?.map((item, id) => (
              <li
                key={item.id}
                className="w-full cursor-zoom-in"
                onClick={() => openLightbox(id)}
              >
                <Image
                  src={item.url}
                  alt={item.name}
                  width={1200}
                  height={800}
                  className="block w-full h-auto"
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {lbOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-sm flex items-center justify-center cursor-zoom-out"
          role="dialog"
          aria-modal="true"
          onClick={() => setLbOpen(false)}
        >
          <div
            className="relative w-full h-full cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lbIndex]?.url}
              alt={images[lbIndex]?.name}
              fill
              className="object-contain w-full h-full"
              priority
            />
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white"
              onClick={() => setLbOpen(false)}
              aria-label="Schließen"
            >
              <IoClose className="w-6 h-6" />
            </button>
            <button
              className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white"
              onClick={() =>
                setLbIndex((i) => (i - 1 + images.length) % images.length)
              }
              aria-label="Vorheriges Bild"
            >
              <IoChevronBack className="w-7 h-7" />
            </button>
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white"
              onClick={() =>
                setLbIndex((i) => (i + 1) % images?.length)
              }
              aria-label="Nächstes Bild"
            >
              <IoChevronForward className="w-7 h-7" />
            </button>
            <div className="absolute bottom-4 left-0 right-0 text-center text-white/80 text-sm px-4">
              {images[lbIndex]?.title} · {lbIndex + 1}/{images?.length}
            </div>
          </div>
        </div>
      )}

      {pickerOpen && (
        <div className="fixed inset-x-0 bottom-16 z-[98] flex justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-[min(600px,92vw)] overflow-hidden">
            <button
              type="button"
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => multiRef.current?.click()}
              disabled={uploading}
            >
              <IoImages className="w-5 h-5" />
              Mehrere aus Galerie wählen
            </button>
            <div className="h-px bg-gray-200 dark:bg-gray-700" />
            <button
              type="button"
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => singleRef.current?.click()}
              disabled={uploading}
            >
              <IoImage className="w-5 h-5" />
              Ein Bild aus Galerie
            </button>
            <div className="h-px bg-gray-200 dark:bg-gray-700" />
            <button
              type="button"
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => camRef.current?.click()}
              disabled={uploading}
            >
              <IoCamera className="w-5 h-5" />
              Foto aufnehmen
            </button>
          </div>
        </div>
      )}

      <input
        ref={multiRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => uploadFiles(e.target.files)}
      />
      <input
        ref={singleRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => uploadFiles(e.target.files)}
      />
      <input
        ref={camRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => uploadFiles(e.target.files)}
      />
    </main>
  );
}
