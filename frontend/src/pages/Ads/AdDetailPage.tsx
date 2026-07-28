import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Spinner } from '../../components/ui/Spinner'
import { useAdById } from '../../hooks/useAds'
import { useAuth } from '../../hooks/useAuth'
import { adsApi } from '../../services/api'

export function AdDetailPage() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const { ad, loading, error } = useAdById(id)

  const [copied, setCopied] = useState(false)
  const [interestSent, setInterestSent] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const isOwner = user && ad?.user && user.id === ad.user.id

  const formatPrice = (price: number | null, type: string) => {
    if (type === 'doacao' || price === null) {
      return <span className="text-2xl font-bold text-doacao">GRÁTIS (Doação)</span>
    }
    return (
      <span className="text-3xl font-extrabold text-brand">
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)}
      </span>
    )
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleDelete = async () => {
    if (!ad) return
    if (!confirm('Tem certeza que deseja excluir este anúncio? Esta ação é irreversível.')) return
    setDeleting(true)
    try {
      await adsApi.remove(ad.id)
      navigate('/anuncios', { replace: true })
    } finally {
      setDeleting(false)
    }
  }

  // ── Estados de carregamento e erro ──────────────────────────────────────────

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-text-muted">
          <Spinner size="lg" />
          <p className="text-sm">Carregando anúncio…</p>
        </div>
      </div>
    )
  }

  if (error || !ad) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 text-center">
        <svg
          className="mx-auto h-16 w-16 text-text-muted opacity-40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h1 className="mt-4 font-display text-2xl font-bold text-text">Anúncio não encontrado</h1>
        <p className="mt-2 text-sm text-text-muted">
          {error ?? 'Este anúncio pode ter sido removido ou o link está incorreto.'}
        </p>
        <Button variant="secondary" className="mt-6" onClick={() => navigate('/anuncios')}>
          ← Voltar para anúncios
        </Button>
      </div>
    )
  }

  // ── Página de detalhe ────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb / Voltar */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors cursor-pointer"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Voltar
      </button>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Imagem */}
            <div className="flex flex-col gap-3">
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-surface-raised border border-border">
                {ad.imageUrl ? (
                  <img src={ad.imageUrl} alt={ad.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-primary-light/40 text-brand p-6 text-center">
                    <svg className="h-16 w-16 opacity-40 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-xs text-text-muted">Sem imagem enviada pelo anunciante</span>
                  </div>
                )}
              </div>
            </div>

            {/* Conteúdo */}
            <div className="flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={ad.type === 'venda' ? 'venda' : 'doacao'}>
                    {ad.type === 'venda' ? 'Venda' : 'Doação'}
                  </Badge>
                  <Badge variant="category">{ad.category.name}</Badge>
                </div>

                <h1 className="font-display text-2xl font-bold text-text">{ad.title}</h1>

                <div className="mt-4">{formatPrice(ad.price, ad.type)}</div>

                <div className="mt-6 border-t border-border pt-4">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Descrição do Item
                  </h2>
                  <p className="mt-2 text-sm text-text whitespace-pre-line leading-relaxed">{ad.description}</p>
                </div>

                {/* Card do anunciante */}
                <Card padding="sm" className="mt-6 bg-surface-raised/60">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                      {ad.user?.name ? ad.user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text">{ad.user?.name || 'Estudante UNIFOR'}</p>
                      <p className="text-xs text-text-muted">Anunciante verificado</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Ações */}
              <div className="space-y-3 border-t border-border pt-4">
                {interestSent ? (
                  <div className="rounded-lg bg-success-bg p-4 text-center text-sm font-medium text-success border border-success/30">
                    ✓ Solicitação enviada! Em um sistema real, o anunciante receberia uma notificação.
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    fullWidth
                    size="md"
                    className="py-3 text-base shadow-sm cursor-pointer"
                    onClick={() => setInterestSent(true)}
                  >
                    Tenho Interesse / Entrar em Contato
                  </Button>
                )}

                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" className="flex-1 cursor-pointer" onClick={handleCopyLink}>
                    {copied ? '✓ Link Copiado!' : 'Compartilhar'}
                  </Button>

                  {isOwner && (
                    <Button
                      variant="danger"
                      size="sm"
                      className="cursor-pointer"
                      disabled={deleting}
                      onClick={handleDelete}
                    >
                      {deleting ? <Spinner size="sm" /> : 'Excluir Anúncio'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
