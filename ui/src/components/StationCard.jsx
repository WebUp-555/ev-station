
import { useNavigate } from "react-router-dom";
import { MapPin, Zap, Star, Navigation, ChevronRight } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";

export const StationCard = ({ station, isNearest = false, compact = false, isSelected = false }) => {
  const navigate = useNavigate();

  const handleClick = () => navigate(`/station/${station.id}`);

  return (
    <button
      data-testid={`station-card-${station.id}`}
      onClick={handleClick}
      className={`group w-full text-left rounded-2xl border bg-[#101013] p-4 transition-all duration-300
        hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-[0_8px_32px_rgba(16,185,129,0.10)]
        ${isNearest ? "border-emerald-500/50 ring-1 ring-emerald-500/30" : "border-zinc-800"}
        ${isSelected ? "ring-2 ring-emerald-400/40 shadow-[0_12px_40px_rgba(16,185,129,0.12)]" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`shrink-0 w-11 h-11 rounded-xl grid place-items-center
            ${station.availability === "available"
              ? "bg-emerald-500/15 text-emerald-400"
              : station.availability === "busy"
              ? "bg-red-500/15 text-red-400"
              : "bg-zinc-700/30 text-zinc-400"}`}
        >
          <Zap className="w-5 h-5" strokeWidth={2.4} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-[15px] font-semibold text-white truncate">
              {station.name}
            </h3>
            {isNearest && (
              <span
                data-testid={`nearest-tag-${station.id}`}
                className="text-[10px] uppercase tracking-[0.18em] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-2 py-0.5"
              >
                Nearest
              </span>
            )}
          </div>

          {!compact && (
            <p className="mt-0.5 text-xs text-zinc-500 truncate flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {station.address}
            </p>
          )}

          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={station.availability} showIcon={false} />
              <span className="text-xs text-zinc-400 inline-flex items-center gap-1">
                <Navigation className="w-3 h-3" />
                <span className="font-mono text-emerald-300/90">
                  {station.distance_km.toFixed(1)} km
                </span>
              </span>
              {!compact && (
                <span className="text-xs text-zinc-500 inline-flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {station.rating}
                </span>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
          </div>

          {!compact && (
            <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">
                {station.connector}
              </span>
              <span className="text-[11px] font-mono text-zinc-300">
                {station.speed_kw} kW
                <span className="text-zinc-600 mx-1">·</span>
                <span className="text-emerald-400">
                  {station.available_ports}/{station.total_ports}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

export default StationCard;