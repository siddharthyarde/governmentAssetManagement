export default function Loading() {
  return (
    <div className="min-h-dvh bg-surface animate-pulse">
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
      <div className="bg-white border-b border-border px-4 md:px-6 py-3 flex items-center gap-4">
        <div className="flex-1">
          <div className="h-4 w-28 bg-gray-200 rounded mb-1.5" />
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white border border-border rounded-2xl p-5 space-y-4">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="space-y-1.5">
                  <div className="h-2.5 w-16 bg-gray-200 rounded" />
                  <div className="h-9 bg-gray-100 rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
