
import { useNavigate } from "react-router-dom";
import { Zap, Navigation as NavIcon } from "lucide-react";

const MAP_BG =
  "https://images.unsplash.com/photo-1713981272299-355d7038d708?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxNzV8MHwxfHNlYXJjaHwzfHxkYXJrJTIwY2l0eSUyMG1hcCUyMGludGVyZmFjZXxlbnwwfHx8fDE3NzgxNjM0MDd8MA&ixlib=rb-4.1.0&q=85";

export const MockMap = ({
  stations = [],
  nearestId,
  selectedId,
  onSelect,
  showUser = true,
  zoomable = true,
  className = "",
  compact = false,
}) => {
  const navigate = useNavigate();

  const handlePinClick = (s) => {
    if (onSelect) onSelect(s);
    else navigate(`/station/${s.id}`);
  };

  return (
    <div
      data-testid="mock-map"
      className={`relative overflow-hidden rounded-3xl border border-zinc-800 bg-[#070708] ${className}`}
    >
      {/* Map image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${MAP_BG})` }}
      />
      {/* Dim overlay */}
      <div className="absolute inset-0 bg-[#050505]/80" />
      {/* Tech grid */}
      <div className="absolute inset-0 map-grid-overlay opacity-70" />
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,5,5,0.85)_100%)]" />

      {/* User location */}
      {showUser && (
        <div
          data-testid="user-location-pin"
          className="absolute z-20"
          style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
        >
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-blue-500/40 pulse-ring" />
            <span className="relative block w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-[0_0_18px_rgba(59,130,246,0.8)]" />
          </div>
          {!compact && (
            <span className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-[0.2em] font-semibold text-blue-300 bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 rounded-full">
              You
            </span>
          )}
        </div>
      )}

      {/* Connector lines from user → nearest */}
      {nearestId && showUser && (() => {
        const n = stations.find((s) => s.id === nearestId);
        if (!n) return null;
        return (
          <svg
            className="absolute inset-0 w-full h-full z-10 pointer-events-none"
            preserveAspectRatio="none"
          >
            <line
              x1="50%"
              y1="50%"
              x2={`${n.pin.x}%`}
              y2={`${n.pin.y}%`}
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.6"
            />
          </svg>
        );
      })()}

      {/* Station Pins */}
      {stations.map((s) => {
        const isNearest = s.id === nearestId;
        const isSelected = s.id === selectedId;
        const colorCls =
          s.availability === "available"
            ? "bg-emerald-500 border-emerald-300/40"
            : s.availability === "busy"
            ? "bg-red-500 border-red-300/40"
            : "bg-zinc-600 border-zinc-400/40";
        const glow =
          s.availability === "available"
            ? "shadow-[0_0_18px_rgba(16,185,129,0.65)]"
            : s.availability === "busy"
            ? "shadow-[0_0_14px_rgba(239,68,68,0.5)]"
            : "shadow-none";

        return (
          <button
            key={s.id}
            data-testid={`map-pin-${s.id}`}
            onClick={() => handlePinClick(s)}
            className="absolute z-30 -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${s.pin.x}%`, top: `${s.pin.y}%` }}
            title={s.name}
          >
            <div
              className={`relative w-9 h-9 rounded-full grid place-items-center border-2 ${colorCls} ${glow}
                ${isNearest ? "glow-pulse scale-110" : ""}
                ${isSelected ? "ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0a]" : ""}
                transition-transform duration-200 group-hover:scale-110`}
            >
              <Zap className="w-4 h-4 text-white" strokeWidth={2.6} />
              {/* Pin tail */}
              <span
                className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45
                  ${s.availability === "available" ? "bg-emerald-500" : s.availability === "busy" ? "bg-red-500" : "bg-zinc-600"}`}
              />
            </div>
            {!compact && (
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] uppercase font-mono whitespace-nowrap text-zinc-300 bg-black/70 backdrop-blur border border-zinc-700/60 px-1.5 py-0.5 rounded">
                {s.distance_km.toFixed(1)}km
              </span>
            )}
          </button>
        );
      })}

      {/* Compass / scale indicator */}
      {zoomable && (
        <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-2">
          <div
            data-testid="map-compass"
            className="w-10 h-10 rounded-xl bg-black/70 backdrop-blur border border-zinc-700 grid place-items-center"
          >
            <NavIcon className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
      )}

      {/* Scale */}
      {zoomable && (
        <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
          <span className="block w-10 h-[2px] bg-zinc-400" />
          1 km
        </div>
      )}

      {/* Top-left badge */}
      {!compact && (
        <div className="absolute top-4 left-4 z-30 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-300/80 bg-black/60 backdrop-blur border border-emerald-500/20 rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live · San Francisco
        </div>
      )}
    </div>
  );
};

export default MockMap;