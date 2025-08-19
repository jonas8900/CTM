import { useState } from "react";
import { useRouter } from "next/router";
import ErrorMessage from "../components/toast/ErrorMessage";
import SuccessMessage from "../components/toast/SuccessMessage";
import { signIn } from "next-auth/react";
import Header from "@/components/header/header";
import LoginScreen from "@/components/login/loginscreen";

export default function Login() {
  const [toastMessage, setToastMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");

    setShowError(false);
    setShowSuccess(false);

    const response = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (response.error) {
      setShowError(true);
      setToastMessage(response.error);
      setTimeout(() => {
        setShowError(false);
        setToastMessage("");
      }, 4000);
    } else {
      setShowSuccess(true);
      setToastMessage("Erfolgreich eingeloggt!");
      setTimeout(() => {
        setShowSuccess(false);
        setToastMessage("");
        router.push("/");
      }, 2000);
    }
  }

  return (
    <>
        <Header />
        <LoginScreen handleSubmit={handleSubmit} />
        {showError && <ErrorMessage message={toastMessage} />}
        {showSuccess && <SuccessMessage message={toastMessage} />}
    </>
  );
}
