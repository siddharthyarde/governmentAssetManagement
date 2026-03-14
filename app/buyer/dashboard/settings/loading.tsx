export default function Loading() {
  return (
    <div className="min-h-dvh bg-surface animate-pulse">
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
      <div className="bg-white border-b border-border px-4 md:px-6 py-3 flex items-center gap-4">
        <div className="flex-1">
          <div className="h-4 w-28 bg-gray-200 rounded mb-1.5" />
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row gap-5">
        <div className="md:w-52 shrink-0 flex flex-col gap-3">
          <div className="bg-white border border-border rounded-2xl p-5 flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl" />
            <div className="h-3 w-28 bg-gray-200 rounded" />
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-xl" />
          ))}
        </div>
        <div className="flex-1 flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-border rounded-2xl overflow-hidden">
              <div className="h-14 border-b border-border bg-surface px-6 flex items-center">
                <div className="h-4 w-32 bg-gray-200 rounded" />
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="space-y-1.5">
                      <div className="h-2.5 w-16 bg-gray-200 rounded" />
                      <div className="h-9 bg-gray-100 rounded-xl" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
