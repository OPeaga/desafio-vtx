import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Spinner } from "../components/ui/Spinner";
import type { Ad, AdFilters, AdType, Category, PaginationMeta } from "../types";

interface AdsPageProps {
  ads?: Ad[];
  meta?: PaginationMeta;
  categories?: Category[];
  loading?: boolean;
  initialFilters?: AdFilters;
  onFilterChange?: (filters: Partial<AdFilters>) => void;
  onPageChange?: (page: number) => void;
  onSelectAd?: (ad: Ad) => void;
  onNavigate?: (path: string) => void;
}

const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: "Livros", slug: "livros" },
  { id: 2, name: "Engenharia", slug: "engenharia" },
  { id: 3, name: "Computação", slug: "computacao" },
  { id: 4, name: "Química", slug: "quimica" },
  { id: 5, name: "Móveis", slug: "moveis" },
  { id: 6, name: "Outros", slug: "outros" },
];

const MOCK_ADS: Ad[] = [
  {
    id: "1",
    title: "Cálculo James Stewart Vol. 1 (8ª Edição)",
    description:
      "Livro em ótimo estado com poucos grifos a lápis. Essencial para disciplinas de Cálculo I e II.",
    type: "venda",
    price: 45.0,
    imageUrl:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    createdAt: new Date().toISOString(),
    category: { id: 1, name: "Livros", slug: "livros" },
    user: { id: "u1", name: "Lucas Silva" },
  },
  {
    id: "2",
    title: "Calculadora Científica Casio fx-82MS",
    description:
      "Funcionando perfeitamente com tampa de proteção original. Ideal para engenharias.",
    type: "doacao",
    price: null,
    imageUrl:
      "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80",
    createdAt: new Date().toISOString(),
    category: { id: 2, name: "Engenharia", slug: "engenharia" },
    user: { id: "u2", name: "Mariana Oliveira" },
  },
  {
    id: "3",
    title: "Jaleco Branco Algodão M (Manga Longa)",
    description:
      "Jaleco usado por 1 semestre em laboratório de Química. Sem manchas, higienizado.",
    type: "venda",
    price: 35.0,
    imageUrl:
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80",
    createdAt: new Date().toISOString(),
    category: { id: 4, name: "Química", slug: "quimica" },
    user: { id: "u3", name: "Beatriz Costa" },
  },
  {
    id: "4",
    title: "Kit Arduino Uno R3 + Jumpers + Protoboard",
    description:
      "Kit de eletrônica de bancada completo para disciplinas de Sistemas Embarcados.",
    type: "venda",
    price: 80.0,
    imageUrl:
      "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=600&q=80",
    createdAt: new Date().toISOString(),
    category: { id: 3, name: "Computação", slug: "computacao" },
    user: { id: "u4", name: "Matheus Pereira" },
  },
];

export function AdsPage({
  ads = MOCK_ADS,
  meta = { total: MOCK_ADS.length, page: 1, limit: 12, totalPages: 1 },
  categories = MOCK_CATEGORIES,
  loading = false,
  initialFilters = {},
  onFilterChange,
  onPageChange,
  onSelectAd,
  onNavigate,
}: AdsPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(initialFilters.search || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || initialFilters.category || "",
  );
  const [selectedType, setSelectedType] = useState<string>(
    initialFilters.type || "",
  );
  const [minPrice, setMinPrice] = useState<string>(
    initialFilters.min_price !== undefined
      ? String(initialFilters.min_price)
      : "",
  );
  const [maxPrice, setMaxPrice] = useState<string>(
    initialFilters.max_price !== undefined
      ? String(initialFilters.max_price)
      : "",
  );

  const handleApplyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Update URL query string
    const newParams = new URLSearchParams();
    if (selectedCategory) newParams.set("category", selectedCategory);
    setSearchParams(newParams);

    onFilterChange?.({
      search: search.trim() || undefined,
      category: selectedCategory || undefined,
      type: (selectedType as AdType) || undefined,
      min_price: minPrice ? Number(minPrice) : undefined,
      max_price: maxPrice ? Number(maxPrice) : undefined,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedType("");
    setMinPrice("");
    setMaxPrice("");
    setSearchParams({});

    onFilterChange?.({
      search: undefined,
      category: undefined,
      type: undefined,
      min_price: undefined,
      max_price: undefined,
      page: 1,
    });
  };

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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header section */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-border pb-6">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-text">
            Explorar Anúncios
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Encontre livros, materiais e componentes postados por estudantes da
            UNIFOR
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => onNavigate?.("/anuncios/novo")}
        >
          + Anunciar Item
        </Button>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <Card padding="md" className="sticky top-20">
            <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
              <h2 className="font-display text-base font-bold text-text">
                Filtros de Busca
              </h2>
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs text-primary hover:underline font-medium"
              >
                Limpar tudo
              </button>
            </div>

            <form onSubmit={handleApplyFilters} className="space-y-4">
              <Input
                label="Buscar palavra-chave"
                placeholder="Ex: Stewart, Jaleco, Arduino..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <Select
                label="Categoria"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                options={[
                  { label: "Todas as categorias", value: "" },
                  ...categories.map((c) => ({ label: c.name, value: c.slug })),
                ]}
              />

              <Select
                label="Tipo de Anúncio"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                options={[
                  { label: "Todos os tipos", value: "" },
                  { label: "Doação (Gratuito)", value: "doacao" },
                  { label: "Venda", value: "venda" },
                ]}
              />

              {/* Price range filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text">
                  Faixa de Preço (R$)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Mín"
                    min="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-focus-ring"
                  />
                  <input
                    type="number"
                    placeholder="Máx"
                    min="0"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-focus-ring"
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" fullWidth size="sm">
                Filtrar Resultados
              </Button>
            </form>
          </Card>
        </aside>

        {/* Ads Grid */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : ads.length === 0 ? (
            <Card padding="lg" className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-text-muted opacity-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3 className="mt-4 font-display text-lg font-bold text-text">
                Nenhum anúncio encontrado
              </h3>
              <p className="mt-1 text-sm text-text-muted">
                Tente ajustar seus filtros ou buscar por outro termo.
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4"
                onClick={handleClearFilters}
              >
                Limpar Filtros
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>
                  Exibindo <strong>{ads.length}</strong> de{" "}
                  <strong>{meta.total}</strong> anúncios
                </span>
                <span>
                  Página {meta.page} de {meta.totalPages}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {ads.map((ad) => (
                  <Card
                    key={ad.id}
                    padding="sm"
                    className="group flex flex-col justify-between overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer"
                    onClick={() => onSelectAd?.(ad)}
                  >
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
                      <div className="absolute top-2 left-2">
                        <Badge
                          variant={ad.type === "venda" ? "venda" : "doacao"}
                        >
                          {ad.type === "venda" ? "Venda" : "Doação"}
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge variant="category">{ad.category.name}</Badge>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-1 flex-col justify-between p-2">
                      <div>
                        {/* Title formatting: wrapped, responsive font, line-clamp-2 with min-h to fit boxes perfectly */}
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
                          <span className="text-xs text-text-muted truncate max-w-[100px]">
                            {ad.user.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={meta.page <= 1}
                    onClick={() => onPageChange?.(meta.page - 1)}
                  >
                    Anterior
                  </Button>
                  <span className="text-xs font-semibold px-3 py-1 bg-surface-raised border border-border rounded-md">
                    {meta.page} / {meta.totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={meta.page >= meta.totalPages}
                    onClick={() => onPageChange?.(meta.page + 1)}
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
