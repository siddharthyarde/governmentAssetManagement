export default function Loading() {
  return (
    <div className="min-h-dvh bg-surface flex animate-pulse">
      <div className="hidden md:block w-64 bg-white border-r border-border shrink-0" />
      <div className="flex-1 flex flex-col">
        <div className="h-1 w-full bg-gray-200" />
        <div className="h-16 bg-white border-b border-border px-6 flex items-center gap-3">
          <div className="h-5 w-48 bg-gray-200 rounded-lg" />
        </div>
        <div className="flex-1 p-6 flex flex-col gap-5">
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-white border border-border rounded-2xl" />)}
          </div>
          <div className="h-10 bg-white border border-border rounded-xl w-full" />
          <div className="flex-1 bg-white border border-border rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
