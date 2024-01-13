import parseFrontMatter from "front-matter";
import { readFile, readdir } from "./fs.server";
import path from "path";
import { bundleMDX } from "./mdx.server";

export type BlogFrontmatter = {
  title: string;
  description: string;
};

export async function getPost(slug: string) {
  const filePath = path.join(process.cwd(), "content", "blog", slug + ".mdx");

  const [source] = await Promise.all([readFile(filePath, "utf-8")]);

  const [rehypeHighlight, remarkGfm] = await Promise.all([
    import("rehype-highlight").then((mod) => mod.default),
    import("remark-gfm").then((mod) => mod.default),
  ]);

  const post = await bundleMDX<BlogFrontmatter>({
    source,
    cwd: process.cwd(),

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
}

/**
 * Get all frontmatter for all posts
 * @returns
 */
export async function getPosts() {
  const filePath = path.join(process.cwd(), "content", "blog");

  const postsPath = await readdir(filePath, {
    withFileTypes: true,
  });

  return await Promise.all(
    postsPath.map(async (dirent) => {
      const fPath = path.join(filePath, dirent.name);
      const [file] = await Promise.all([readFile(fPath)]);
      const frontmatter = parseFrontMatter(file.toString());
      const attributes = frontmatter.attributes as BlogFrontmatter;

      return {
        slug: dirent.name.replace(/\.mdx/, ""),
        frontmatter: {
          ...attributes,
        },
      };
    })
  );
}
