
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, X, MapPin, Zap, ArrowRight, SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar";
import MockMap from "@/components/MockMap";
import StationCardSkeleton from "@/components/StationCardSkeleton";
import StatusBadge from "@/components/StatusBadge";
import { STATIONS, NEAREST_STATION_ID } from "@/data/stations";

const POPULAR = ["Embarcadero", "SoMa", "Castro", "Tesla", "Fast Charge"];

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [query]);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return STATIONS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        s.operator.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [query]);

  const results = useMemo(() => {
    let list = [...STATIONS];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.address.toLowerCase().includes(q) ||
          s.operator.toLowerCase().includes(q)
      );
    }
    if (onlyAvailable) list = list.filter((s) => s.availability === "available");
    return list.sort((a, b) => a.distance_km - b.distance_km);
  }, [query, onlyAvailable]);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="px-4 sm:px-6 pt-4">
        <Navbar />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <div className="fade-up">
          <p className="text-[11px] uppercase tracking-[0.24em] font-semibold text-emerald-400">
            Discover
          </p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl font-bold tracking-tight">
            Find your next charge.
          </h1>
          <p className="mt-3 text-zinc-400 max-w-2xl">
            Search by station, operator or neighborhood. Filter by live availability and get directions instantly.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 fade-up" style={{ animationDelay: "0.05s" }}>
          <div className="relative">
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              data-testid="search-input"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Search by station name, operator or address…"
              className="w-full pl-14 pr-14 py-5 rounded-2xl bg-[#0e0e10] border border-zinc-800 text-base text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition"
            />
            {query && (
              <button
                data-testid="search-clear-btn"
                onClick={() => setQuery("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 grid place-items-center hover:border-zinc-700 text-zinc-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {showSuggestions && suggestions.length > 0 && (
              <div
                data-testid="search-suggestions"
                className="absolute z-30 mt-2 w-full bg-[#0e0e10] border border-zinc-800 rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
              >
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    data-testid={`suggestion-${s.id}`}
                    onMouseDown={() => navigate(`/station/${s.id}`)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-900/60 transition border-b border-zinc-900 last:border-b-0"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/15 grid place-items-center">
                      <Zap className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{s.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{s.address}</p>
                    </div>
                    <span className="text-xs font-mono text-emerald-300/80">
                      {s.distance_km.toFixed(1)} km
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                data-testid="filter-available-toggle"
                onClick={() => setOnlyAvailable((v) => !v)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition
                  ${onlyAvailable
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                    : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"}`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Show only available
                {onlyAvailable && <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              </button>

              <div className="hidden md:flex items-center gap-2 ml-2">
                <span className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 font-semibold">
                  Popular
                </span>
                {POPULAR.map((p) => (
                  <button
                    key={p}
                    data-testid={`popular-${p.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={() => setQuery(p)}
                    className="px-3 py-1 rounded-full text-xs text-zinc-400 hover:text-white border border-zinc-800 hover:border-emerald-500/40 transition"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-zinc-500 font-mono">
              {results.length} station{results.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
          <div className="space-y-3">
            {loading ? (
              <>
                <StationCardSkeleton />
                <StationCardSkeleton />
                <StationCardSkeleton />
              </>
            ) : results.length === 0 ? (
              <NoResults query={query} />
            ) : (
              results.map((s, i) => (
                <SearchRow
                  key={s.id}
                  station={s}
                  highlighted={s.id === hoveredId}
                  onMouseEnter={() => setHoveredId(s.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => navigate(`/station/${s.id}`)}
                  isNearest={s.id === NEAREST_STATION_ID}
                  delay={i}
                />
              ))
            )}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-6 fade-up" style={{ animationDelay: "0.1s" }}>
              <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-zinc-500 mb-3">
                Map preview
              </p>
              <MockMap
                stations={results}
                nearestId={NEAREST_STATION_ID}
                selectedId={hoveredId}
                className="h-[460px]"
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

const SearchRow = ({ station, highlighted, onMouseEnter, onMouseLeave, onClick, isNearest, delay = 0 }) => (
  <button
    data-testid={`search-result-${station.id}`}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className={`group w-full text-left fade-up rounded-2xl border bg-[#0e0e10] p-5 flex items-center gap-4 transition-all duration-300
      ${highlighted
        ? "border-emerald-500/40 -translate-y-0.5 shadow-[0_8px_32px_rgba(16,185,129,0.12)]"
        : "border-zinc-800 hover:border-emerald-500/30 hover:-translate-y-0.5"}`}
    style={{ animationDelay: `${delay * 0.04}s` }}
  >
    <div
      className={`shrink-0 w-12 h-12 rounded-2xl grid place-items-center border
        ${station.availability === "available"
          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
          : station.availability === "busy"
          ? "bg-red-500/15 text-red-400 border-red-500/30"
          : "bg-zinc-700/30 text-zinc-400 border-zinc-700"}`}
    >
      <Zap className="w-5 h-5" strokeWidth={2.4} />
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <h3 className="font-display text-base font-semibold truncate">{station.name}</h3>
        {isNearest && (
          <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-2 py-0.5">
            Nearest
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-zinc-500 truncate flex items-center gap-1.5">
        <MapPin className="w-3.5 h-3.5" /> {station.address}
      </p>
      <div className="mt-2 flex items-center gap-3 flex-wrap">
        <StatusBadge status={station.availability} showIcon={false} />
        <span className="text-xs text-zinc-400 font-mono">{station.distance_km.toFixed(1)} km</span>
        <span className="text-xs text-zinc-500 font-mono">{station.speed_kw} kW</span>
        <span className="text-xs text-zinc-500">{station.connector}</span>
      </div>
    </div>

    <ArrowRight className="hidden sm:block w-5 h-5 text-zinc-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
  </button>
);

const NoResults = ({ query }) => (
  <div
    data-testid="no-results"
    className="rounded-3xl border border-zinc-800 bg-[#0e0e10] p-10 text-center"
  >
    <div className="mx-auto w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 grid place-items-center">
      <SearchIcon className="w-6 h-6 text-zinc-600" />
    </div>
    <h3 className="mt-4 font-display text-xl font-bold">No matches for “{query || "your search"}”</h3>
    <p className="mt-2 text-sm text-zinc-500 max-w-md mx-auto">
      Try a different keyword, or remove filters. We're constantly adding new stations near you.
    </p>
  </div>
);