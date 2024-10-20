import { getBlogPosts } from "~/utils/blog";
import { json, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Header } from "~/components/header";
import { ArticleCard } from "~/components/article-card";

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
      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <ArticleCard post={post} key={post.slug} />
        ))}
      </div>
    </div>
  );
}
