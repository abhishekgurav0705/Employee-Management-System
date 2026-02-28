import { Skeleton } from "../../components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-4">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-8 w-32" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="card p-4 space-y-3">
            <Skeleton className="h-4 w-32" />
            {[...Array(4)].map((__, j) => (
              <Skeleton key={j} className="h-3 w-full" />
            ))}
          </div>
        ))}
      </div>
      <div className="card p-4 space-y-3">
        <Skeleton className="h-4 w-32" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-3 w-full" />
        ))}
      </div>
    </div>
  );
}
