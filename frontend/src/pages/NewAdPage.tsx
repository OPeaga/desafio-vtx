import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Spinner } from '../components/ui/Spinner'
import type { AdType, Category, CreateAdInput } from '../types'

interface NewAdPageProps {
  categories?: Category[]
  onSubmit?: (input: CreateAdInput) => Promise<void>
  onNavigate?: (path: string) => void
}

const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Livros', slug: 'livros' },
  { id: 2, name: 'Engenharia', slug: 'engenharia' },
  { id: 3, name: 'Computação', slug: 'computacao' },
  { id: 4, name: 'Química', slug: 'quimica' },
  { id: 5, name: 'Móveis', slug: 'moveis' },
  { id: 6, name: 'Outros', slug: 'outros' },
]

export function NewAdPage({
  categories = MOCK_CATEGORIES,
  onSubmit,
  onNavigate,
}: NewAdPageProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<AdType>('venda')
  const [price, setPrice] = useState('')
  const [categoryId, setCategoryId] = useState<string>(
    categories.length > 0 ? String(categories[0].id) : ''
  )
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim() || title.length < 3) {
      setError('O título deve ter pelo menos 3 caracteres.')
      return
    }

    if (!description.trim() || description.length < 10) {
      setError('A descrição deve ter pelo menos 10 caracteres.')
      return
    }

    if (!categoryId) {
      setError('Selecione uma categoria para o item.')
      return
    }

    let parsedPrice: number | null = null
    if (type === 'venda') {
      parsedPrice = parseFloat(price)
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        setError('Para anúncios de venda, o preço deve ser maior que R$ 0,00.')
        return
      }
    }

    const payload: CreateAdInput = {
      title: title.trim(),
      description: description.trim(),
      type,
      price: type === 'venda' ? parsedPrice : null,
      categoryId: Number(categoryId),
      imageUrl: imageUrl.trim() || null,
    }

    setLoading(true)
    try {
      if (onSubmit) {
        await onSubmit(payload)
      } else {
        alert('Anúncio publicado com sucesso! (Modo Simulação)')
        onNavigate?.('/anuncios')
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao criar anúncio.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-extrabold text-text">Publicar Anúncio</h1>
        <p className="mt-1 text-sm text-text-muted">
          Preencha os dados do item que você deseja vender ou doar para outros estudantes
        </p>
      </div>

      <Card padding="lg">
        {error && (
          <div className="mb-6 rounded-lg border border-danger/30 bg-danger-bg p-4 text-sm text-danger font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <Input
            label="Título do Anúncio *"
            placeholder="Ex: Livro Cálculo Stewart 8ª Ed, Jaleco M, Arduino Uno..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text">Descrição Completa *</label>
            <textarea
              rows={4}
              placeholder="Descreva o estado de conservação, detalhes, disciplina relacionada ou local de entrega no campus..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-md border border-border bg-surface px-3 py-2 text-base text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring"
              required
            />
          </div>

          {/* Type selector */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text">Modalidade *</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setType('venda')
                }}
                className={`flex flex-col items-center justify-center rounded-xl border p-4 transition-all ${
                  type === 'venda'
                    ? 'border-brand bg-primary-light text-brand ring-2 ring-brand/20 font-bold'
                    : 'border-border bg-surface text-text hover:bg-surface-raised'
                }`}
              >
                <span className="text-base">🏷️ Venda</span>
                <span className="mt-1 text-xs opacity-75">Quero vender por um valor</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setType('doacao')
                  setPrice('')
                }}
                className={`flex flex-col items-center justify-center rounded-xl border p-4 transition-all ${
                  type === 'doacao'
                    ? 'border-doacao bg-doacao-bg text-doacao ring-2 ring-doacao/20 font-bold'
                    : 'border-border bg-surface text-text hover:bg-surface-raised'
                }`}
              >
                <span className="text-base">🎁 Doação</span>
                <span className="mt-1 text-xs opacity-75">Item gratuito para desapego</span>
              </button>
            </div>
          </div>

          {/* Price (Conditional) */}
          {type === 'venda' && (
            <Input
              label="Preço de Venda (R$) *"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0,00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              hint="Digite o valor exato em Reais."
              required
            />
          )}

          {/* Category */}
          <Select
            label="Categoria *"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            options={categories.map((c) => ({ label: c.name, value: String(c.id) }))}
          />

          {/* Image URL */}
          <Input
            label="URL da Imagem (Opcional)"
            placeholder="https://exemplo.com/imagem.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            hint="Cole o link direto de uma imagem para ilustrar seu anúncio."
          />

          {/* Image Preview */}
          {imageUrl && (
            <div className="mt-2">
              <label className="text-xs font-medium text-text-muted mb-1 block">Preview da Imagem</label>
              <div className="aspect-video w-full max-w-xs overflow-hidden rounded-lg border border-border bg-surface">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  onError={() => setError('A URL da imagem parece ser inválida.')}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => onNavigate?.('/anuncios')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : 'Publicar Anúncio'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
