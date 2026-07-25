import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { AdDetailPage } from './pages/AdDetailPage'
import { AdsPage } from './pages/AdsPage'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { MyAdsPage } from './pages/MyAdsPage'
import { NewAdPage } from './pages/NewAdPage'
import { RegisterPage } from './pages/RegisterPage'
import type { Ad, CreateAdInput, User } from './types'

function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const [user, setUser] = useState<User | null>(null)
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null)

  const goTo = (path: string) => navigate(path)

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  // Register PWA Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('Service Worker registrado:', reg.scope))
        .catch((err) => console.error('Erro ao registrar Service Worker:', err))
    }
  }, [])

  const handleCreateAd = async (input: CreateAdInput) => {
    console.log('Novo anúncio (Simulação visual UI):', input)
    alert('Anúncio publicado com sucesso (Visual UI)!')
    goTo('/anuncios')
  }

  const handleDeleteAd = async (id: string) => {
    console.log('Deletar anúncio:', id)
    alert('Anúncio excluído com sucesso (Visual UI)!')
  }

  const handleLogin = async (data: { email: string }) => {
    setUser({ id: 'u-1', name: data.email.split('@')[0] || 'Estudante', email: data.email })
    goTo('/')
  }

  const handleRegister = async (data: { name: string; email: string }) => {
    setUser({ id: 'u-1', name: data.name, email: data.email })
    goTo('/')
  }

  const handleLogout = () => {
    setUser(null)
    goTo('/')
  }

  return (
    <div className="flex min-h-svh flex-col bg-bg text-text font-sans selection:bg-primary-light selection:text-primary">
      <Header
        user={user}
        onLogout={handleLogout}
        currentPath={location.pathname}
        onNavigate={goTo}
      />

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={<LandingPage onNavigate={goTo} onSelectAd={(ad) => setSelectedAd(ad)} />}
          />

          <Route
            path="/anuncios"
            element={<AdsPage onSelectAd={(ad) => setSelectedAd(ad)} onNavigate={goTo} />}
          />

          <Route
            path="/anuncios/novo"
            element={
              user ? (
                <NewAdPage onSubmit={handleCreateAd} onNavigate={goTo} />
              ) : (
                <LoginPage onSubmit={handleLogin} onNavigate={goTo} />
              )
            }
          />

          <Route
            path="/meus-anuncios"
            element={
              user ? (
                <MyAdsPage onDeleteAd={handleDeleteAd} onNavigate={goTo} onSelectAd={(ad) => setSelectedAd(ad)} />
              ) : (
                <LoginPage onSubmit={handleLogin} onNavigate={goTo} />
              )
            }
          />

          <Route path="/entrar" element={<LoginPage onSubmit={handleLogin} onNavigate={goTo} />} />

          <Route path="/cadastrar" element={<RegisterPage onSubmit={handleRegister} onNavigate={goTo} />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* Detail Modal */}
      {selectedAd && (
        <AdDetailPage
          ad={selectedAd}
          onClose={() => setSelectedAd(null)}
          onDelete={handleDeleteAd}
          currentUserId={user?.id}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}
