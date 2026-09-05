export function LoadingSkeleton() {
  return (
    <div className="space-y-6 backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10 animate-pulse">
      <div className="space-y-3">
        <div className="h-8 bg-white/10 rounded w-3/4" />
        <div className="h-20 bg-white/10 rounded w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-white/10 rounded" />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 w-20 bg-white/10 rounded-full" />
          ))}
        </div>
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-6 bg-white/10 rounded" />
          ))}
        </div>
        <div className="h-24 bg-white/10 rounded" />
      </div>
    </div>
  );
}