import { useEffect, useState } from 'react'
import { statsApi } from '../services/api'
import type { Stats } from '../types'

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
