import { Link, useLocation } from "@remix-run/react";
import { cn } from "~/utils/classnames";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LinkedInIcon } from "~/components/icons/LinkedInIcon";
import { GithubIcon } from "~/components/icons/GithubIcon";

const LINKS = [
  { name: "Blog", to: "/blog" },
  { name: "Projects", to: "/projects" },
];

const SOCIAL_LINKS = [
  {
    icon: GithubIcon,
    to: "https://github.com/nermin-io",
  },
  {
    icon: LinkedInIcon,
    to: "https://www.linkedin.com/in/nsehic/",
  },
];

const NAV_WIDTH = 80;

function getCurrentPageIndex(pathname: string): number {
  return LINKS.findIndex((link) => isLinkSelected(link.to, pathname));
}

function isLinkSelected(link: string, pathname: string): boolean {
  return link === pathname || pathname.startsWith(`${link}/`);
}

function NavList() {
  const location = useLocation();
  const currentPageIndex = getCurrentPageIndex(location.pathname);
  const [navIndex, setNavIndex] = useState(currentPageIndex);

  useEffect(() => {
    setNavIndex(getCurrentPageIndex(location.pathname));
  }, [location.pathname]);

  return (
    <div className="h-full">
      <ul className="flex flex-row items-center h-full flex-grow">
        {LINKS.map((link, index) => {
          const isSelected = isLinkSelected(link.to, location.pathname);
          return (
            <li
              className="flex items-center justify-center h-full"
              style={{ width: NAV_WIDTH }}
              key={link.to}
              onMouseOver={() => setNavIndex(index)}
              onMouseLeave={() => setNavIndex(currentPageIndex)}
              onFocus={() => setNavIndex(index)}
            >
              <Link
                prefetch="intent"
                to={link.to}
                className={cn("text-sm", isSelected && "font-medium")}
              >
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>
      {location.pathname !== "/" && (
        <motion.div
          className="h-[1.5px] bg-primary"
          style={{ width: NAV_WIDTH }}
          animate={{ x: navIndex * NAV_WIDTH }}
          transition={{
            type: "spring",
            duration: 0.5,
          }}
        />
      )}
    </div>
  );
}

function SocialLinks() {
  return (
    <div className="flex flex-row gap-5">
      {SOCIAL_LINKS.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          target="_blank"
          rel="noopener noreferrer"
        >
          <link.icon fill="#787878" onHoverFill="#979797" />
        </Link>
      ))}
    </div>
  );
}

export function Navbar() {
  return (
    <nav className="container mx-auto border-b border-background-muted h-12 flex flex-row items-center justify-between">
      <div className="flex flex-row gap-5 h-full items-center">
        <Link prefetch="intent" to="/">
          <h1 className="font-serif font-medium text-primary text-xl">NS</h1>
        </Link>
        <NavList />
      </div>
      <SocialLinks />
    </nav>
  );
}
