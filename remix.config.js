/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  // serverBuildPath: "build/index.js",
  mdx: async () => {
    const [rehypeHighlight] = await Promise.all([
      import("rehype-highlight").then(mod => mod.default)
    ]);
    return {
      rehypePlugins: [rehypeHighlight]
    }
  },
};
