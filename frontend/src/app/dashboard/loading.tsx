'use client';

export default function DashboardLoading() {
  return (
    <div className="w-full h-full p-8 space-y-8">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-12">
        <div className="space-y-4">
          <div className="h-8 w-48 bg-muted rounded-lg animate-pulse" />
          <div className="h-4 w-64 bg-muted/60 rounded-md animate-pulse" />
        </div>
        <div className="flex gap-4">
          <div className="h-10 w-32 bg-muted rounded-lg animate-pulse" />
          <div className="h-10 w-32 bg-primary/20 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-6 h-32 space-y-4">
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            <div className="h-8 w-32 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card border border-border rounded-lg h-96 animate-pulse" />
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg h-48 animate-pulse" />
            <div className="bg-card border border-border rounded-lg h-48 animate-pulse" />
          </div>
        </div>
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card border border-border rounded-lg h-64 animate-pulse" />
          <div className="bg-muted/30 border border-border rounded-lg h-80 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
