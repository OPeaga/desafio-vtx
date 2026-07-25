import axios, { AxiosError } from 'axios'
import type {
  Ad,
  AdFilters,
  ApiError as ApiErrorShape,
  AuthResponse,
  Category,
  CreateAdInput,
  LoginInput,
  PaginatedAds,
  RegisterInput,
  Stats,
  User,
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// --- Sessão (localStorage + store reativo) ---------------------------------
// Vive aqui (não no hook) porque é o próprio client HTTP quem precisa ler o
// token a cada chamada e limpar a sessão automaticamente num 401.

const TOKEN_KEY = 'vortex:token'
const USER_KEY = 'vortex:user'

export interface Session {
  user: User
  token: string
}

const listeners = new Set<() => void>()

function readStoredSession(): Session | null {
  const token = localStorage.getItem(TOKEN_KEY)
  const rawUser = localStorage.getItem(USER_KEY)
  if (!token || !rawUser) return null
  try {
    return { token, user: JSON.parse(rawUser) as User }
  } catch {
    return null
  }
}

let currentSession: Session | null = readStoredSession()

export function getSession(): Session | null {
  return currentSession
}

function notify() {
  for (const listener of listeners) listener()
}

export function setSession(session: Session) {
  currentSession = session
  localStorage.setItem(TOKEN_KEY, session.token)
  localStorage.setItem(USER_KEY, JSON.stringify(session.user))
  notify()
}

export function clearSession() {
  currentSession = null
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  notify()
}

export function subscribeSession(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// --- Cliente HTTP (axios) ---------------------------------------------------

const http = axios.create({ baseURL: API_BASE_URL })

http.interceptors.request.use((config) => {
  const session = getSession()
  if (session) {
    config.headers.Authorization = `Bearer ${session.token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorShape>) => {
    const status = error.response?.status ?? 0
    const message = error.response?.data?.error || 'Erro inesperado ao comunicar com o servidor.'
    const hadToken = Boolean(error.config?.headers?.Authorization)

    // 401 numa chamada que tinha token anexado = sessão expirada/inválida.
    // 401 de credencial errada em /login não tem token anexado, não passa aqui.
    if (status === 401 && hadToken) {
      clearSession()
    }

    throw new ApiError(message, status)
  },
)

// Prisma serializa colunas Decimal (price) como string no JSON — normaliza
// para number aqui, garantindo o contrato de `Ad.price: number | null` do
// frontend independentemente de como o backend serializa.
function normalizeAd(ad: Ad): Ad {
  return { ...ad, price: ad.price === null ? null : Number(ad.price) }
}

function cleanParams<T extends object>(params: T): Partial<T> {
  const cleaned: Partial<T> = {}
  for (const [key, value] of Object.entries(params) as [keyof T, unknown][]) {
    if (value === undefined || value === '') continue
    cleaned[key] = value as T[keyof T]
  }
  return cleaned
}

// --- Auth --------------------------------------------------------------------

export const authApi = {
  async register(input: RegisterInput): Promise<AuthResponse> {
    const { data } = await http.post<AuthResponse>('/api/auth/register', input)
    setSession(data)
    return data
  },

  async login(input: LoginInput): Promise<AuthResponse> {
    const { data } = await http.post<AuthResponse>('/api/auth/login', input)
    setSession(data)
    return data
  },
}

// --- Ads -----------------------------------------------------------------

export const adsApi = {
  async list(filters: AdFilters = {}, signal?: AbortSignal): Promise<PaginatedAds> {
    const { data } = await http.get<PaginatedAds>('/api/ads', {
      params: cleanParams(filters),
      signal,
    })
    return { ...data, items: data.items.map(normalizeAd) }
  },

  async getById(id: string, signal?: AbortSignal): Promise<Ad> {
    const { data } = await http.get<Ad>(`/api/ads/${id}`, { signal })
    return normalizeAd(data)
  },

  async listMine(signal?: AbortSignal): Promise<Ad[]> {
    const { data } = await http.get<Ad[]>('/api/ads/me', { signal })
    return data.map(normalizeAd)
  },

  async create(input: CreateAdInput): Promise<Ad> {
    const { data } = await http.post<Ad>('/api/ads', input)
    return normalizeAd(data)
  },

  async remove(id: string): Promise<void> {
    await http.delete(`/api/ads/${id}`)
  },
}

// --- Categories & Stats ----------------------------------------------------

export const categoriesApi = {
  async list(signal?: AbortSignal): Promise<Category[]> {
    const { data } = await http.get<Category[]>('/api/categories', { signal })
    return data
  },
}

export const statsApi = {
  async get(signal?: AbortSignal): Promise<Stats> {
    const { data } = await http.get<Stats>('/api/stats', { signal })
    return data
  },
}
