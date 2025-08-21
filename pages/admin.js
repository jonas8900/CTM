import Header from "@/components/header/header";
import ErrorMessage from "@/components/toast/ErrorMessage";
import SuccessMessage from "@/components/toast/SuccessMessage";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function Admin() {
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault();
        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });
        if (res.ok) {
            setShowSuccess(true);
            setToastMessage("Erfolgreich eingeloggt");
            setTimeout(() => {
                setShowSuccess(false);
                setToastMessage("");
                router.push("/admin/dashboard");
            }, 1000);
        } else {
            setShowError(true);
            setToastMessage("Etwas ist schief gelaufen, versuche es noch einmal");
            setTimeout(() => {
                setShowError(false);
                setToastMessage("");
            }, 1000);
        }
    }
    return (
        <>
            <Header/>
            <section className="grid grid-rows-[auto_minmax(0,1fr)_auto]  dark:bg-gray-800  rounded-md p-6 overflow-hidden">
                <h2 className="text-3xl  text-left ml-10 mb-4 font-bold text-gray-700 dark:text-gray-200">
                Admin Dashboard
                </h2>
                <p className="text-gray-600 dark:text-gray-300">Log dich ein um auf das Admin-Dashboard zuzugreifen.</p>
            </section>

              <div className="grid min-h-dvh grid-rows-[auto_minmax(0,1fr)] overflow-hidden">
                    {showError && <ErrorMessage message={toastMessage} />}
                    {showSuccess && <SuccessMessage message={toastMessage} />}    
            
                    <main className="flex items-center justify-center p-6">
                        <section className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
                            Logindaten
                        </h2>
            
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                            <label
                                htmlFor="firstname"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email} 
                                onChange={e=>setEmail(e.target.value)}
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
                                Passwort
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={e=>setPassword(e.target.value)}
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

        </>
    )
}