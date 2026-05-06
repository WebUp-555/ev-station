import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { AppProvider } from './context/AppContext.jsx'
import { GoogleMapsProvider } from './context/GoogleMapsContext.jsx'
import Layout from './components/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import DetailsPage from './pages/DetailsPage.jsx'
import AccountPage from './pages/AccountPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <GoogleMapsProvider>
        <AuthProvider>
          <AppProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/details" element={<DetailsPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </Layout>
          </AppProvider>
        </AuthProvider>
      </GoogleMapsProvider>
    </BrowserRouter>
  )
}

export default App
