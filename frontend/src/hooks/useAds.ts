import { useCallback, useEffect, useState } from 'react'
import { adsApi, categoriesApi, statsApi } from '../services/api'
import type { Ad, AdFilters, Category, PaginationMeta, Stats } from '../types'

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

export function useMyAds(refreshKey: number = 0) {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    setLoading(true)
    setError(null)

    adsApi
      .listMine(controller.signal)
      .then(setAds)
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Erro ao carregar seus anúncios.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [refreshKey])

  const removeAd = useCallback(async (id: string) => {
    await adsApi.remove(id)
    setAds((prev) => prev.filter((ad) => ad.id !== id))
  }, [])

  return { ads, loading, error, removeAd }
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    categoriesApi
      .list(controller.signal)
      .then(setCategories)
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Erro ao carregar categorias.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [])

  return { categories, loading, error }
}

export function useStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    statsApi
      .get(controller.signal)
      .then(setStats)
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [])

  return { stats, loading, error }
}
