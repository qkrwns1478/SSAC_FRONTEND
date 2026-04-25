function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-gray-200 ${className}`} />;
}

export function PopularContentSkeleton() {
  return (
    <section className="mb-12">
      <div className="mb-4 flex items-center gap-3">
        <SkeletonBlock className="h-8 w-40" />
        <SkeletonBlock className="h-5 w-24 rounded-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-100 bg-white p-5">
            <SkeletonBlock className="h-5 w-full mb-3" />
            <SkeletonBlock className="h-5 w-4/5 mb-4" />
            <div className="flex gap-4">
              <SkeletonBlock className="h-4 w-20" />
              <SkeletonBlock className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function NewContentSkeleton() {
  return (
    <section className="mb-12">
      <SkeletonBlock className="h-8 w-36 mb-4" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-100 bg-white p-5">
            <SkeletonBlock className="h-5 w-full mb-3" />
            <SkeletonBlock className="h-5 w-3/4 mb-4" />
            <SkeletonBlock className="h-4 w-28" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function RecommendedSkeleton() {
  return (
    <section className="mb-12">
      <SkeletonBlock className="h-8 w-44 mb-4" />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-100 bg-white p-5">
            <SkeletonBlock className="h-5 w-full mb-3" />
            <SkeletonBlock className="h-5 w-5/6 mb-3" />
            <SkeletonBlock className="h-4 w-full mb-1" />
            <SkeletonBlock className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </section>
  );
}
