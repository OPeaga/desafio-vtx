import { useEffect, useState } from 'react'
import { adsApi } from '../services/api'
import type { Ad, AdFilters, PaginationMeta } from '../types'

export function useAds(filters: AdFilters, refreshKey: number = 0) {
  const [ads, setAds] = useState<Ad[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const filtersKey = JSON.stringify(filters)

  useEffect(() => {
    const controller = new AbortController()

    setLoading(true)
    setError(null)

    adsApi
      .list(filters, controller.signal)
      .then((result) => {
        setAds(result.items)
        setMeta(result.meta)
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Erro ao carregar anúncios.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey, refreshKey])

  return { ads, meta, loading, error }
}
