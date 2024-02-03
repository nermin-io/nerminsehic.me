import { spotifyService } from "~/services/spotify.server";
import { json } from "@remix-run/node";

export async function loader() {
  const currentlyPlaying = await spotifyService.getCurrentlyPlaying();
  return json(currentlyPlaying);
}
