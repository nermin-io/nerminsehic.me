import {
  json,
  LoaderFunctionArgs,
  MetaFunction,
  TypedResponse,
} from "@remix-run/node";
import invariant from "tiny-invariant";
import { BlogFrontmatter, getBlogPost } from "~/utils/blog";
import { useLoaderData } from "@remix-run/react";
import { useMdxComponent } from "~/utils/mdx";

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
    return [{ title: data.frontmatter.title }];
  }
  return [
    {
      title: "Not Found",
    },
  ];
};

export default function BlogPage() {
  const { code } = useLoaderData<typeof loader>();
  const Component = useMdxComponent(code);

  return (
    <div>
      <Component />
    </div>
  );
}
