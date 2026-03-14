export default function Loading() {
  return (
    <div className="min-h-dvh bg-white animate-pulse">
      <div className="border-b border-gray-200 px-4 md:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
        </div>
        <div className="flex gap-3">
          <div className="h-3 w-20 bg-gray-200 rounded hidden md:block" />
          <div className="h-3 w-16 bg-gray-200 rounded hidden md:block" />
        </div>
      </div>
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8 space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
        <div className="flex gap-3 mb-6">
          <div className="h-9 flex-1 bg-gray-100 rounded-xl" />
          <div className="h-9 w-28 bg-gray-100 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden">
              <div className="h-40 bg-gray-100" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-3 w-1/2 bg-gray-100 rounded" />
                <div className="flex items-center justify-between mt-2">
                  <div className="h-5 w-20 bg-gray-200 rounded" />
                  <div className="h-8 w-24 bg-gray-200 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
