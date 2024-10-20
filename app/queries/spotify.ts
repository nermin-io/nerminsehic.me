import { useQuery } from "@tanstack/react-query";
import { CurrentlyPlaying } from "~/services/spotify.server";

const queryKeys = {
  all: ["currently-playing"] as const,
};

export function useCurrentlyPlaying() {
  return useQuery({
    queryKey: queryKeys.all,
    queryFn: async (): Promise<CurrentlyPlaying> =>
      fetch("/currently-playing.json").then((res) => res.json()),
    refetchOnWindowFocus: "always",
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
  });
}
