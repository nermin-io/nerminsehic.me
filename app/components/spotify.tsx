import { useCurrentlyPlayingQuery } from "~/queries/useCurrentlyPlayingQuery";
import { SpotifyIcon } from "~/components/icons/SpotifyIcon";
import { CurrentlyPlaying } from "~/services/spotify.server";
import { Link } from "@remix-run/react";

function Loading() {
  return <p className="font-medium">Loading player...</p>;
}

function CurrentlyPlayingTrack({ track }: { track: CurrentlyPlaying }) {
  if (!track.playing)
    return (
      <div className="font-medium">
        Not Playing <span className="text-muted font-normal">— Spotify</span>
      </div>
    );
  return (
    <div className="flex flex-col leading-none gap-1">
      <Link
        to={track.url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium hover:underline"
      >
        {track.name}
      </Link>
      <p className="text-muted">{track.artists}</p>
    </div>
  );
}

export function Spotify() {
  const { currentlyPlaying, isLoading } = useCurrentlyPlayingQuery();

  return (
    <div className="flex flex-row items-center gap-3 text-sm">
      <SpotifyIcon height={30} width={30} />
      {isLoading || !currentlyPlaying ? (
        <Loading />
      ) : (
        <CurrentlyPlayingTrack track={currentlyPlaying} />
      )}
    </div>
  );
}
