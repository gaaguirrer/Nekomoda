interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({ message = "Estamos preparando más sorpresas para ti" }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-5 text-center">
      <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-6">auto_awesome</span>
      <h3 className="text-headline-md text-ink-black mb-2">Sin recomendaciones aún</h3>
      <p className="text-body-md text-on-surface-variant max-w-md">{message}</p>
    </div>
  );
}
