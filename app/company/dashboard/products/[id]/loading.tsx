export default function ProductDetailLoading() {
  return (
    <div className="min-h-dvh bg-surface flex">
      <aside className="hidden md:flex flex-col w-52 bg-white border-r border-border shrink-0">
        <div className="px-4 py-4 border-b border-border"><div className="h-3 w-28 bg-gray-200 rounded animate-pulse mb-1.5" /><div className="h-4 w-20 bg-gray-200 rounded animate-pulse" /></div>
        <div className="py-3 px-3 flex flex-col gap-1">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-9 rounded-xl bg-gray-100 animate-pulse" />)}
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#FF9933 33.33%,#FFFFFF 33.33% 66.66%,#138808 66.66%)" }} />
        <div className="border-b border-border px-6 py-3 bg-white flex items-center gap-3">
          <div className="h-9 w-9 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="px-6 py-6 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 flex flex-col gap-5">
              {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-48 bg-white border border-border rounded-2xl animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />)}
            </div>
            <div className="flex flex-col gap-5">
              {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-40 bg-white border border-border rounded-2xl animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
