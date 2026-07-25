import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Spinner } from '../components/ui/Spinner'
import type { RegisterInput } from '../types'

interface RegisterPageProps {
  onSubmit?: (data: RegisterInput) => Promise<void>
  onNavigate?: (path: string) => void
}

export function RegisterPage({ onSubmit, onNavigate }: RegisterPageProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim() || name.length < 2) {
      setError('Informe seu nome completo.')
      return
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Informe um e-mail válido.')
      return
    }

    if (!password || password.length < 6) {
      setError('A senha deve conter no mínimo 6 caracteres.')
      return
    }

    setLoading(true)
    try {
      if (onSubmit) {
        await onSubmit({ name: name.trim(), email: email.trim(), password })
      } else {
        alert('Cadastro realizado com sucesso! (Modo Simulação)')
        onNavigate?.('/')
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar cadastro.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <div className="text-center mb-8">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white shadow-md">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h1 className="font-display text-2xl font-bold text-text">Criar Conta Universitária</h1>
        <p className="mt-1 text-sm text-text-muted">Faça parte da rede de economia circular da UNIFOR</p>
      </div>

      <Card padding="lg">
        {error && (
          <div className="mb-4 rounded-lg border border-danger/30 bg-danger-bg p-3 text-sm font-medium text-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome Completo *"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="E-mail *"
            type="email"
            placeholder="seuemail@unifor.br"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Senha (Mínimo 6 caracteres) *"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" fullWidth disabled={loading} className="py-2.5">
            {loading ? <Spinner size="sm" /> : 'Criar minha conta'}
          </Button>
        </form>

        <div className="mt-6 border-t border-border pt-4 text-center text-xs text-text-muted">
          Já possui conta?{' '}
          <button
            type="button"
            onClick={() => onNavigate?.('/entrar')}
            className="font-semibold text-primary hover:underline"
          >
            Fazer Login
          </button>
        </div>
      </Card>
    </div>
  )
}
