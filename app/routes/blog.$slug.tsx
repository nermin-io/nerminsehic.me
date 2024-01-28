import {
  json,
  LoaderFunctionArgs,
  MetaFunction,
  TypedResponse,
  type LinksFunction,
} from "@remix-run/node";
import invariant from "tiny-invariant";
import { BlogFrontmatter, getBlogPost } from "~/utils/blog";
import { useLoaderData } from "@remix-run/react";
import { useMdxComponent } from "~/hooks/useMdxComponent";

import styles from "highlight.js/styles/github-dark-dimmed.css";
import { Header } from "~/components/header";
import { format } from "date-fns";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
];

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.slug, "params.slug is not defined");
  const post = await getBlogPost(params.slug);
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }

  return json(post);
}

type MetaLoader = () => Promise<
  TypedResponse<{
    frontmatter: BlogFrontmatter;
  }>
>;

export const meta: MetaFunction<MetaLoader> = ({ data }) => {
  if (data) {
    return [{ title: `Nermin Sehic :: ${data.frontmatter.title}` }];
  }
  return [{ title: "Not Found" }];
};

export default function BlogPage() {
  const { code, frontmatter } = useLoaderData<typeof loader>();
  const Component = useMdxComponent(code);

  const date = frontmatter.timestamp
    ? new Date(frontmatter.timestamp)
    : new Date();

  const title = frontmatter.title ?? "";
  const tags = frontmatter.tags ? frontmatter.tags.join(", ") : "";

  return (
    <div>
      <div className="flex flex-col gap-3">
        <Header title={title} subtitle={format(date, "dd MMMM, yyyy")} />
        <span className="font-serif uppercase text-foreground-muted text-sm">
          {tags}
        </span>
      </div>
      <div className="prose dark:prose-invert py-6 max-w-none">
        <Component />
      </div>
    </div>
  );
}
