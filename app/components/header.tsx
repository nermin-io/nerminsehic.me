interface HeaderProps {
  title: string;
  subtitle: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="flex flex-col justify-center h-56 gap-2 border-b border-background-muted">
      <h1 className="font-serif text-5xl font-bold">{title}</h1>
      <p className="text-primary font-serif text-xl">{subtitle}</p>
    </header>
  );
}
