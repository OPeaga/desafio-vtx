import { useState } from 'react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Spinner } from '../../components/ui/Spinner'
import type { Ad } from '../../types'

interface MyAdsPageProps {
  ads?: Ad[]
  loading?: boolean
  onDeleteAd?: (id: string) => Promise<void> | void
  onNavigate?: (path: string) => void
  onSelectAd?: (ad: Ad) => void
}

const MOCK_MY_ADS: Ad[] = [
  {
    id: 'm1',
    title: 'Calculadora Científica Casio fx-82MS',
    description: 'Funcionando perfeitamente com tampa de proteção original. Ideal para engenharias.',
    type: 'doacao',
    price: null,
    imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date().toISOString(),
    category: { id: 2, name: 'Engenharia', slug: 'engenharia' },
    user: { id: 'u2', name: 'Você' },
  },
]

export function MyAdsPage({
  ads = MOCK_MY_ADS,
  loading = false,
  onDeleteAd,
  onNavigate,
  onSelectAd,
}: MyAdsPageProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Tem certeza que deseja excluir o anúncio "${title}"? Esta ação é irreversível.`)) {
      setDeletingId(id)
      try {
        await onDeleteAd?.(id)
      } finally {
        setDeletingId(null)
      }
    }
  }

  const formatPrice = (price: number | null, type: string) => {
    if (type === 'doacao' || price === null) {
      return <span className="font-bold text-doacao text-sm">GRÁTIS (Doação)</span>
    }
    return (
      <span className="font-bold text-brand text-sm sm:text-base">
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)}
      </span>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-text">Meus Anúncios</h1>
          <p className="mt-1 text-sm text-text-muted">
            Gerencie os itens que você colocou para venda ou doação na plataforma
          </p>
        </div>
        <Button variant="primary" onClick={() => onNavigate?.('/anuncios/novo')}>
          + Criar Novo Anúncio
        </Button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : ads.length === 0 ? (
        <Card padding="lg" className="py-12 text-center">
          <svg className="mx-auto h-12 w-12 text-text-muted opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="mt-4 font-display text-lg font-bold text-text">Você ainda não tem anúncios</h3>
          <p className="mt-1 text-sm text-text-muted">
            Desapegue daquele livro ou calculadora que você não usa mais!
          </p>
          <Button variant="primary" className="mt-6" onClick={() => onNavigate?.('/anuncios/novo')}>
            Publicar meu primeiro anúncio
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ads.map((ad) => (
            <Card
              key={ad.id}
              padding="sm"
              className="flex flex-col justify-between overflow-hidden transition-all hover:shadow-md"
            >
              <div
                className="cursor-pointer"
                onClick={() => onSelectAd?.(ad)}
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-surface">
                  {ad.imageUrl ? (
                    <img src={ad.imageUrl} alt={ad.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-brand/10 text-brand">
                      <svg className="h-8 w-8 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge variant={ad.type === 'venda' ? 'venda' : 'doacao'}>
                      {ad.type === 'venda' ? 'Venda' : 'Doação'}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant="category">{ad.category.name}</Badge>
                  </div>
                </div>

                <div className="mt-3 p-2">
                  <h3 className="font-display text-sm font-semibold text-text line-clamp-2 min-h-[2.5rem] leading-snug break-words">
                    {ad.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-text-muted line-clamp-2 leading-relaxed">{ad.description}</p>
                  <div className="mt-3">{formatPrice(ad.price, ad.type)}</div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <span className="text-[11px] text-text-muted">
                  Publicado em {new Date(ad.createdAt).toLocaleDateString('pt-BR')}
                </span>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={deletingId === ad.id}
                  onClick={() => handleDelete(ad.id, ad.title)}
                >
                  {deletingId === ad.id ? <Spinner size="sm" /> : 'Excluir'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
