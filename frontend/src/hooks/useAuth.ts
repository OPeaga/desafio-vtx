import { useSyncExternalStore } from 'react'
import { authApi, clearSession, getSession, subscribeSession } from '../services/api'

export function useAuth() {
  const session = useSyncExternalStore(subscribeSession, getSession)

  return {
    user: session?.user ?? null,
    isAuthenticated: session !== null,
    login: authApi.login,
    register: authApi.register,
    logout: clearSession,
  }
}
