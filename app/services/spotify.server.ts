import axios, { AxiosInstance } from "axios";
import qs from "qs";
import { addSeconds, isBefore } from "date-fns";

export type CurrentlyPlaying =
  | {
      playing: false;
    }
  | {
      playing: true;
      id: string;
      name: string;
      artists: string;
      url: string;
      image_url: string;
    };

export class SpotifyService {
  private expiresAt: Date;
  private accessToken: string;
  private client: AxiosInstance;
  private clientId: string;
  private clientSecret: string;

  private readonly refreshToken: string;
  private readonly credentialsUrl: string;

  constructor() {
    this.expiresAt = new Date();
    this.accessToken = "";
    this.clientId = `${process.env.SPOTIFY_CLIENT_ID}`;
    this.clientSecret = `${process.env.SPOTIFY_CLIENT_SECRET}`;
    this.refreshToken = `${process.env.SPOTIFY_REFRESH_TOKEN}`;
    this.credentialsUrl = `${process.env.SPOTIFY_CREDENTIALS_URL}`;

    this.client = axios.create({
      baseURL: `${process.env.SPOTIFY_BASE_URL}/v1`,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    this.client.interceptors.request.use(async (config) => {
      if (this.accessToken && isBefore(new Date(), this.expiresAt)) {
        config.headers["Authorization"] = `Bearer ${this.accessToken}`;
        return config;
      }

      const accessToken = await this.refreshAccessToken();
      if (accessToken && config.headers) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
        return config;
      }

      return config;
    });
  }

  public async getCurrentlyPlaying(): Promise<CurrentlyPlaying> {
    const { data, status } = await this.client.get(
      "/me/player/currently-playing?market=AU"
    );

    if (status === 204 || status >= 400) return { playing: false };

    // Not much data is returned for the currently playing podcast episode
    // so this case we'll treat it as not playing
    if (data.currently_playing_type === "episode") return { playing: false };

    const hasImages = data?.item?.album?.images !== undefined;
    const hasArtists = data?.item?.artists !== undefined;

    return {
      playing: data.is_playing,
      id: data.item.id,
      name: data.item.name,
      artists: hasArtists
        ? data.item.artists
            .map((artist: { name: string }) => artist.name)
            .join(", ")
        : "",
      url: data?.item?.external_urls?.spotify ?? "",
      image_url: hasImages
        ? this.findImageUrlByDimensions(data.item.album.images, 300)
        : "",
    };
  }

  private findImageUrlByDimensions(
    images: Array<{ height: number; width: number; url: string }>,
    dimensions: number
  ) {
    return images.find(
      (image) => image.height === dimensions && image.width === dimensions
    )?.url;
  }

  private async refreshAccessToken() {
    const { data, status } = await axios({
      url: this.credentialsUrl,
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          this.clientId + ":" + this.clientSecret
        ).toString("base64")}`,
      },
      data: qs.stringify({
        grant_type: "refresh_token",
        refresh_token: this.refreshToken,
      }),
    });

    if (status === 200) {
      const { expires_in, access_token } = data;
      this.expiresAt = addSeconds(new Date(), expires_in);
      this.accessToken = access_token;
      return access_token;
    }
  }
}

export const spotifyService = new SpotifyService();
