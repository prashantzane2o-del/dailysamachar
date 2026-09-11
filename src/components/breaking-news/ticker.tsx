export function BreakingTicker() {
  return (
    <div className="border-line bg-ink border-y text-white">
      <div className="container-page flex h-10 items-center gap-4 overflow-hidden text-xs">
        <span className="bg-signal shrink-0 px-2 py-1 text-[10px] font-extrabold tracking-widest">BREAKING</span>
        <p className="truncate font-medium">
          Monsoon session: Parliament set for a decisive week as key bills enter debate
        </p>
        <span className="ml-auto hidden shrink-0 text-slate-400 sm:block">Updated moments ago</span>
      </div>
    </div>
  );
}
