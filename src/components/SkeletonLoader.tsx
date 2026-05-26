export default function SkeletonLoader() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[4/5] bg-surface-container mb-4" />
          <div className="h-4 bg-surface-container rounded w-3/4 mb-2" />
          <div className="h-4 bg-surface-container rounded w-1/4" />
        </div>
      ))}
    </div>
  );
}
