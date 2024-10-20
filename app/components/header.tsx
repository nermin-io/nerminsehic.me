import { Spotify } from "~/components/spotify";

type HeaderProps = {
  title: string;
  subtitle: string;
};

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="flex flex-col justify-center h-64 gap-6 border-b border-background-muted">
      <Spotify />
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-5xl font-bold">{title}</h1>
        <p className="text-primary font-serif text-xl">{subtitle}</p>
      </div>
    </header>
  );
}
