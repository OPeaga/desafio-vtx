import { useState } from 'react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import type { Ad } from '../../types'

interface AdDetailPageProps {
  ad: Ad | null
  onClose?: () => void
  onDelete?: (id: string) => void
  currentUserId?: string
}

export function AdDetailPage({ ad, onClose, onDelete, currentUserId }: AdDetailPageProps) {
  const [copied, setCopied] = useState(false)
  const [interestSent, setInterestSent] = useState(false)

  if (!ad) return null

  const isOwner = currentUserId && ad.user && currentUserId === ad.user.id

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

  const handleDemonstrateInterest = () => {
    setInterestSent(true)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm cursor-pointer"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose?.()
        }
      }}
    >
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl animate-in fade-in zoom-in duration-200 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-surface-raised/80 text-text-muted hover:bg-surface-raised hover:text-text backdrop-blur-md transition-colors cursor-pointer"
          aria-label="Fechar modal"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="max-h-[90vh] overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Image Section */}
            <div className="flex flex-col gap-3">
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-surface-raised border border-border">
                {ad.imageUrl ? (
                  <img src={ad.imageUrl} alt={ad.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-primary-light/40 text-brand p-6 text-center">
                    <svg className="h-16 w-16 opacity-40 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs text-text-muted">Sem imagem enviada pelo anunciante</span>
                  </div>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={ad.type === 'venda' ? 'venda' : 'doacao'}>
                    {ad.type === 'venda' ? 'Venda' : 'Doação'}
                  </Badge>
                  <Badge variant="category">{ad.category.name}</Badge>
                </div>

                <h2 className="font-display text-2xl font-bold text-text">{ad.title}</h2>

                <div className="mt-4">{formatPrice(ad.price, ad.type)}</div>

                <div className="mt-6 border-t border-border pt-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Descrição do Item</h3>
                  <p className="mt-2 text-sm text-text whitespace-pre-line leading-relaxed">{ad.description}</p>
                </div>

                {/* Advertiser Card */}
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

              {/* Actions */}
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
                    onClick={handleDemonstrateInterest}
                  >
                    Tenho Interesse / Entrar em Contato
                  </Button>
                )}

                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" className="flex-1 cursor-pointer" onClick={handleCopyLink}>
                    {copied ? 'Link Copiado!' : 'Compartilhar'}
                  </Button>

                  {isOwner && (
                    <Button
                      variant="danger"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => {
                        if (confirm('Tem certeza que deseja excluir este anúncio?')) {
                          onDelete?.(ad.id)
                          onClose?.()
                        }
                      }}
                    >
                      Excluir Anúncio
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
