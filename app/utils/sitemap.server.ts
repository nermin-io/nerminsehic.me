import { getAllProjects } from "~/utils/projects";
import { getBlogPosts } from "~/utils/blog";

export type SitemapEntry = {
  route: string;
  lastmod?: Date;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: 0.0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1.0;
};

function getDomainUrl(request: Request) {
  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  if (!host) {
    throw new Error("Could not determine domain URL.");
  }
  const protocol = host.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

export async function getSitemapXml(request: Request) {
  const domainUrl = getDomainUrl(request);

  function getEntry({ route, lastmod, changefreq, priority }: SitemapEntry) {
    return `
  <url>
  <loc>${domainUrl}${route}</loc>
  ${lastmod ? `<lastmod>${lastmod.toISOString()}</lastmod>` : ""}
  ${changefreq ? `<changefreq>${changefreq}</changefreq>` : ""}
  ${priority ? `<priority>${priority}</priority>` : ""}
  </url>`.trim();
  }

  const dynamicParts = await Promise.all([getAllProjects(), getBlogPosts()]);
  const sitemapEntries = [
    getEntry({ route: "/", priority: 1.0 }),
    getEntry({ route: "/blog", priority: 0.9 }),
    getEntry({ route: "/projects", priority: 0.9 }),
    ...dynamicParts.flatMap((part) =>
      part.map((content) =>
        getEntry({ route: content.route, lastmod: content.lastModified })
      )
    ),
  ];

  return `
<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
>
  ${sitemapEntries.join("")}
</urlset>
  `.trim();
}
