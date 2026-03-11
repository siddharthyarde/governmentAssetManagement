export default function Loading() {
  return (
    <div className="min-h-dvh bg-surface animate-pulse">
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
      <div className="bg-white border-b border-border px-4 md:px-6 py-3 flex items-center gap-4">
        <div className="flex-1">
          <div className="h-4 w-28 bg-gray-200 rounded mb-1.5" />
          <div className="h-3 w-20 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-border rounded-2xl p-5 space-y-3">
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="h-7 w-14 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white border border-border rounded-2xl h-64" />
          <div className="bg-white border border-border rounded-2xl h-64" />
        </div>
        <div className="bg-white border border-border rounded-2xl h-72" />
      </div>
    </div>
  );
}
