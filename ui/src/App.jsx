
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { StationProvider } from "@/context/StationContext";
import HomeMapPage from "@/pages/HomeMapPage";
import SearchPage from "@/pages/SearchPage";
import StationDetailsPage from "@/pages/StationDetailsPage";
import AuthPage from "@/pages/AuthPage";
import FavoritesPage from "@/pages/FavoritesPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <StationProvider>
            <Routes>
              <Route path="/" element={<HomeMapPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/station/:id" element={<StationDetailsPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </StationProvider>
        </AuthProvider>
      </BrowserRouter>
      <Toaster theme="dark" position="top-right" />
    </div>
  );
}

export default App;