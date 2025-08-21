import Header from "@/components/header/header";
import ErrorMessage from "@/components/toast/ErrorMessage";
import SuccessMessage from "@/components/toast/SuccessMessage";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Login() {
    const router = useRouter();
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [toastMessage, setToastMessage] = useState("");



    async function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
    
        const response = await fetch("/api/identify/setGuest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if(response.ok) {
            setShowSuccess(true);
            setToastMessage("Erfolgreich 🎉");
            setTimeout(() => {
                setShowSuccess(false);
                setToastMessage("");
                router.push("/");
            }, 1000);
            
        } else {
            setShowError(true);
            setToastMessage("Leider gab es ein Problem 😢");
            setTimeout(() => {
                setShowError(false);
                setToastMessage("");
            }, 3000);
        }
 
    }


    return (
        <div className="grid min-h-dvh grid-rows-[auto_minmax(0,1fr)] overflow-hidden">
        <Header className="sticky top-0 z-10" />
        {showError && <ErrorMessage message={toastMessage} />}
        {showSuccess && <SuccessMessage message={toastMessage} />}    

        <main className="flex items-center justify-center p-6">
            <section className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
                Dein Name
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                <label
                    htmlFor="firstname"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    Vorname
                </label>
                <input
                    id="firstname"
                    name="firstname"
                    type="text"
                    autoComplete="given-name"
                    required
                    className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600
                            bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
                            focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                </div>

                <div>
                <label
                    htmlFor="lastname"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    Nachname
                </label>
                <input
                    id="lastname"
                    name="lastname"
                    type="text"
                    autoComplete="family-name"
                    required
                    className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600
                            bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
                            focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                </div>

                <button
                type="submit"
                className="w-full py-2 rounded-md font-medium shadow
                            bg-button-primary text-gray-800
                            hover:opacity-90 transition
                            focus:outline-none focus:ring-2 focus:ring-offset-2
                            focus:ring-[var(--color-primary)] dark:focus:ring-offset-gray-800"
                >
                Bestätigen
                </button>
            </form>
            </section>
        </main>
        </div>
    );
}
