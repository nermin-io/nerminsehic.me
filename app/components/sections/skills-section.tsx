const SKILLS = [
  "typescript",
  "javascript",
  "react",
  "node.js",
  "gcp",
  "express",
  "nest.js",
];

export function SkillsSection() {
  return (
    <section
      id="skills"
      className="py-8 border-b border-background-muted overflow-x-auto"
    >
      <div className="flex flex-row items-center justify-between gap-3">
        {SKILLS.map((skill) => (
          <span
            key={skill}
            className="uppercase font-bold text-3xl text-[#2f2f2f]"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}
