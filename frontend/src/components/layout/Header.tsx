import { useState } from 'react'
import { Button } from '../ui/Button'

export interface HeaderProps {
  user?: { name: string } | null
  onLogout?: () => void
  currentPath?: string
  onNavigate?: (path: string) => void
}

export function Header({ user, onLogout, currentPath = '/', onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (onNavigate) {
      e.preventDefault()
      onNavigate(path)
      setMobileMenuOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Logo & Brand - Softened elegant icon */}
        <a
          href="/"
          onClick={(e) => handleLinkClick(e, '/')}
          className="flex items-center gap-2.5 font-display text-xl font-extrabold tracking-tight text-brand transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/15 text-brand border border-brand/20 shadow-xs">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <span>
            Vortex <span className="text-primary font-normal">Desapego</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 text-sm font-semibold text-text sm:flex">
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, '/')}
            className={`rounded-lg px-3 py-1.5 transition-colors ${
              currentPath === '/' ? 'bg-primary-light text-primary' : 'hover:bg-surface-raised hover:text-brand'
            }`}
          >
            Início
          </a>
          <a
            href="/anuncios"
            onClick={(e) => handleLinkClick(e, '/anuncios')}
            className={`rounded-lg px-3 py-1.5 transition-colors ${
              currentPath === '/anuncios' ? 'bg-primary-light text-primary' : 'hover:bg-surface-raised hover:text-brand'
            }`}
          >
            Explorar Anúncios
          </a>
          {user && (
            <a
              href="/anuncios/novo"
              onClick={(e) => handleLinkClick(e, '/anuncios/novo')}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                currentPath === '/anuncios/novo' ? 'bg-primary-light text-primary' : 'hover:bg-surface-raised hover:text-brand'
              }`}
            >
              + Anunciar Item
            </a>
          )}
        </nav>

        {/* Auth / Profile & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href="/meus-anuncios"
                onClick={(e) => handleLinkClick(e, '/meus-anuncios')}
                className="flex items-center gap-2 rounded-full border border-border bg-surface-raised px-3 py-1.5 text-xs font-semibold text-text transition-all hover:border-border-accent hover:shadow-xs"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-[10px] text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate sm:max-w-none">{user.name}</span>
              </a>
              <Button variant="ghost" size="sm" onClick={onLogout} title="Sair da Conta">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button
                href="/entrar"
                variant="ghost"
                size="sm"
                onClick={(e) => handleLinkClick(e as any, '/entrar')}
              >
                Entrar
              </Button>
              <Button
                href="/cadastrar"
                variant="primary"
                size="sm"
                onClick={(e) => handleLinkClick(e as any, '/cadastrar')}
              >
                Criar Conta
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-text-muted hover:bg-surface-raised hover:text-text sm:hidden"
            aria-label="Abrir menu principal"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-surface px-4 py-4 sm:hidden">
          <nav className="flex flex-col gap-2 font-medium text-text">
            <a
              href="/"
              onClick={(e) => handleLinkClick(e, '/')}
              className="rounded-lg px-3 py-2 text-base hover:bg-surface-raised"
            >
              Início
            </a>
            <a
              href="/anuncios"
              onClick={(e) => handleLinkClick(e, '/anuncios')}
              className="rounded-lg px-3 py-2 text-base hover:bg-surface-raised"
            >
              Explorar Anúncios
            </a>
            {user ? (
              <>
                <a
                  href="/anuncios/novo"
                  onClick={(e) => handleLinkClick(e, '/anuncios/novo')}
                  className="rounded-lg px-3 py-2 text-base text-primary font-semibold hover:bg-primary-light"
                >
                  + Publicar Anúncio
                </a>
                <a
                  href="/meus-anuncios"
                  onClick={(e) => handleLinkClick(e, '/meus-anuncios')}
                  className="rounded-lg px-3 py-2 text-base hover:bg-surface-raised"
                >
                  Meus Anúncios ({user.name})
                </a>
              </>
            ) : (
              <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
                <Button
                  href="/entrar"
                  variant="secondary"
                  fullWidth
                  onClick={(e) => handleLinkClick(e as any, '/entrar')}
                >
                  Entrar na conta
                </Button>
                <Button
                  href="/cadastrar"
                  variant="primary"
                  fullWidth
                  onClick={(e) => handleLinkClick(e as any, '/cadastrar')}
                >
                  Criar conta grátis
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
