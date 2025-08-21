import useSWR from "swr";

export default function useGuest() {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    "/api/identify/getGuest",
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  );

  const ready = !isLoading && !isValidating ;

  return {
    ready,                      
    known: data?.known ?? null,  
    user: data?.user ?? null,
    connected: data?.connected,
    refetch: () => mutate(),
  };
}

