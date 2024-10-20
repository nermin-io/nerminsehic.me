import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetchers,
  useNavigation,
} from "@remix-run/react";
import styles from "./styles.css";
import { Navbar } from "~/components/navbar";
import { Footer } from "~/components/footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NProgress from "nprogress";
import { useEffect, useMemo } from "react";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: styles },
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/apple-touch-icon.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/favicon-32x32.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: "/favicon-16x16.png",
  },
  { rel: "mask-icon", href: "/safari-pinned-tab.svg" },
  { rel: "manifest", href: "/site.webmanifest" },
  { rel: "icon", href: "/favicon.ico" },
];

export const meta: MetaFunction = () => {
  return [
    {
      name: "msapplication-TileColor",
      content: "#191919",
    },
    {
      name: "theme-color",
      content: "#191919",
    },
  ];
};

const queryClient = new QueryClient();

NProgress.configure({
  easing: "ease",
  speed: 500,
  trickleSpeed: 200,
  showSpinner: false,
});

export default function App() {
  const transition = useNavigation();
  const fetchers = useFetchers();

  const state = useMemo<"idle" | "loading">(() => {
    const states = [
      transition.state,
      ...fetchers.map((fetcher) => fetcher.state),
    ];
    if (states.every((state) => state === "idle")) return "idle";
    return "loading";
  }, [transition.state, fetchers]);

  useEffect(() => {
    if (state === "loading") NProgress.start();
    if (state === "idle") NProgress.done();
  }, [state, transition.state]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="dark">
        <div className="h-screen flex flex-col justify-between">
          <div>
            <Navbar />
            <div className="container">
              <QueryClientProvider client={queryClient}>
                <Outlet />
              </QueryClientProvider>
            </div>
          </div>
          <Footer />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
