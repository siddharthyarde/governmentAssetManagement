export default function Loading() {
  return (
    <div className="min-h-dvh bg-white animate-pulse">
      <div className="border-b border-gray-200 px-4 md:px-6 h-14 flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
        <div className="h-4 w-20 bg-gray-200 rounded" />
      </div>
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
      <div className="max-w-md mx-auto px-4 py-16 space-y-6">
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto" />
          <div className="h-5 w-32 bg-gray-200 rounded mx-auto" />
          <div className="h-4 w-48 bg-gray-100 rounded mx-auto" />
        </div>
        <div className="h-32 bg-gray-100 rounded-2xl" />
        <div className="h-11 bg-saffron-100 rounded-xl" />
      </div>
    </div>
  );
}
