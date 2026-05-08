
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Navigation,
  MapPin,
  Zap,
  Clock,
  DollarSign,
  Star,
  Plug,
  Share2,
  Heart,
  Phone,
  Wifi,
  Coffee,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import MockMap from "@/components/MockMap";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "sonner";
import { api } from "@/services/api";
import { getNearbyStations } from "@/services/stationService";
import { useAuth } from "@/context/AuthContext";
import { useStations } from "@/context/StationContext";

const HERO_IMG =
  "https://images.unsplash.com/photo-1767042286259-d38926e1f2a4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjV8MHwxfHNlYXJjaHwzfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBjaGFyZ2luZyUyMG5pZ2h0fGVufDB8fHx8MTc3ODE2MzQwMXww&ixlib=rb-4.1.0&q=85";

export default function StationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { lastStations } = useStations();
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);
  const [isNearest, setIsNearest] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    let active = true;

    const loadStation = async () => {
      try {
        setLoading(true);
        // First try to find in last searched stations (from SearchPage or other pages)
        let foundStation = lastStations.find((station) => station.id === id);
        
        if (!foundStation) {
          // Fallback: fetch nearby stations from user location
          const nearbyStations = await getNearbyStations();
          foundStation = nearbyStations.find((station) => station.id === id) || null;
        }

        if (!active) return;

        setStation(foundStation);
        setIsNearest(Boolean(foundStation && lastStations[0]?.id === foundStation.id));
      } catch {
        if (active) {
          setStation(null);
          setIsNearest(false);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadStation();

    return () => {
      active = false;
    };
  }, [id, lastStations]);

  useEffect(() => {
    if (!station || !token) {
      setFavorited(false);
      return;
    }

    let active = true;

    const loadFavorites = async () => {
      try {
        const favorites = await api.favorites.list(token);
        const saved = favorites.some(
          (favorite) =>
            favorite.name === station.name &&
            Math.abs(Number(favorite.lat) - station.coords.lat) < 0.0001 &&
            Math.abs(Number(favorite.lng) - station.coords.lng) < 0.0001
        );

        if (active) {
          setFavorited(saved);
        }
      } catch {
        if (active) {
          setFavorited(false);
        }
      }
    };

    loadFavorites();

    return () => {
      active = false;
    };
  }, [station, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white grid place-items-center px-6">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold">Loading station</h1>
          <p className="mt-2 text-zinc-500">Fetching real station data from the backend.</p>
        </div>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="min-h-screen bg-[#050505] text-white grid place-items-center px-6">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold">Station not found</h1>
          <p className="mt-2 text-zinc-500">The station you’re looking for doesn’t exist.</p>
          <button
            data-testid="back-to-map-btn"
            onClick={() => navigate("/")}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to map
          </button>
        </div>
      </div>
    );
  }

  const handleNavigate = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${station.coords.lat},${station.coords.lng}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleFavorite = async () => {
    if (!token) {
      toast.error("Sign in to save favorites");
      navigate("/auth");
      return;
    }

    try {
      if (favorited) {
        await api.favorites.remove(token, {
          name: station.name,
          lat: station.coords.lat,
          lng: station.coords.lng,
        });
        setFavorited(false);
        toast("Removed from favorites");
      } else {
        await api.favorites.add(token, {
          name: station.name,
          lat: station.coords.lat,
          lng: station.coords.lng,
        });
        setFavorited(true);
        toast.success("Added to favorites");
      }
    } catch (error) {
      toast.error(error.message || "Could not update favorites");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Could not copy link");
    }
  };

  const ports = Array.from({ length: station.total_ports }).map((_, i) => ({
    id: i,
    inUse: i >= station.available_ports,
  }));

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="px-4 sm:px-6 pt-4">
        <Navbar />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-32 lg:pb-16">
        <button
          data-testid="back-btn"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-sm text-zinc-300 hover:text-white hover:border-zinc-700 transition fade-up"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div
          className="mt-5 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 fade-up"
          style={{ animationDelay: "0.05s" }}
        >
          <div className="rounded-3xl overflow-hidden border border-zinc-800 bg-[#0a0a0c]">
            <div
              className="relative h-64 sm:h-80 bg-cover bg-center"
              style={{ backgroundImage: `url(${HERO_IMG})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 rounded-full px-2.5 py-1">
                  {station.operator}
                </span>
                {isNearest && (
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-blue-300 bg-blue-500/15 border border-blue-500/30 rounded-full px-2.5 py-1">
                    Nearest to you
                  </span>
                )}
              </div>
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  data-testid="favorite-btn"
                  onClick={handleFavorite}
                  className={`w-9 h-9 rounded-xl backdrop-blur border grid place-items-center transition
                    ${favorited
                      ? "bg-red-500/20 border-red-500/40 text-red-400"
                      : "bg-black/60 border-zinc-700 text-zinc-300 hover:text-white"}`}
                >
                  <Heart className={`w-4 h-4 ${favorited ? "fill-red-400" : ""}`} />
                </button>
                <button
                  data-testid="share-btn"
                  onClick={handleShare}
                  className="w-9 h-9 rounded-xl bg-black/60 backdrop-blur border border-zinc-700 grid place-items-center text-zinc-300 hover:text-white transition"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <h1
                    data-testid="station-title"
                    className="font-display text-3xl sm:text-4xl font-bold tracking-tight"
                  >
                    {station.name}
                  </h1>
                  <p className="mt-2 text-zinc-400 flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="truncate">{station.address}</span>
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-sm flex-wrap">
                    <StatusBadge status={station.availability} size="lg" />
                    <span className="text-zinc-500">·</span>
                    <span className="font-mono text-zinc-300 inline-flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {station.rating}
                    </span>
                    <span className="text-zinc-500 text-xs">({station.reviews} reviews)</span>
                    <span className="text-zinc-500">·</span>
                    <span className="font-mono text-emerald-300 text-sm">
                      {station.distance_km.toFixed(1)} km away
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Stat
                  testId="stat-speed"
                  icon={<Zap className="w-4 h-4" />}
                  label="Max speed"
                  value={`${station.speed_kw} kW`}
                />
                <Stat
                  testId="stat-price"
                  icon={<DollarSign className="w-4 h-4" />}
                  label="Per kWh"
                  value={`$${station.price_per_kwh.toFixed(2)}`}
                />
                <Stat
                  testId="stat-ports"
                  icon={<Plug className="w-4 h-4" />}
                  label="Ports"
                  value={`${station.available_ports}/${station.total_ports}`}
                  emphasis={station.availability === "available"}
                />
                <Stat
                  testId="stat-updated"
                  icon={<Clock className="w-4 h-4" />}
                  label="Updated"
                  value={`${station.last_updated_min}m ago`}
                />
              </div>

              <div className="mt-6">
                <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-zinc-500">
                  Live port status
                </p>
                <div data-testid="ports-grid" className="mt-3 flex flex-wrap gap-2">
                  {ports.map((p) => (
                    <div
                      key={p.id}
                      data-testid={`port-${p.id}`}
                      className={`px-3 py-2 rounded-xl border text-xs font-semibold inline-flex items-center gap-2
                        ${p.inUse
                          ? "bg-red-500/10 border-red-500/30 text-red-300"
                          : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${p.inUse ? "bg-red-400" : "bg-emerald-400 animate-pulse"}`}
                      />
                      Port {p.id + 1} · {p.inUse ? "In use" : "Free"}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-zinc-500">
                  Amenities
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Amenity icon={<Wifi className="w-3.5 h-3.5" />} label="Free Wi-Fi" />
                  <Amenity icon={<Coffee className="w-3.5 h-3.5" />} label="Café nearby" />
                  <Amenity icon={<Plug className="w-3.5 h-3.5" />} label={station.connector} />
                  <Amenity icon={<Phone className="w-3.5 h-3.5" />} label="24/7 support" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <MockMap
              stations={[station]}
              nearestId={station.id}
              selectedId={station.id}
              className="h-72 lg:h-80"
              compact
            />

            <div className="rounded-3xl border border-zinc-800 bg-[#0a0a0c] p-5 space-y-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-zinc-500">
                  Coordinates
                </p>
                <p data-testid="coords" className="mt-1 font-mono text-sm text-zinc-300">
                  {station.coords.lat.toFixed(4)}°N, {Math.abs(station.coords.lng).toFixed(4)}°W
                </p>
              </div>
              <div className="border-t border-zinc-800 pt-3">
                <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-zinc-500">
                  Last status update
                </p>
                <p className="mt-1 text-sm text-zinc-300">
                  {station.last_updated_min} minute{station.last_updated_min !== 1 ? "s" : ""} ago
                </p>
              </div>
              <button
                data-testid="navigate-btn"
                onClick={handleNavigate}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition shadow-[0_8px_24px_rgba(16,185,129,0.25)]"
              >
                <Navigation className="w-4 h-4" />
                Navigate
              </button>
              <button
                data-testid="copy-address-btn"
                onClick={() => {
                  navigator.clipboard.writeText(station.address);
                  toast.success("Address copied");
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-950 text-white text-sm font-semibold transition"
              >
                <MapPin className="w-4 h-4" />
                Copy address
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 px-4 pb-4 pt-3 bg-gradient-to-t from-black via-black/95 to-transparent">
        <button
          data-testid="navigate-btn-mobile"
          onClick={handleNavigate}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold shadow-[0_8px_32px_rgba(16,185,129,0.4)]"
        >
          <Navigation className="w-4 h-4" />
          Navigate to station
        </button>
      </div>
    </div>
  );
}

const Stat = ({ icon, label, value, emphasis, testId }) => (
  <div
    data-testid={testId}
    className={`rounded-2xl border p-3.5 transition
      ${emphasis
        ? "border-emerald-500/30 bg-emerald-500/[0.04]"
        : "border-zinc-800 bg-[#0e0e10]"}`}
  >
    <span className={`inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] font-semibold ${emphasis ? "text-emerald-400" : "text-zinc-500"}`}>
      {icon}
      {label}
    </span>
    <p className={`mt-1 font-display text-xl font-bold ${emphasis ? "text-emerald-300" : "text-white"}`}>
      {value}
    </p>
  </div>
);

const Amenity = ({ icon, label }) => (
  <span className="inline-flex items-center gap-1.5 text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1.5">
    {icon}
    {label}
  </span>
);