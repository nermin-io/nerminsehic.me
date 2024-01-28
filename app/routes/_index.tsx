import type { MetaFunction } from "@remix-run/node";
import { Header } from "~/components/header";

export const meta: MetaFunction = () => {
  return [
    { title: "Nermin Sehic :: Software Developer" },
    { name: "description", content: "Lorem Ipsum" },
  ];
};

export default function Index() {
  return (
    <div>
      <Header />
    </div>
  );
}
