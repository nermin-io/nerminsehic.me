import { Link, useLocation } from "@remix-run/react";
import { cn } from "~/utils/classnames";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const LINKS = [
  { name: "Blog", to: "/blog" },
  { name: "Projects", to: "/projects" },
  { name: "Certs", to: "/certifications" },
];

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
              className="w-[80px] flex items-center justify-center h-full"
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
      <motion.div
        className="h-[1.5px] bg-primary w-[80px]"
        animate={{ x: navIndex * 80 }}
        transition={{
          type: "spring",
          duration: 0.5,
        }}
      />
    </div>
  );
}

export function Navbar() {
  return (
    <nav className="container mx-auto border-b border-background-muted h-12 flex flex-row items-center">
      <div className="flex flex-row gap-8 h-full items-center">
        <Link prefetch="intent" to="/">
          <h1 className="font-serif font-medium text-primary text-xl">NS</h1>
        </Link>
        <NavList />
      </div>
    </nav>
  );
}
