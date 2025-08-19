import { useEffect, useRef, useState } from "react";
import { IoIosEye } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import ErrorMessage from "../toast/ErrorMessage";
import SuccessMessage from "../toast/SuccessMessage";

export default function LoginScreen({ handleSubmit }) {
  const [typeSwitch, setTypeSwitch] = useState("password");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const overlayRef = useRef(null);
  const overlayRegisteredRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);




  async function handleSubmitRegistration(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    const response = await fetch(`/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      setShowError(true);
      setToastMessage("Etwas ist schiefgelaufen!");
      setTimeout(() => {
        setShowError(false);
        setToastMessage("");
      }, 5000);
      return;
    }

    if (response.ok) {
      setShowSuccess(true);
      setToastMessage("Erfolgreich Registriert! 🎉");
      setTimeout(() => {
        setShowSuccess(false);
        setToastMessage("");
        setRegistered(false);
        router.push("/auth/login");
      }, 5000);
    } else {
      alert("Etwas ist schiefgelaufen, versuche es später noch einmal.");
    }
  }



  function handlePasswortTypeHidden() {
    setTypeSwitch("text");
  }



  function handlePasswortTypeVisibil() {
    setTypeSwitch("password");
  }



  function handleClickOutside(e) {
    if (overlayRef.current && !overlayRef.current.contains(e.target)) {
      setForgotPassword(false);
    }
    if (
      overlayRegisteredRef.current &&
      !overlayRegisteredRef.current.contains(e.target)
    ) {
      setRegistered(false);
    }
  }




  async function handleSubmitForgotPassword(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const email = formData.get("email");

    try {
      const response = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        setShowError(true);
        setToastMessage("Fehler beim Senden der E-Mail.");
        setTimeout(() => {
          setShowError(false);
          setToastMessage("");
        }, 5000);
        return;
      }

      setShowSuccess(true);
      setToastMessage("E-Mail zum Zurücksetzen des Passworts wurde gesendet!");
      setTimeout(() => {
        setShowSuccess(false);
        setToastMessage("");
        setForgotPassword(false);
      }, 5000);
    } catch (error) {
      setShowError(true);
      setToastMessage("Es gab einen Fehler. Versuche es später erneut.");
      setTimeout(() => {
        setShowError(false);
        setToastMessage("");
      }, 5000);
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className=" w-full flex items-center justify-center box-shadow-lg dark:bg-gray-900">
        <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto w-full max-w-4xl dark:border-gray-700 dark:bg-gray-800">
          <div className="w-full p-8 lg:w-1/2">
            <form onSubmit={handleSubmit}>
              <div class="mt-4">
                <label
                  id="email"
                  class="block text-gray-700 text-sm font-bold mb-2 dark:text-white">
                  Email Address
                </label>
                <input
                  class="w-full h-10 bg-transparent placeholder:text-gray-400 text-gray-700 text-sm border border-slate-200 rounded px-3 py-2 mb-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md dark:text-white"
                  type="email"
                  name="email"
                />
              </div>
              <div class="mt-4">
                <div class="flex justify-between">
                  <label
                    class="block text-gray-700 text-sm font-bold mb-2 dark:text-white"
                    id="password">
                    Password
                  </label>
                  <a
                    href="#"
                    class="cursor-pointer text-xs text-purple-500 hover:text-gray-600 transition-all duration-200 dark:hover:text-white"
                    onClick={() => setForgotPassword(true)}>
                    Forget Password?
                  </a>
                </div>
                <span class="relative flex items-center">
                  <IoIosEye
                    class="absolute cursor-pointer right-3 top-2.5 w-5 h-5 text-gray-400"
                    onMouseDown={handlePasswortTypeHidden}
                    onMouseUp={handlePasswortTypeVisibil}
                    onMouseLeave={handlePasswortTypeVisibil}
                  />

                  <input
                    class=" w-full h-10 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded px-3 py-2 mb-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md dark:text-white"
                    type={typeSwitch}
                    name="password"
                  />
                </span>
              </div>
              <div class="mt-8">
                <button class="cursor-pointer bg-purple-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-purple-500 transition-all duration-200">
                  Login
                </button>
              </div>
            </form>
            <div class="mt-4 flex items-center justify-between">
              <span class="border-b w-1/5 md:w-1/4"></span>
              <a
                href="#"
                class="cursor-pointer text-xs text-highlight uppercase hover:text-gray-600 transition-all duration-200 dark:hover:text-white"
                onClick={() => setRegistered(true)}>
                oder registriere dich jetzt
              </a>
              <span class="border-b w-1/5 md:w-1/4"></span>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {forgotPassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            class="absolute flex items-center justify-center bg-transparent rounded-lg shadow-lg overflow-hidden mx-auto h-screen w-full  top-0 backdrop-blur-sm">
            <div
              class="mt-7 bg-white min-w-sm rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700"
              ref={overlayRef}>
              <div class="p-4 sm:p-7">
                <div class="text-center">
                  <h1 class="block text-2xl font-bold text-gray-800 dark:text-white">
                    Forgot password?
                  </h1>
                  <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Remember your password ?&nbsp;
                    <a
                      class="text-blue-600 decoration-2 hover:underline font-medium"
                      onClick={() => setForgotPassword(false)}>
                      Login here
                    </a>
                  </p>
                </div>

                <div class="mt-5">
                  <form onSubmit={handleSubmitForgotPassword}>
                    <div class="grid gap-y-4">
                      <div>
                        <label
                          for="email"
                          class="block text-sm font-bold ml-1 mb-2 dark:text-white">
                          Email address
                        </label>
                        <div class="relative">
                          <input
                            type="email"
                            id="email"
                            name="email"
                            class="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                            required
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        class="cursor-pointer bg-purple-700 text-white font-bold py-3 px-4 w-full rounded hover:bg-purple-500 transition-all duration-200">
                        Reset password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {registered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            class="absolute flex items-center justify-center bg-transparent rounded-lg shadow-lg overflow-hidden mx-auto h-screen w-full  top-0 backdrop-blur-sm">
            <div
              class="mt-7 bg-white min-w-sm rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700"
              ref={overlayRegisteredRef}>
              <div class="p-4 sm:p-7">
                <div class="text-center">
                  <h1 class="block text-2xl font-bold text-gray-800 dark:text-white">
                    Registriere dich jetzt
                  </h1>
                  <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Doch schon einen Account ?&nbsp;
                    <a
                      class="text-blue-600 decoration-2 hover:underline font-medium cursor-pointer"
                      onClick={() => setRegistered(false)}>
                      hier anmelden
                    </a>
                  </p>
                </div>

                <div class="mt-5">
                  <form onSubmit={handleSubmitRegistration}>
                    <div class="grid gap-y-4">
                      <div>
                        <label
                          for="firstname"
                          class="block text-sm font-bold ml-1 mb-2 dark:text-white">
                          Vorname
                        </label>
                        <div class="relative">
                          <input
                            type="text"
                            id="firstname"
                            name="firstname"
                            class="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                            required
                          />
                        </div>
                      </div>
                       <div>
                        <label
                          for="lastname"
                          class="block text-sm font-bold ml-1 mb-2 dark:text-white">
                          Nachname
                        </label>
                        <div class="relative">
                          <input
                            type="text"
                            id="lastname"
                            name="lastname"
                            class="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          for="email"
                          class="block text-sm font-bold ml-1 mb-2 dark:text-white">
                          Email address
                        </label>
                        <div class="relative">
                          <input
                            type="email"
                            id="email"
                            name="email"
                            class="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          for="password"
                          class="block text-sm font-bold ml-1 mb-2 dark:text-white">
                          Passwort
                        </label>
                        <div class="relative">
                          <input
                            type={typeSwitch}
                            id="password"
                            name="password"
                            class="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                            required
                          />
                          <IoIosEye
                            class="absolute cursor-pointer right-3 top-3.5 w-5 h-5 text-gray-400"
                            onMouseDown={handlePasswortTypeHidden}
                            onMouseUp={handlePasswortTypeVisibil}
                            onMouseLeave={handlePasswortTypeVisibil}
                          />
                        </div>
                        <p class="text-xs pt-1 ">
                          Das Passwort muss mindestens 8 Zeichen, 1
                          Sonderzeichen<br></br> und eine Zahl enthalten.
                        </p>
                      </div>
                      <button
                        type="submit"
                        class="cursor-pointer mt-5 bg-purple-700 text-white font-bold py-3 px-4 w-full rounded hover:bg-purple-500 transition-all duration-200">
                        Registrieren
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {showError && <ErrorMessage message={toastMessage} />}
        {showSuccess && <SuccessMessage message={toastMessage} />}
      </AnimatePresence>
    </div>
  );
}
