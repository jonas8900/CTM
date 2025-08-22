import useGuest from "@/components/customhooks/useGuest";
import Header from "@/components/header/header";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";
import { TfiLayoutGrid3Alt } from "react-icons/tfi";
import { TbLayoutListFilled } from "react-icons/tb";
import {
  IoClose,
  IoChevronBack,
  IoChevronForward,
  IoImages,
  IoImage,
  IoCamera,
  IoCloseCircle
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
  const {
    data: images,
    isLoading: isLoadingImages,
    mutate,
  } = useSWR(`/api/gallery/getImages?`);
  const MAX_FILES = 10;


  useEffect(() => {
    if (!lbOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLbOpen(false);
      if (e.key === "ArrowRight") setLbIndex((i) => (i + 1) % images?.length);
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


  async function handleDeleteImage(imageId) {
    if (!confirm("Bist du sicher, dass du dieses Bild löschen möchtest?")) return;
    try {
      const res = await fetch(`/api/gallery/deleteImage/${imageId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Fehler beim Löschen des Bildes");
      mutate();
    } catch (error) {
      console.error("Fehler beim Löschen des Bildes:", error);
      alert("Fehler beim Löschen des Bildes. Bitte versuche es später erneut.");
    }
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

    
      {menu === "square" && (

        <section className="w-full pb-24">
          <ul className="grid grid-cols-3 gap-1 w-full">
            {images?.map((item, idx) => (
              <li key={item._id} className="relative">
                <IoCloseCircle className="absolute z-99 top-1 right-1 w-8 h-8 text-red-500 cursor-pointer" onClick={() => handleDeleteImage(item._id)} />
                <div
                    className="relative aspect-square overflow-hidden cursor-zoom-in"
                    onClick={() => openLightbox(idx)}>
                    <Image
                    src={item.url}
                    alt={item.name}
                    fill
                    sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                    className="object-cover object-center"
                    />
                </div>
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
                onClick={() => openLightbox(id)}>
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
          onClick={() => setLbOpen(false)}>
          <div
            className="relative w-full h-full cursor-default"
            onClick={(e) => e.stopPropagation()}>
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
              aria-label="Schließen">
              <IoClose className="w-6 h-6" />
            </button>
            <button
              className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white"
              onClick={() =>
                setLbIndex((i) => (i - 1 + images.length) % images.length)
              }
              aria-label="Vorheriges Bild">
              <IoChevronBack className="w-7 h-7" />
            </button>
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white"
              onClick={() => setLbIndex((i) => (i + 1) % images?.length)}
              aria-label="Nächstes Bild">
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
              disabled={uploading}>
              <IoImages className="w-5 h-5" />
              Mehrere aus Galerie wählen
            </button>
            <div className="h-px bg-gray-200 dark:bg-gray-700" />
            <button
              type="button"
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => singleRef.current?.click()}
              disabled={uploading}>
              <IoImage className="w-5 h-5" />
              Ein Bild aus Galerie
            </button>
            <div className="h-px bg-gray-200 dark:bg-gray-700" />
            <button
              type="button"
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => camRef.current?.click()}
              disabled={uploading}>
              <IoCamera className="w-5 h-5" />
              Foto aufnehmen
            </button>
          </div>
        </div>
      )}

    </main>
  );
}
