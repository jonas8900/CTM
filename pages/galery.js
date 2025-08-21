import useGuest from "@/components/customhooks/useGuest";
import Header from "@/components/header/header";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Gallery() {
    const router = useRouter();
    const { loading, known, user } = useGuest();

    useEffect(() => {
        if (!loading && !known) {
            router.push("/login");
        }
    }, [loading, known, router]);
  
    return (
      <>
        <Header />
        <h1>Gallery</h1>
      </>
    );
}