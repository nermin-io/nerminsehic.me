import parseFrontMatter from "front-matter";
import { readFile, readdir } from "./fs.server";
import path from "path";
import { bundleMDX } from "./mdx.server";

export type BlogFrontmatter = {
  title?: string;
  description?: string;
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

export async function getBlogPosts() {
  const cwd = process.cwd();
  const postsPath = path.join(cwd, "content", "blog");

  const dirents = await readdir(postsPath, {
    withFileTypes: true,
  });

  return await Promise.all(
    dirents.map(async (dirent) => {
      const direntPath = path.join(postsPath, dirent.name);
      const file = await readFile(direntPath);
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
