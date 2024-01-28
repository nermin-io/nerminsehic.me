import { json, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Header } from "~/components/header";
import { getAllProjects } from "~/utils/projects";
import { ProjectsList } from "~/components/projects-list";

export async function loader() {
  const projects = await getAllProjects();
  return json(projects);
}

export const meta: MetaFunction = () => {
  return [
    { title: "Nermin Sehic :: Projects" },
    {
      name: "description",
      content: "A collection of my work",
    },
  ];
};

export default function ProjectsIndex() {
  const projects = useLoaderData<typeof loader>();
  return (
    <div className="space-y-2">
      <Header title="Projects" subtitle="A collection of my work" />
      <ProjectsList projects={projects} />
    </div>
  );
}
