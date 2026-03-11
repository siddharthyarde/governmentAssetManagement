export default function Loading() {
  return (
    <div className="min-h-dvh bg-surface animate-pulse">
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
      <div className="bg-white border-b border-border px-4 md:px-6 py-3 flex items-center gap-4">
        <div className="flex-1">
          <div className="h-4 w-36 bg-gray-200 rounded mb-1.5" />
          <div className="h-3 w-24 bg-gray-100 rounded" />
        </div>
        <div className="h-8 w-28 bg-gray-200 rounded-xl" />
      </div>
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-border rounded-2xl p-5 space-y-3">
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="h-7 w-16 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-border rounded-2xl overflow-hidden">
              <div className="h-40 bg-gray-100" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-3 w-1/2 bg-gray-100 rounded" />
                <div className="h-3 w-1/3 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
