import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import type { Ad, CategoryStat, Stats } from "../../types";

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  livros: "Livros didáticos, apostilas e literatura acadêmica recomendada.",
  engenharia: "Calculadoras científicas, réguas T, pranchetas e EPIs.",
  computacao:
    "Componentes, placas Arduino, periféricos e acessórios de hardware.",
  quimica: "Jalecos de algodão, óculos de proteção e kits de laboratório.",
  moveis: "Cadeiras ergonômicas, escrivaninhas e luminárias de estudo.",
  outros: "Materiais diversos de apoio aos cursos da universidade.",
};

interface LandingPageProps {
  stats?: Stats | null;
  ads?: Ad[];
  onNavigate?: (path: string) => void;
}


export function LandingPage({
  stats,
  ads = [],
  onNavigate,
}: LandingPageProps) {
  const displayAds = ads.slice(0, 3);

  const formatPrice = (price: number | null, type: string) => {
    if (type === "doacao" || price === null) {
      return (
        <span className="font-bold text-doacao text-sm">GRÁTIS (Doação)</span>
      );
    }
    return (
      <span className="font-bold text-brand text-sm sm:text-base">
        {new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(price)}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-10 pb-16">
      {/* Compacted Hero Section (~15% smaller vertical padding & font sizes) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand via-[#2d406a] to-brand py-12 text-white shadow-md sm:py-16">
        {/* Background Decorative Graphic */}
        <div className="absolute -right-12 -top-12 h-80 w-80 rounded-full bg-primary-light/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 h-80 w-80 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold text-primary-light backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary-light animate-pulse" />
              Economia Circular & Desapego UNIFOR
            </div> */}

            <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Desapegue do que não usa, <br />
              <span className="text-primary-light">
                ajude quem está chegando.
              </span>
            </h1>

            <p className="mt-4 text-base leading-relaxed text-slate-200 sm:text-lg">
              A plataforma oficial do campus para compra, venda e doação de
              livros, materiais de laboratório, componentes eletrônicos e móveis
              entre alunos.
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3.5 sm:flex-row">
              <Button
                variant="primary"
                size="md"
                className="bg-primary text-white hover:bg-primary-hover shadow-md px-6 py-2.5 text-sm sm:text-base cursor-pointer"
                onClick={() => onNavigate?.("/anuncios")}
              >
                Explorar Anúncios
              </Button>
              <Button
                variant="secondary"
                size="md"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm px-6 py-2.5 text-sm sm:text-base cursor-pointer"
                onClick={() => onNavigate?.("/anuncios/novo")}
              >
                + Publicar Desapego
              </Button>
            </div>
          </div>

          {/* Stats Bar - Compacted */}
          <div className="mt-10 grid grid-cols-2 gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md sm:grid-cols-4 sm:p-5">
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-white sm:text-3xl">
                {stats?.totalAds ?? 0}
              </p>
              <p className="text-xs font-medium text-slate-300">
                Anúncios Ativos
              </p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-emerald-300 sm:text-3xl">
                {stats?.totalDoacoes ?? 0}
              </p>
              <p className="text-xs font-medium text-slate-300">Itens Doados</p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-primary-light sm:text-3xl">
                {stats?.totalVendas ?? 0}
              </p>
              <p className="text-xs font-medium text-slate-300">
                Vendas no Campus
              </p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-white sm:text-3xl">
                {stats?.totalUsers ?? 0}
              </p>
              <p className="text-xs font-medium text-slate-300">
                Estudantes Conectados
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expanded Horizontal Categories Section (Non-clickable, laterally expanded) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 border-b border-border pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand">
            Categorias em Destaque
          </span>
          <h2 className="font-display text-2xl font-extrabold text-text sm:text-3xl">
            Categorias da Plataforma
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Materiais acadêmicos divididos por áreas do conhecimento no campus
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(stats?.adsByCategory ?? []).map((cat: CategoryStat) => (
            <Card
              key={cat.slug}
              padding="md"
              className="flex flex-row items-center gap-4 p-5 border border-border/80 bg-surface-raised rounded-2xl shadow-xs cursor-default"
            >
              {/* Category Icon */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand shadow-xs">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>

              {/* Lateral Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-base font-bold text-text truncate">
                    {cat.name}
                  </h3>
                  <span className="shrink-0 rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-semibold text-primary">
                    {cat.total} anúncios
                  </span>
                </div>
                <p className="mt-1 text-xs text-text-muted line-clamp-2 leading-relaxed">
                  {CATEGORY_DESCRIPTIONS[cat.slug] ||
                    "Materiais didáticos e acadêmicos diversos."}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Ads Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-text sm:text-3xl">
              Destaques Recentes
            </h2>
            <p className="text-sm text-text-muted">
              Últimos itens anunciados pela comunidade
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigate?.("/anuncios")}
          >
            Ver todos
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayAds.map((ad) => (
            <Card
              key={ad.id}
              padding="sm"
              className="group flex flex-col justify-between overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer"
              onClick={() => onNavigate?.(`/anuncios/${ad.id}`)}
            >
              {/* Image Preview */}
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-surface">
                {ad.imageUrl ? (
                  <img
                    src={ad.imageUrl}
                    alt={ad.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-brand/10 text-brand">
                    <svg
                      className="h-8 w-8 opacity-60"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <Badge variant={ad.type === "venda" ? "venda" : "doacao"}>
                    {ad.type === "venda" ? "Venda" : "Doação"}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant="category">{ad.category.name}</Badge>
                </div>
              </div>

              {/* Body */}
              <div className="mt-3 flex flex-1 flex-col justify-between p-2">
                <div>
                  <h3 className="font-display text-sm font-semibold text-text group-hover:text-brand line-clamp-2 min-h-[2.5rem] leading-snug break-words">
                    {ad.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-text-muted line-clamp-2 leading-relaxed">
                    {ad.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <div>{formatPrice(ad.price, ad.type)}</div>
                  {ad.user && (
                    <span className="text-xs text-text-muted">
                      Por {ad.user.name}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
