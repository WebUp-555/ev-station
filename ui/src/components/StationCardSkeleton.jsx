
export const StationCardSkeleton = () => (
  <div
    data-testid="station-card-skeleton"
    className="w-full rounded-2xl border border-zinc-800 bg-[#101013] p-4 animate-pulse"
  >
    <div className="flex gap-3">
      <div className="w-11 h-11 rounded-xl bg-zinc-800/60" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-3/4 rounded bg-zinc-800/70" />
        <div className="h-2.5 w-1/2 rounded bg-zinc-800/50" />
        <div className="flex gap-2 pt-1">
          <div className="h-5 w-16 rounded-full bg-zinc-800/60" />
          <div className="h-5 w-12 rounded-full bg-zinc-800/40" />
        </div>
      </div>
    </div>
  </div>
);

export default StationCardSkeleton;