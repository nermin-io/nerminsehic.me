import parseFrontMatter from "front-matter";
import { readFile, readdir } from "./fs.server";
import path from "path";
import fs from "fs";
import { bundleMDX } from "./mdx.server";

export type BlogFrontmatter = {
  title?: string;
  description?: string;
  timestamp?: string;
  tags?: string[];
};

export type BlogPost = {
  slug: string;
  route: string;
  frontmatter: BlogFrontmatter;
  lastModified?: Date;
};

export async function getBlogPost(slug: string) {
  const cwd = process.cwd();
  const filePath = path.join(cwd, "content", "blog", slug + ".mdx");

  try {
    const source = await readFile(filePath, "utf-8");

    const [rehypeHighlight, remarkGfm] = await Promise.all([
      import("rehype-highlight").then((mod) => mod.default),
      import("remark-gfm").then((mod) => mod.default),
    ]);

    const post = await bundleMDX<BlogFrontmatter>({
      source,
      cwd,

      esbuildOptions: (options) => {
        options.loader = {
          ...options.loader,
          ".png": "dataurl",
          ".gif": "dataurl",
        };

        return options;
      },
      mdxOptions: (options) => {
        options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
        options.rehypePlugins = [
          ...(options.rehypePlugins ?? []),
          rehypeHighlight,
        ];
        return options;
      },
    });

    return {
      ...post,
      frontmatter: {
        ...post.frontmatter,
      },
    };
  } catch {
    return null;
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const cwd = process.cwd();
  const postsPath = path.join(cwd, "content", "blog");

  const directoryEntries = await readdir(postsPath, {
    withFileTypes: true,
  });

  return await Promise.all(
    directoryEntries.map(async (file) => {
      const stats = fs.statSync(file.path);
      const direntPath = path.join(postsPath, file.name);
      const fileData = await readFile(direntPath);
      const frontmatter = parseFrontMatter(fileData.toString());
      const attributes = frontmatter.attributes as BlogFrontmatter;

      const slug = file.name.replace(/\.mdx/, "");
      const route = path.join("/blog", slug);

      return {
        slug: slug,
        route: route,
        lastModified: stats.mtime,
        frontmatter: {
          ...attributes,
        },
      };
    })
  );
}
