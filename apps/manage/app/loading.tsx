export default function Loading() {
  return (
    <div className="min-h-dvh bg-surface flex">
      {/* Skeleton sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-border shrink-0 animate-pulse">
        <div className="px-4 py-4 border-b border-border">
          <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>
        <div className="flex-1 py-4 px-3 flex flex-col gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2">
              <div className="w-5 h-5 bg-gray-200 rounded" />
              <div className="h-3 bg-gray-200 rounded flex-1" />
            </div>
          ))}
        </div>
      </aside>

      {/* Main content skeleton */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] shrink-0" />
        {/* Header */}
        <div className="bg-white border-b border-border px-4 md:px-6 py-3 flex items-center gap-4 animate-pulse">
          <div className="flex-1">
            <div className="h-4 w-48 bg-gray-200 rounded mb-1.5" />
            <div className="h-3 w-32 bg-gray-100 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-24 h-8 bg-gray-200 rounded-xl" />
            <div className="w-8 h-8 bg-gray-200 rounded-xl" />
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
          </div>
        </div>
        {/* Body */}
        <main className="flex-1 p-4 md:p-6 space-y-5 animate-pulse">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white border border-border rounded-2xl p-5 space-y-3">
                <div className="h-3 w-24 bg-gray-200 rounded" />
                <div className="h-7 w-16 bg-gray-200 rounded" />
                <div className="h-2 w-20 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white border border-border rounded-2xl p-5 h-40" />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
