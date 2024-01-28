import { BlogPost } from "~/utils/blog";
import { ArticleCard } from "~/components/article-card";

interface ArticleListProps {
  posts: BlogPost[];
}

export function ArticleList({ posts }: ArticleListProps) {
  return (
    <div className="flex flex-col gap-3">
      {posts.map((post) => (
        <ArticleCard post={post} key={post.slug} />
      ))}
    </div>
  );
}
