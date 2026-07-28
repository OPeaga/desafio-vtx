import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Spinner } from '../../components/ui/Spinner'
import type { LoginInput } from '../../types'

interface LoginPageProps {
  onSubmit?: (data: LoginInput) => Promise<void>
  onNavigate?: (path: string) => void
}

export function LoginPage({ onSubmit, onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password) {
      setError('Preencha seu e-mail e senha.')
      return
    }

    setLoading(true)
    try {
      if (onSubmit) {
        await onSubmit({ email: email.trim(), password })
      } else {
        alert('Login realizado com sucesso! (Modo Simulação)')
        onNavigate?.('/')
      }
    } catch (err: any) {
      setError(err.message || 'E-mail ou senha inválidos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <div className="text-center mb-8">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white shadow-md">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        </div>
        <h1 className="font-display text-2xl font-bold text-text">Entrar no Desapega UNIFOR</h1>
        <p className="mt-1 text-sm text-text-muted">Acesse com sua conta para gerenciar anúncios e publicar itens</p>
      </div>

      <Card padding="lg">
        {error && (
          <div className="mb-4 rounded-lg border border-danger/30 bg-danger-bg p-3 text-sm font-medium text-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="E-mail *"
            type="email"
            placeholder="seuemail@unifor.br"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Senha *"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" fullWidth disabled={loading} className="py-2.5">
            {loading ? <Spinner size="sm" /> : 'Entrar na Conta'}
          </Button>
        </form>

        <div className="mt-6 border-t border-border pt-4 text-center text-xs text-text-muted">
          Ainda não tem conta?{' '}
          <button
            type="button"
            onClick={() => onNavigate?.('/cadastrar')}
            className="font-semibold text-primary hover:underline"
          >
            Cadastre-se grátis
          </button>
        </div>
      </Card>
    </div>
  )
}
