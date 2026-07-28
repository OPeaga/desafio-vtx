import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { useAds, useCategories, useMyAds, useStats } from './hooks/useAds'
import { useAuth } from './hooks/useAuth'
import { AdDetailPage } from './pages/Ads/AdDetailPage'
import { AdsPage } from './pages/Ads/AdsPage'
import { LandingPage } from './pages/Landing/LandingPage'
import { LoginPage } from './pages/Login/LoginPage'
import { MyAdsPage } from './pages/MyAds/MyAdsPage'
import { NewAdPage } from './pages/NewAd/NewAdPage'
import { RegisterPage } from './pages/Register/RegisterPage'
import type { Ad, CreateAdInput, LoginInput, RegisterInput } from './types'

function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const { user, login, register, logout } = useAuth()
  const { categories } = useCategories()
  // Incrementado a cada criação de anúncio para forçar as listas
  // (useAds/useMyAds) a revalidar, mesmo quando a rota não remonta.
  const [adsVersion, setAdsVersion] = useState(0)

  const goTo = (path: string) => navigate(path)

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  // O registro do Service Worker é injetado automaticamente pelo
  // vite-plugin-pwa (registerType: 'autoUpdate') — sem código manual aqui.

  const handleCreateAd = async (input: CreateAdInput) => {
    await adsApi.create(input)
    setAdsVersion((v) => v + 1)
    goTo('/anuncios')
  }

  const handleLogin = async (data: LoginInput) => {
    await login(data)
    goTo('/meus-anuncios')
  }

  const handleRegister = async (data: RegisterInput) => {
    await register(data)
    goTo('/')
  }

  const handleLogout = () => {
    logout()
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
            element={<LandingRoute onNavigate={goTo} />}
          />

          <Route
            path="/anuncios"
            element={
              <AdsListRoute
                categories={categories}
                refreshKey={adsVersion}
                onNavigate={goTo}
              />
            }
          />

          <Route
            path="/anuncios/novo"
            element={
              user ? (
                <NewAdPage categories={categories} onSubmit={handleCreateAd} onNavigate={goTo} />
              ) : (
                <LoginPage onSubmit={handleLogin} onNavigate={goTo} />
              )
            }
          />

          <Route path="/anuncios/:id" element={<AdDetailPage />} />

          <Route
            path="/meus-anuncios"
            element={
              user ? (
                <MyAdsRoute
                  refreshKey={adsVersion}
                  onNavigate={goTo}
                />
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
    </div>
  )
}

interface LandingRouteProps {
  onNavigate: (path: string) => void
}

function LandingRoute({ onNavigate }: LandingRouteProps) {
  const { stats } = useStats()
  const { ads } = useAds({ limit: 3 })

  return <LandingPage stats={stats} ads={ads} onNavigate={onNavigate} />
}

interface AdsListRouteProps {
  categories: ReturnType<typeof useCategories>['categories']
  refreshKey: number
  onNavigate: (path: string) => void
}

function AdsListRoute({ categories, refreshKey, onNavigate }: AdsListRouteProps) {
  const [filters, setFilters] = useState<Parameters<typeof useAds>[0]>({})
  const { ads, meta, loading } = useAds(filters, refreshKey)

  return (
    <AdsPage
      ads={ads}
      meta={meta ?? undefined}
      categories={categories}
      loading={loading}
      initialFilters={filters}
      onFilterChange={(partial) => setFilters((prev) => ({ ...prev, ...partial }))}
      onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
      onNavigate={onNavigate}
    />
  )
}

interface MyAdsRouteProps {
  refreshKey: number
  onNavigate: (path: string) => void
}

function MyAdsRoute({ refreshKey, onNavigate }: MyAdsRouteProps) {
  const { ads, loading, removeAd } = useMyAds(refreshKey)

  return (
    <MyAdsPage
      ads={ads}
      loading={loading}
      onDeleteAd={removeAd}
      onNavigate={onNavigate}
    />
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}
