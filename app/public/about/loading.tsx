export default function Loading() {
  return (
    <div className="min-h-dvh bg-white animate-pulse">
      <div className="border-b border-gray-200 px-4 md:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
        </div>
        <div className="flex gap-3">
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-14 space-y-10">
        <div className="space-y-4 max-w-2xl">
          <div className="h-6 w-72 bg-gray-200 rounded" />
          <div className="h-12 w-full bg-gray-200 rounded" />
          <div className="h-4 w-2/3 bg-gray-100 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-3">
              <div className="h-6 w-6 bg-gray-200 rounded" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-3 w-full bg-gray-100 rounded" />
              <div className="h-3 w-4/5 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
