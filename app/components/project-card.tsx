import { format } from "date-fns";
import { Link } from "@remix-run/react";
import { Project } from "~/utils/projects";
import { SerializeFrom } from "@remix-run/node";

type ProjectCardProps = {
  project: SerializeFrom<Project>;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const { title, description, timestamp, tags } = project.frontmatter;
  const date = timestamp ? new Date(timestamp) : new Date();

  return (
    <Link prefetch="intent" to={`/projects/${project.slug}`}>
      <div className="border border-background-muted hover:bg-background-muted rounded-md py-2 px-3">
        <span className="font-serif text-primary text-xs uppercase">
          {tags?.join(", ")}
        </span>
        <h3 className="font-medium text-lg">{title}</h3>
        <p className="text-sm text-foreground-muted mb-4">{description}</p>
        <div className="text-xs font-serif uppercase">
          {format(date, "dd MMMM, yyyy")}
        </div>
      </div>
    </Link>
  );
}
