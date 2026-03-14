export default function Loading() {
  return (
    <div className="min-h-dvh bg-white animate-pulse">
      <div className="border-b border-gray-200 px-4 md:px-6 h-14 flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
        <div className="h-4 w-20 bg-gray-200 rounded" />
      </div>
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-80 bg-gray-100 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-6 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-100 rounded" />
            <div className="h-8 w-32 bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-100 rounded" />
            <div className="h-4 w-5/6 bg-gray-100 rounded" />
            <div className="h-4 w-4/6 bg-gray-100 rounded" />
            <div className="flex gap-3 mt-4">
              <div className="h-11 flex-1 bg-gray-200 rounded-xl" />
              <div className="h-11 w-12 bg-gray-100 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
