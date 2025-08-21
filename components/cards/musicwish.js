import Image from "next/image";
import { useState } from "react";

export default function MusicWishCard({ wish }) {
    const fallback = "/partyimage.jpeg";
    const [imgSrc, setImgSrc] = useState(wish.image || fallback);


    function formatTime(isoString) {
        if (!isoString) return "";

        const date = new Date(isoString);
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${hours}:${minutes}`;
    }


    return (
        <li className="bg-white border border-gray-300 dark:bg-gray-700 shadow-md rounded-xl p-4 grid grid-cols-[1fr_.4fr] grid-rows-[1fr_1fr]">
           <div className="flex items-center gap-2 col-[1/2] row-[1/2] min-w-0">
                <Image
                src={imgSrc}
                alt={`cover image for ${wish.title}`}
                width={28}
                height={28}
                className="rounded-sm object-cover w-7 h-7 shrink-0"
                onError={() => setImgSrc(fallback)}
                />
                <span className="text-sm text-gray-500 dark:text-gray-300 flex-1 min-w-0 overflow-hidden whitespace-nowrap text-ellipsis">
                {wish.artist}
                </span>
            </div>
        <h3 className="col-start-1 col-end-2 row-start-2 row-end-3 
                    text-lg  text-gray-800 dark:text-gray-100 
                    overflow-hidden whitespace-nowrap truncate">
        {wish.title}
        </h3>


        <span className="col-start-2 col-end-3 row-start-1 row-end-2 justify-self-end text-xs text-gray-400 dark:text-gray-300">
            {formatTime(wish.time)}
        </span>

        <span className="col-start-2 col-end-3 row-start-2 row-end-3 justify-self-end text-sm font-medium text-gray-600 dark:text-gray-200">
            {wish.status}
        </span>
        </li>
    );
}
