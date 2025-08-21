import MusicWishCard from "@/components/cards/musicwish";
import Header from "@/components/header/header";
import ErrorMessage from "@/components/toast/ErrorMessage";
import SuccessMessage from "@/components/toast/SuccessMessage";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { IoCloseSharp, IoRefresh, IoCheckmarkSharp, IoTrashSharp } from "react-icons/io5";

import useSWR from "swr";

 export default function Admindashboard() {
    const { data: session } = useSession();
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const { data: wishes, isLoading: isLoadingWishes, mutate } = useSWR(
    `/api/music/getWish?`,
    );


    async function handleWishAction(id, action) {
        try {
            const optimistic = action === "delete"
                ? (wishes ?? []).filter((w) => w._id !== id)
                : (wishes ?? []).map((w) =>
                    w._id === id
                    ? { ...w, status: action === "accept" ? "accepted" : "rejected" }
                    : w
                );

            await mutate(optimistic, { revalidate: false });

            const res = await fetch(`/api/music/admin/${id}`, {
            method: action === "delete" ? "DELETE" : "PATCH",
            headers: action === "delete" ? {} : { "Content-Type": "application/json" },
            body:
                action === "delete"
                ? null
                : JSON.stringify({
                    status: action === "accept" ? "Angenommen" : "Abgelehnt",
                    }),
            });

            if (!res.ok) throw new Error("Request failed");

            await mutate();

            setShowSuccess(true);
            setToastMessage(
            action === "delete"
                ? "Wunsch gelöscht"
                : action === "accept"
                ? "Wunsch angenommen"
                : "Wunsch abgelehnt"
            );
            setTimeout(() => {
            setShowSuccess(false);
            setToastMessage("");
            }, 1000);
        } catch (e) {
            await mutate();
            setShowError(true);
            setToastMessage("Konnte Aktion nicht ausführen");
            setTimeout(() => {
            setShowError(false);
            setToastMessage("");
            }, 1000);
        }
        }

 
 return (

    <div className="grid h-dvh grid-rows-[auto_minmax(0,1fr)] overflow-hidden">
      <Header className="sticky top-0 z-10" />
      {showError && <ErrorMessage message={toastMessage} />}
      {showSuccess && <SuccessMessage message={toastMessage} />}    

      <section className="grid grid-rows-[auto_minmax(0,1fr)_auto] bg-white dark:bg-gray-800 shadow-md rounded-md p-6 overflow-hidden">
        <h2 className="text-3xl max-w-[75%] text-left ml-10 mb-4 font-bold text-gray-700 dark:text-gray-200">
          Adminliste
        </h2>


        <div className="border relative rounded-sm border-gray-300 dark:border-gray-700 p-4 overflow-y-auto min-h-0 h-full overscroll-contain">
           <button
            onClick={() => mutate()} 
            className="p-2 absolute top-1 right-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Liste aktualisieren"
          >
            <IoRefresh className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <ul className="space-y-4 mt-6">
            {wishes?.map((wish) => (
                <>
                    <MusicWishCard wish={wish} />

                    
                    <div className="mt-2 mb-12 grid grid-cols-3 items-center">

                        <button
                        onClick={() => handleWishAction(wish._id, "accept")}
                        className="justify-self-start p-2 rounded-full border border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20"
                        title="Angenommen"
                        aria-label="Angenommen"
                        >
                        <IoCheckmarkSharp className="w-6 h-6 text-green-600" />
                        </button>

            
                        <button
                        onClick={() => handleWishAction(wish._id, "reject")}
                        className="justify-self-center p-2 rounded-full border border-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                        title="Abgelehnt"
                        aria-label="Abgelehnt"
                        >
                        <IoCloseSharp className="w-6 h-6 text-yellow-500" />
                        </button>

                
                        <button
                        onClick={() => handleWishAction(wish._id, "delete")}
                        className="justify-self-end p-2 rounded-full border border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Löschen"
                        aria-label="Löschen"
                        >
                        <IoTrashSharp className="w-6 h-6 text-red-600" />
                        </button>
                    </div>
                </>
                ))}
            </ul>

        </div>

      </section>
    </div>
 )
}