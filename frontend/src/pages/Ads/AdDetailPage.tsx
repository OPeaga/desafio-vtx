import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Spinner } from '../../components/ui/Spinner'
import { useAdById } from '../../hooks/useAdById'
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
      return <span className="text-3xl font-extrabold text-doacao">GRÁTIS (Doação)</span>
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
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-4 text-text-muted py-20">
          <Spinner size="lg" />
          <p className="text-sm">Carregando anúncio…</p>
        </div>
      </div>
    )
  }

  if (error || !ad) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center py-20">
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Voltar */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors cursor-pointer font-medium"
      >
        <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Voltar para a busca
      </button>

      {/* Grid Layout - 12 colunas */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Lado Esquerdo - Detalhes e Imagem (8 colunas) */}
        <div className="space-y-6 lg:col-span-8">
          {/* Container de Imagem Hero */}
          <div className="relative aspect-video sm:aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-xs">
            {ad.imageUrl ? (
              <img src={ad.imageUrl} alt={ad.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-primary-light/40 text-brand p-6 text-center">
                <svg className="h-20 w-20 opacity-40 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm font-medium text-text-muted">Sem imagem enviada pelo anunciante</span>
              </div>
            )}
          </div>

          {/* Descrição do Item */}
          <Card padding="lg">
            <h2 className="font-display text-lg font-bold text-text mb-4 border-b border-border pb-2">
              Descrição do Item
            </h2>
            <p className="text-base text-text whitespace-pre-line leading-relaxed">
              {ad.description}
            </p>
          </Card>

          {/* Dicas para uma troca segura */}
          <Card padding="lg" className="bg-surface/50 border border-border-accent/40">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-text mb-2">
                  Dicas para uma troca segura no campus
                </h3>
                <ul className="text-sm text-text-muted space-y-2 list-disc list-inside">
                  <li>Combine o encontro em locais públicos e movimentados dentro da UNIFOR (ex: biblioteca, centro de convivência, refeitório).</li>
                  <li>Inspecione o produto pessoalmente e confirme o estado antes de realizar qualquer pagamento ou entrega final.</li>
                  <li>Evite transações antecipadas. Prefira pagar via Pix ou dinheiro no momento da entrega do item.</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Lado Direito - Caixa de Compra / Informações Sticky (4 colunas) */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24">
          <Card padding="lg" className="border-border bg-surface shadow-xs space-y-6">
            {/* Categoria e Badges */}
            <div className="flex items-center gap-2">
              <Badge variant={ad.type === 'venda' ? 'venda' : 'doacao'}>
                {ad.type === 'venda' ? 'Venda' : 'Doação'}
              </Badge>
              <Badge variant="category">{ad.category.name}</Badge>
            </div>

            {/* Título e Preço */}
            <div>
              <h1 className="font-display text-2xl font-extrabold text-text leading-tight">{ad.title}</h1>
              <div className="mt-4 pt-4 border-t border-border">
                <span className="text-xs text-text-muted uppercase tracking-wider block mb-1">Preço sugerido</span>
                {formatPrice(ad.price, ad.type)}
              </div>
            </div>

            {/* Informações do Anunciante */}
            <div className="border-t border-border pt-4">
              <span className="text-xs text-text-muted uppercase tracking-wider block mb-3">Anunciado por</span>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-base font-bold text-white shadow-xs">
                  {ad.user?.name ? ad.user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="text-sm font-bold text-text">{ad.user?.name || 'Estudante UNIFOR'}</p>
                  <p className="text-xs text-text-muted flex items-center gap-1">
                    <svg className="h-3.5 w-3.5 text-success fill-success/20" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Estudante Verificado
                  </p>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="space-y-3 border-t border-border pt-4">
              {interestSent ? (
                <div className="rounded-lg bg-success-bg p-4 text-center text-sm font-medium text-success border border-success/30 animate-in fade-in duration-200">
                  ✓ Solicitação enviada! Em um sistema real, o anunciante receberia uma notificação.
                </div>
              ) : (
                <Button
                  variant="primary"
                  fullWidth
                  size="md"
                  className="py-3 text-base shadow-sm font-semibold cursor-pointer"
                  onClick={() => setInterestSent(true)}
                >
                  Tenho Interesse / Contatar
                </Button>
              )}

              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" className="flex-1 cursor-pointer" onClick={handleCopyLink}>
                  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.636-2.318M8.684 13.258l4.636 2.318M21 12a3 3 0 11-6 0 3 3 0 016 0zm-12-6a3 3 0 11-6 0 3 3 0 016 0zm0 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {copied ? 'Link Copiado!' : 'Compartilhar'}
                </Button>

                {isOwner && (
                  <Button
                    variant="danger"
                    size="sm"
                    className="cursor-pointer"
                    disabled={deleting}
                    onClick={handleDelete}
                  >
                    {deleting ? <Spinner size="sm" /> : 'Excluir'}
                  </Button>
                )}
              </div>
            </div>

            {/* Data de publicação */}
            <div className="text-center pt-2">
              <span className="text-[11px] text-text-muted">
                Publicado em {new Date(ad.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  )
}
