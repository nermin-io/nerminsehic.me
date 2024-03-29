import { Link } from "@remix-run/react";

export function AboutSection() {
  return (
    <section
      id="about"
      className="border-background-muted space-y-2 border-b py-8"
    >
      <h2 className="text-lg font-medium">About</h2>
      <div className="text-md text-foreground-muted flex flex-col gap-3">
        <p>
          👨‍💻 Hey there, I&apos;m Nermin, an experienced software developer
          currently immersed in the world of internal tools and automations at{" "}
          <Link
            to="https://rendr.delivery"
            target="_blank"
            rel="noopener noreferrer"
            className="special"
          >
            Rendr
          </Link>
          . My toolkit includes TypeScript, JavaScript, Go,{" "}
          <Link
            to="/OCP_Certificate.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="special"
          >
            Java
          </Link>
          , and React, among others. With a keen eye for aesthetics and
          performance, I thrive on crafting beautiful and efficient user
          interfaces, though I&apos;m no stranger to backend intricacies.
        </p>
        <p>
          ✨ When I&apos;m not immersed in code, you can often find me at
          JavaScript meetups in Melbourne, including MelbJS and React Melbourne.
          These vibrant gatherings are some of the best places to connect with
          me, share insights, and dive into the latest trends in the JavaScript
          ecosystem.
        </p>
        <p>
          🚀 Additionally, I enjoy sharing my experiences and insights on
          software development through technical articles on my blog. I love
          documenting my journey, from tackling complex problems to embracing
          new technologies. Join me as I explore the ever-evolving landscape of
          software development and share the solutions and lessons I discover
          along the way!
        </p>
      </div>
    </section>
  );
}
