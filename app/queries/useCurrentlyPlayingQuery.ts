import { useQuery } from "@tanstack/react-query";
import { CurrentlyPlaying } from "~/services/spotify.server";

export function useCurrentlyPlayingQuery() {
  const { data: currentlyPlaying, ...rest } = useQuery({
    queryKey: ["spotifyCurrentlyPlaying"],
    queryFn: async (): Promise<CurrentlyPlaying> => {
      const response = await fetch("/currently-playing.json");
      return await response.json();
    },
    refetchOnWindowFocus: "always",
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
  });

  return { currentlyPlaying, ...rest };
}
