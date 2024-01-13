import styles from "highlight.js/styles/github-dark-dimmed.css";
import { LinksFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
];

export default function Blog() {
  return (
    <div className="flex justify-center">
      <div className="prose lg:prose-xl py-10">
        <Outlet />
      </div>
    </div>
  );
}
