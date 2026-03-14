export default function CompanyAppLoading() {
  return (
    <div className="min-h-dvh bg-surface flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-1 w-48 rounded-full overflow-hidden bg-gray-100">
          <div className="h-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] animate-pulse" />
        </div>
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}
