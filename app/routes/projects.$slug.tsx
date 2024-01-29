import {
  json,
  LoaderFunctionArgs,
  MetaFunction,
  TypedResponse,
  type LinksFunction,
} from "@remix-run/node";
import invariant from "tiny-invariant";
import { Link, useLoaderData } from "@remix-run/react";
import { useMdxComponent } from "~/hooks/useMdxComponent";

import styles from "highlight.js/styles/base16/gruvbox-dark-hard.css";
import { Header } from "~/components/header";
import { format } from "date-fns";
import { getProject, ProjectFrontmatter } from "~/utils/projects";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
];

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.slug, "params.slug is not defined");
  const post = await getProject(params.slug);
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }

  return json(post);
}

type MetaLoader = () => Promise<
  TypedResponse<{
    frontmatter: ProjectFrontmatter;
  }>
>;

export const meta: MetaFunction<MetaLoader> = ({ data }) => {
  if (data) {
    return [
      { title: `Nermin Sehic :: ${data.frontmatter.title}` },
      {
        name: "description",
        content: data.frontmatter.description,
      },
    ];
  }
  return [{ title: "Not Found" }];
};

export default function ProjectPage() {
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
        <div className="flex flex-row gap-1 items-center font-serif text-sm uppercase">
          <span className="text-foreground-muted">{tags}</span>
          {frontmatter.site && (
            <span>
              •{" "}
              <Link
                to={frontmatter.site}
                className="text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Site
              </Link>
            </span>
          )}
        </div>
      </div>
      <div className="prose dark:prose-invert py-6 max-w-none">
        <Component />
      </div>
    </div>
  );
}
