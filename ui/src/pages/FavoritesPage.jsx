import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MapPin, Navigation, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigate("/auth");
      return;
    }

    let active = true;

    const loadFavorites = async () => {
      try {
        const data = await api.favorites.list(token);
        if (active) {
          setFavorites(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        toast.error(error.message || "Could not load favorites");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadFavorites();

    return () => {
      active = false;
    };
  }, [isAuthenticated, navigate, token]);

  const handleRemove = async (favorite) => {
    try {
      await api.favorites.remove(token, {
        name: favorite.name,
        lat: favorite.lat,
        lng: favorite.lng,
      });
      setFavorites((prev) => prev.filter((item) => item._id !== favorite._id));
      toast.success("Removed from favorites");
    } catch (error) {
      toast.error(error.message || "Could not remove favorite");
    }
  };

  const handleDirections = (favorite) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${favorite.lat},${favorite.lng}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="px-4 sm:px-6 pt-4">
        <Navbar />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <div className="fade-up">
          <p className="text-[11px] uppercase tracking-[0.24em] font-semibold text-emerald-400">
            Saved
          </p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl font-bold tracking-tight">
            Your favorites.
          </h1>
          <p className="mt-3 text-zinc-400 max-w-2xl">
            Quickly access charging stations you saved while signed in.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {loading ? (
            <div className="rounded-2xl border border-zinc-800 bg-[#0e0e10] p-6 text-zinc-400">
              Loading favorites...
            </div>
          ) : favorites.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-[#0e0e10] p-10 text-center">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 grid place-items-center">
                <Heart className="w-6 h-6 text-zinc-600" />
              </div>
              <h2 className="mt-4 font-display text-xl font-semibold">No favorites yet</h2>
              <p className="mt-2 text-sm text-zinc-500">
                Save stations from the details page and they will appear here.
              </p>
              <button
                onClick={() => navigate("/search")}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold"
              >
                Find stations
              </button>
            </div>
          ) : (
            favorites.map((favorite) => (
              <div
                key={favorite._id}
                className="rounded-2xl border border-zinc-800 bg-[#0e0e10] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-semibold truncate">{favorite.name}</h3>
                  <p className="mt-1 text-zinc-400 text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-zinc-500" />
                    {Number(favorite.lat).toFixed(5)}, {Number(favorite.lng).toFixed(5)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDirections(favorite)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-zinc-700 text-zinc-200 hover:text-white hover:border-emerald-500/40 transition"
                  >
                    <Navigation className="w-4 h-4" />
                    Directions
                  </button>
                  <button
                    onClick={() => handleRemove(favorite)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-red-500/40 text-red-300 hover:bg-red-500/10 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
