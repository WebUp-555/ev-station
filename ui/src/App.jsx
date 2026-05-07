
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import HomeMapPage from "@/pages/HomeMapPage";
import SearchPage from "@/pages/SearchPage";
import StationDetailsPage from "@/pages/StationDetailsPage";
import AuthPage from "@/pages/AuthPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeMapPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/station/:id" element={<StationDetailsPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster theme="dark" position="top-right" />
    </div>
  );
}

export default App;