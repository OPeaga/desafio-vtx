import { useEffect, useState } from 'react'
import { adsApi } from '../services/api'
import type { Ad } from '../types'

export function useAdById(id: string) {
  const [ad, setAd] = useState<Ad | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const controller = new AbortController()

    setLoading(true)
    setError(null)

    adsApi
      .getById(id, controller.signal)
      .then(setAd)
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Anúncio não encontrado.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [id])

  return { ad, loading, error }
}
