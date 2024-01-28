export function Footer() {
  return (
    <footer className="bg-background-muted">
      <div className="container h-10 flex flex-row items-center justify-between">
        <span className="font-medium text-sm">Nermin Sehic</span>
        <span className="text-xs text-foreground-muted">
          Copyright &copy; Nermin Sehic {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}
