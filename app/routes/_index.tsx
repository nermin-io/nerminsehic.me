import { json, MetaFunction } from "@remix-run/node";
import { Header } from "~/components/header";
import { getBlogPosts } from "~/utils/blog";
import { useLoaderData } from "@remix-run/react";
import { ArticleCard } from "~/components/article-card";
import { AboutSection } from "~/sections/about-section";
import { SkillsSection } from "~/sections/skills-section";

export async function loader() {
  const posts = await getBlogPosts();
  return json(posts);
}

export const meta: MetaFunction = () => {
  return [
    { title: "Nermin Sehic :: Software Developer" },
    {
      name: "description",
      content:
        "An experienced software developer currently immersed in the world of internal tools and automations at Rendr.",
    },
  ];
};

export default function Index() {
  const posts = useLoaderData<typeof loader>();
  return (
    <div>
      <Header title="Nermin Sehic" subtitle="Software Developer" />
      <AboutSection />
      <SkillsSection />
      <section
        id="blog"
        className="space-y-2 py-8 border-b border-background-muted"
      >
        <h2 className="font-medium text-lg">From The Blog</h2>
        {posts.map((post) => (
          <ArticleCard post={post} key={post.slug} />
        ))}
      </section>
    </div>
  );
}
