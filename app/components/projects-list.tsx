import { Project } from "~/utils/projects";
import { ProjectCard } from "~/components/project-card";

interface ProjectListProps {
  projects: Project[];
}

export function ProjectsList({ projects }: ProjectListProps) {
  return (
    <div className="flex flex-col gap-3">
      {projects.map((project) => (
        <ProjectCard project={project} key={project.slug} />
      ))}
    </div>
  );
}
