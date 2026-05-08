
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Zap, Map as MapIcon, Search, User, Heart, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const Navbar = ({ floating = false }) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const linkBase =
    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors";
  const linkActive = "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30";
  const linkIdle = "text-zinc-400 hover:text-white border border-transparent";

  const wrapperCls = floating
    ? "absolute top-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-5xl"
    : "sticky top-0 z-40 w-full";

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <div className={wrapperCls}>
      <nav
        data-testid="main-navbar"
        className={`flex items-center justify-between gap-3 px-3 sm:px-4 py-2.5 rounded-2xl border border-zinc-800/80
          bg-black/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]`}
      >
        <Link
          to="/"
          data-testid="nav-logo"
          className="flex items-center gap-2 pr-2"
        >
          <span className="relative w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 grid place-items-center">
            <Zap className="w-4 h-4 text-emerald-400" strokeWidth={2.6} />
          </span>
          <span className="font-display text-base font-bold tracking-tight text-white hidden sm:block">
            Voltly<span className="text-emerald-400">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <NavLink
            to="/"
            end
            data-testid="nav-home"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            <MapIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Map</span>
          </NavLink>
          <NavLink
            to="/search"
            data-testid="nav-search"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </NavLink>
          {isAuthenticated && (
            <NavLink
              to="/favorites"
              data-testid="nav-favorites"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkIdle}`
              }
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Favorites</span>
            </NavLink>
          )}
        </div>

        {isAuthenticated ? (
          <button
            data-testid="nav-logout-btn"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-sm font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        ) : (
          <button
            data-testid="nav-auth-btn"
            onClick={() => navigate("/auth")}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-semibold transition-colors"
          >
            <User className="w-4 h-4" />
            <span>Sign in</span>
          </button>
        )}
      </nav>
    </div>
  );
};

export default Navbar;