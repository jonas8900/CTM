import { useEffect, useMemo, useState } from "react";
import SubmitButton from "@/components/buttons/submitbutton";
import MusicWishCard from "@/components/cards/musicwish";
import Header from "@/components/header/header";
import Image from "next/image";
import { IoCloseSharp } from "react-icons/io5";
import { useRouter } from "next/router";
import useGuest from "@/components/customhooks/useGuest";
import ErrorMessage from "@/components/toast/ErrorMessage";
import useSWR from "swr";
import SuccessMessage from "@/components/toast/SuccessMessage";
import Loading from "@/components/loading/Loading";

export default function Services() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isloading, setLoading] = useState(false);
  const [chosenSong, setChosenSong] = useState(null);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const router = useRouter();
  const { user, ready, known, refetch } = useGuest();
  const { data: wishes, isLoading: isLoadingWishes, mutate } = useSWR(
    user ? `/api/music/getWish?` : null,
  );


  useEffect(() => {
    if (ready && known === false) {
      router.push("/login");
    }
  }, [ready, known, router]);

  const debouncedQuery = useMemo(() => query, [query]);
  useEffect(() => {
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      if (!debouncedQuery.trim()) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `/api/spotify/search?q=${encodeURIComponent(
            debouncedQuery
          )}&limit=8&market=DE`,
          { signal: ctrl.signal }
        );
        const data = await res.json();
        setSuggestions(data.items || []);
      } catch (e) {
        if (e.name !== "AbortError") console.error(e);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      ctrl.abort();
      clearTimeout(timer);
    };
  }, [debouncedQuery]);

  if (isLoadingWishes) return <Loading />;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!chosenSong) return;
    const userExist = await refetch();
    if (!userExist) {
      setChosenSong(null);
      setQuery("");

      setShowError(true);
      setToastMessage("Bitte gib deinen Namen an!");
      setTimeout(() => {
        setShowError(false);
        setToastMessage("");
        router.push("/login");
      }, 1000);

      return;
    }

    const newWish = {
      title: chosenSong.title,
      artist: chosenSong.artist,
      image: chosenSong.image,
      userId: user?._id,
    };

    const res = await fetch("/api/music/newWish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newWish),
    });

    if (res.ok) {
      setChosenSong(null);
      setQuery("");
      setShowSuccess(true);
      setToastMessage("Musikwunsch erfolgreich hinzugefügt!");

      mutate();

      setTimeout(() => {
        setShowSuccess(false);
        setToastMessage("");
      }, 1000);
    } else {
      setChosenSong(null);
      setQuery("");
      setShowError(true);
      setToastMessage("Etwas ist schief gelaufen, versuche es noch einmal");
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
          Musikwünsche
        </h2>

        <div className="border rounded-sm border-gray-300 dark:border-gray-700 p-4 overflow-y-auto min-h-0 h-full overscroll-contain">
          <ul className="space-y-2">
            {wishes?.map((wish) => (
              <MusicWishCard key={wish._id} wish={wish} />
            ))}
          </ul>
        </div>

        <form
          className="max-w-[75%] text-left ml-10 mt-5 relative"
          onSubmit={handleSubmit}>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            htmlFor="newWish">
            Neuer Musikwunsch
          </label>

          <input
            id="newWish"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Suche deinen Song…"
            autoComplete="off"
          />

          {query && (isloading || suggestions.length) && !chosenSong && (
            <div
              className="absolute left-0 right-0 bottom-full mb-1 
                        bg-white dark:bg-gray-700 
                        border border-gray-200 dark:border-gray-600 
                        rounded-md shadow-lg 
                        max-h-64 overflow-y-auto z-30">
              {isloading && (
                <div className="px-3 py-2 text-sm text-gray-500">Suche…</div>
              )}
              {!isloading &&
                suggestions.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    className="w-full text-left cursor-pointer px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-600"
                    onClick={() => {
                      setQuery(`${s.title} – ${s.artist}`);
                      setSuggestions([]);
                      setChosenSong({
                        title: s.title,
                        artist: s.artist,
                        image: s.image,
                      });
                    }}>
                    <div className="flex items-center gap-3">
                      {s.image && (
                        <Image
                          src={s.image}
                          width={28}
                          height={28}
                          alt=""
                          className="w-8 h-8 rounded object-cover"
                        />
                      )}
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                          {s.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-300 truncate">
                          {s.artist}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              {!isloading && !suggestions.length && (
                <div className="px-3 py-2 text-sm text-gray-500">
                  Keine Treffer
                </div>
              )}
            </div>
          )}

          {chosenSong && (
            <div className="mt-3 p-2 border rounded-md relative flex items-center gap-3 pr-10">
              <button
                type="button"
                onClick={() => {
                  setChosenSong(null);
                  setQuery("");
                }}
                aria-label="Ausgewählten Song entfernen"
                className="absolute top-2 right-2 p-1 rounded
                          hover:bg-gray-100 dark:hover:bg-gray-600
                          focus:outline-none focus:ring-2 focus:ring-offset-2
                          focus:ring-gray-300 dark:focus:ring-offset-gray-800">
                <IoCloseSharp className="w-5 h-5 text-gray-500 dark:text-gray-300" />
              </button>

              {chosenSong.image && (
                <Image
                  src={chosenSong.image}
                  alt=""
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded object-cover shrink-0"
                />
              )}
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                  {chosenSong.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-300 truncate">
                  {chosenSong.artist}
                </div>
              </div>
            </div>
          )}

          <SubmitButton className="mt-2 px-4 py-2 bg-button-primary text-gray-700 rounded-md">
            Absenden
          </SubmitButton>
        </form>
      </section>
    </div>
  );
}
