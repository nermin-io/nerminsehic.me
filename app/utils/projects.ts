import parseFrontMatter from "front-matter";
import { readFile, readdir } from "./fs.server";
import path from "path";
import fs from "fs";
import { bundleMDX } from "./mdx.server";

export type ProjectFrontmatter = {
  title?: string;
  description?: string;
  timestamp?: string;
  tags?: string[];
  site?: string;
};

export type Project = {
  slug: string;
  route: string;
  frontmatter: ProjectFrontmatter;
  lastModified?: Date;
};

export async function getProject(slug: string) {
  const cwd = process.cwd();
  const filePath = path.join(cwd, "content", "projects", slug + ".mdx");

  try {
    const source = await readFile(filePath, "utf-8");

    const [rehypeHighlight, remarkGfm] = await Promise.all([
      import("rehype-highlight").then((mod) => mod.default),
      import("remark-gfm").then((mod) => mod.default),
    ]);

    const post = await bundleMDX<ProjectFrontmatter>({
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

export async function getAllProjects(): Promise<Project[]> {
  const cwd = process.cwd();
  const directoryPath = path.join(cwd, "content", "projects");

  const dirents = await readdir(directoryPath, {
    withFileTypes: true,
  });

  return await Promise.all(
    dirents.map(async (dirent) => {
      const direntPath = path.join(directoryPath, dirent.name);
      const stats = fs.statSync(direntPath);
      const fileData = await readFile(direntPath);
      const frontmatter = parseFrontMatter(fileData.toString());
      const attributes = frontmatter.attributes as ProjectFrontmatter;

      const slug = dirent.name.replace(/\.mdx/, "");
      const route = path.join("/projects", slug);

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
