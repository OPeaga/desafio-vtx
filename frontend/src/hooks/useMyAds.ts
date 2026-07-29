import { useCallback, useEffect, useState } from 'react'
import { adsApi } from '../services/api'
import type { Ad } from '../types'

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
