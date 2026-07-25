export function Footer() {
  return (
    <footer className="border-t border-border bg-surface text-text-muted transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-display text-base font-bold text-brand">
              <div className="flex h-6.5 w-6.5 items-center justify-center rounded-lg bg-brand text-white">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              Vortex Marketplace
            </div>
            <p className="mt-2.5 max-w-sm text-xs text-text-muted leading-relaxed">
              Plataforma de economia circular universitária. Conectando alunos para venda e doação de livros, materiais acadêmicos, calculadoras, jalecos e móveis dentro da UNIFOR.
            </p>
          </div>

          <div>
            <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-text">Navegação</h4>
            <ul className="mt-2.5 space-y-1.5 text-xs">
              <li><a href="/" className="hover:text-primary transition-colors">Início</a></li>
              <li><a href="/anuncios" className="hover:text-primary transition-colors">Ver Anúncios</a></li>
              <li><a href="/anuncios/novo" className="hover:text-primary transition-colors">Publicar Item</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-text">Sobre</h4>
            <p className="mt-2.5 text-[11px] leading-relaxed">
              Desenvolvido para o Processo Seletivo <strong>Laboratório Vortex 2026</strong> — UNIFOR.
            </p>
            <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-md bg-primary-light px-2 py-0.5 text-[11px] font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              PWA Ativo & Ready
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <p>© {new Date().getFullYear()} Vortex Marketplace. Todos os direitos reservados.</p>
          <p className="text-text-muted">Economia Circular no Campus</p>
        </div>
      </div>
    </footer>
  )
}
