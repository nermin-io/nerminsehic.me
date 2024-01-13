import { getPosts } from "~/utils/post";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

export async function loader() {
  const posts = await getPosts();
  return json(posts);
}

export default function BlogIndex() {
  const posts = useLoaderData<typeof loader>();
  return (
    <div>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={post.slug}>{post.frontmatter.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
