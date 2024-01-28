import { getBlogPosts } from "~/utils/blog";
import { json, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ArticleList } from "~/components/article-list";
import { Header } from "~/components/header";

export async function loader() {
  const posts = await getBlogPosts();
  return json(posts);
}

export const meta: MetaFunction = () => {
  return [
    { title: "Nermin Sehic :: Blog" },
    {
      name: "description",
      content:
        "A collection of posts about my thoughts, ideas, and explorations of technical topics",
    },
  ];
};

export default function BlogIndex() {
  const posts = useLoaderData<typeof loader>();
  return (
    <div className="space-y-2">
      <Header title="Blog" subtitle="My technical writing" />
      <ArticleList posts={posts} />
    </div>
  );
}
