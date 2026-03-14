export default function Loading() {
  return (
    <div className="min-h-dvh bg-surface animate-pulse">
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
      <div className="bg-white border-b border-border px-4 md:px-6 py-3 flex items-center gap-4">
        <div className="flex-1">
          <div className="h-4 w-32 bg-gray-200 rounded mb-1.5" />
          <div className="h-3 w-24 bg-gray-100 rounded" />
        </div>
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
        <div className="bg-white border border-border rounded-2xl p-5 flex items-center gap-3">
          <div className="h-8 flex-1 bg-gray-100 rounded-xl" />
          <div className="h-8 w-24 bg-gray-100 rounded-xl" />
          <div className="h-8 w-24 bg-gray-100 rounded-xl" />
        </div>
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          <div className="h-12 border-b border-border bg-surface" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-0">
              <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-48 bg-gray-200 rounded" />
                <div className="h-2.5 w-32 bg-gray-100 rounded" />
              </div>
              <div className="h-5 w-16 bg-gray-200 rounded-full hidden md:block" />
              <div className="h-5 w-14 bg-gray-200 rounded-full hidden md:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
