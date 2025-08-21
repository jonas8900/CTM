import MainButton from "@/components/buttons/mainbutton";
import Header from "@/components/header/header";
import { VscAccount } from "react-icons/vsc";
import { IoSettingsOutline } from "react-icons/io5";
import { LuPartyPopper } from "react-icons/lu";
import { GrGroup } from "react-icons/gr";
import { useRouter } from "next/router";
import useGuest from "@/components/customhooks/useGuest";
import { useEffect } from "react";

export default function Home() {
    const router = useRouter();


    return(
        <>
            <Header  />
            <section>
                <h2 className="text-3xl max-w-3/4 text-left ml-10 mt-5 font-bold text-gray-700 dark:text-gray-200">Verwalte jetzt deine Veranstaltung</h2>
                <div className="flex flex-row gap-5 mt-10 flex-wrap items-center justify-center">
                    <MainButton
                    className="bg-button-primary text-xl shadow-md text-gray-800 gap-2 flex flex-col items-center justify-center active:bg-[linear-gradient(90deg,#ef4444_0%,#f97316_16.6%,#eab308_33.3%,#22c55e_50%,#3b82f6_66.6%,#6366f1_83.3%,#a855f7_100%)] active:text-white"
                    onClick={() => router.push("/musicwishes")}
                    >
                    <GrGroup className="w-6 h-6" />
                    <span>Musikwunsch</span>
                    </MainButton>

                    <MainButton
                    className="bg-secondary text-xl shadow-md text-gray-800 gap-2 flex flex-col items-center justify-center active:bg-[linear-gradient(90deg,#ef4444_0%,#f97316_16.6%,#eab308_33.3%,#22c55e_50%,#3b82f6_66.6%,#6366f1_83.3%,#a855f7_100%)] active:text-white"
                    onClick={() => router.push("/galery")}
                    >
                    <LuPartyPopper className="w-6 h-6" />
                    <span>Bilder</span>
                    </MainButton>

                </div>
            </section>
        </>
    )
}