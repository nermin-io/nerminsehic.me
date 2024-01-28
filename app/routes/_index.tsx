import { json, MetaFunction } from "@remix-run/node";
import { Header } from "~/components/header";
import { AboutSection } from "~/components/sections/about-section";
import { SkillsSection } from "~/components/sections/skills-section";
import { getBlogPosts } from "~/utils/blog";
import { useLoaderData } from "@remix-run/react";
import { ArticleList } from "~/components/article-list";

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
      <Header />
      <AboutSection />
      <SkillsSection />
      <section
        id="blog"
        className="space-y-2 py-8 border-b border-background-muted"
      >
        <ArticleList posts={posts} />
      </section>
    </div>
  );
}
