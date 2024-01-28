import type { MetaFunction } from "@remix-run/node";
import { Header } from "~/components/header";
import { AboutSection } from "~/components/sections/about-section";

export const meta: MetaFunction = () => {
  return [
    { title: "Nermin Sehic :: Software Developer" },
    {
      name: "description",
      content:
        "An experienced software developer currently immersed in the world of internal tools and automations at Rendr.",
    },
  ];
};

export default function Index() {
  return (
    <div>
      <Header />
      <AboutSection />
    </div>
  );
}
