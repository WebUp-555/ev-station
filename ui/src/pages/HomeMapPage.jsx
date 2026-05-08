
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, SlidersHorizontal, X, ChevronUp, Filter, Locate } from "lucide-react";
import Navbar from "@/components/Navbar";
import HomeMapGoogleMap from "@/components/HomeMapGoogleMap";
import StationCard from "@/components/StationCard";
import StationCardSkeleton from "@/components/StationCardSkeleton";
import { STATIONS } from "@/data/stations";
import { getNearbyStations } from "@/services/stationService";

export default function HomeMapPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [stationData, setStationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    let active = true;

    const loadStations = async () => {
      try {
        const nearbyStations = await getNearbyStations();

        if (!active) return;

        setStationData(nearbyStations);
        setSelectedId(nearbyStations[0]?.id || null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadStations();

    return () => {
      active = false;
    };
  }, []);

  const stations = useMemo(() => {
    const sourceStations = stationData.length > 0 ? stationData : STATIONS;
    let list = [...sourceStations].sort((a, b) => a.distance_km - b.distance_km);
    if (onlyAvailable) list = list.filter((s) => s.availability === "available");
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.address.toLowerCase().includes(q) ||
          s.operator.toLowerCase().includes(q)
      );
    }
    return list;
  }, [stationData, query, onlyAvailable]);

  const countsSource = stationData.length > 0 ? stationData : STATIONS;

  const counts = {
    available: countsSource.filter((s) => s.availability === "available").length,
    busy: countsSource.filter((s) => s.availability === "busy").length,
    offline: countsSource.filter((s) => s.availability === "offline").length,
  };

  const selectedStationId = selectedId && stations.some((s) => s.id === selectedId)
    ? selectedId
    : stations[0]?.id;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050505] text-white">
      <Navbar floating />

      <HomeMapGoogleMap
        stations={stations}
        nearestId={stations[0]?.id}
        selectedId={selectedStationId}
        onSelect={(s, ev) => {
          // If Ctrl/Meta is pressed, navigate to details page
          const ctrl = ev?.domEvent?.ctrlKey || ev?.domEvent?.metaKey || ev?.domEvent?.which === 1 && (ev?.domEvent?.ctrlKey || ev?.domEvent?.metaKey);
          if (ctrl) {
            navigate(`/station/${s.id}`);
            return;
          }

          // Otherwise select and scroll the sidebar card into view
          setSelectedId(s.id);
          setTimeout(() => {
            const card = document.querySelector(`[data-testid="station-card-${s.id}"]`);
            if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 120);
        }}
        className="absolute inset-0 rounded-none"
      />

      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-md fade-up">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            data-testid="map-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stations, address, operator…"
            className="w-full pl-11 pr-12 py-3 rounded-2xl bg-black/80 backdrop-blur-xl border border-zinc-800 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
          />
          <button
            data-testid="map-search-clear"
            onClick={() => navigate("/search")}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-semibold text-emerald-300 transition"
          >
            Advanced
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2 justify-center">
          <span data-testid="counts-available" className="text-[11px] font-mono text-emerald-300 bg-black/70 backdrop-blur px-2.5 py-1 rounded-full border border-emerald-500/20">
            {counts.available} available
          </span>
          <span data-testid="counts-busy" className="text-[11px] font-mono text-red-300 bg-black/70 backdrop-blur px-2.5 py-1 rounded-full border border-red-500/20">
            {counts.busy} busy
          </span>
          <span data-testid="counts-offline" className="text-[11px] font-mono text-zinc-400 bg-black/70 backdrop-blur px-2.5 py-1 rounded-full border border-zinc-700">
            {counts.offline} offline
          </span>
        </div>
      </div>

      <button
        data-testid="recenter-btn"
        className="absolute bottom-32 lg:bottom-8 right-4 z-30 w-11 h-11 rounded-2xl bg-black/80 backdrop-blur-xl border border-zinc-800 grid place-items-center hover:border-emerald-500/40 hover:text-emerald-400 transition text-zinc-300"
        title="Recenter"
      >
        <Locate className="w-4 h-4" />
      </button>

      <aside
        data-testid="desktop-side-panel"
        className="hidden lg:flex flex-col absolute top-20 right-4 z-30 w-[400px] max-h-[calc(100vh-7rem)] bg-black/80 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden fade-up"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="p-5 border-b border-zinc-800/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">
                Nearby Stations
              </p>
              <h2 className="font-display text-xl font-bold mt-1">
                {stations.length} found
              </h2>
            </div>
            <button
              data-testid="desktop-filter-toggle"
              onClick={() => setOnlyAvailable((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition
                ${onlyAvailable
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                  : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"}`}
            >
              <Filter className="w-3.5 h-3.5" />
              Available
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <StationCardSkeleton key={i} />)
          ) : stations.length === 0 ? (
            <EmptyState />
          ) : (
            stations.map((s, i) => (
              <div
                key={s.id}
                className="fade-up"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <StationCard station={s} isNearest={s.id === stations[0]?.id} isSelected={s.id === selectedStationId} />
              </div>
            ))
          )}
        </div>
      </aside>

      <div
        data-testid="mobile-bottom-sheet"
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 transition-transform duration-500 ease-out
          ${sheetOpen ? "translate-y-0" : "translate-y-[calc(100%-9rem)]"}
        `}
      >
        <div className="bg-black/90 backdrop-blur-xl border-t border-zinc-800 rounded-t-3xl shadow-[0_-12px_32px_rgba(0,0,0,0.6)]">
          <button
            data-testid="bottom-sheet-handle"
            onClick={() => setSheetOpen((v) => !v)}
            className="w-full pt-3 pb-2 flex flex-col items-center gap-2"
          >
            <span className="w-10 h-1 rounded-full bg-zinc-700" />
            <div className="flex items-center gap-2">
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 font-semibold">
                Nearby
              </p>
              <ChevronUp className={`w-4 h-4 text-zinc-500 transition-transform ${sheetOpen ? "rotate-180" : ""}`} />
            </div>
          </button>

          <div className="px-4 pb-3 flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-bold">{stations.length} stations</h2>
            <button
              data-testid="mobile-filter-toggle"
              onClick={() => setOnlyAvailable((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition
                ${onlyAvailable
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                  : "bg-zinc-900 border-zinc-800 text-zinc-300"}`}
            >
              <SlidersHorizontal className="w-3 h-3" />
              {onlyAvailable ? "Available only" : "All stations"}
            </button>
          </div>

          <div
            className={`px-4 pb-6 space-y-3 overflow-y-auto transition-all
              ${sheetOpen ? "max-h-[60vh]" : "max-h-32"}`}
          >
            {loading ? (
              <>
                <StationCardSkeleton />
                <StationCardSkeleton />
              </>
            ) : stations.length === 0 ? (
              <EmptyState />
            ) : (
              stations.map((s) => (
                <StationCard
                  key={s.id}
                  station={s}
                  isNearest={s.id === stations[0]?.id}
                  isSelected={s.id === selectedStationId}
                  compact={!sheetOpen}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const EmptyState = () => (
  <div data-testid="empty-state" className="text-center py-12 px-4">
    <div className="mx-auto w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 grid place-items-center">
      <X className="w-6 h-6 text-zinc-600" />
    </div>
    <h3 className="mt-4 font-display text-lg font-semibold">No stations found</h3>
    <p className="mt-1 text-sm text-zinc-500">
      Try widening your filters or searching a different area.
    </p>
  </div>
);