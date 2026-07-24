export type AdType = "venda" | "doacao";

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Ad {
  id: string;
  title: string;
  description: string;
  type: AdType;
  price: number | null;
  imageUrl: string | null;
  createdAt: string;
  category: Category;
  user?: Pick<User, "id" | "name">;
}

export interface CreateAdInput {
  title: string;
  description: string;
  type: AdType;
  price?: number | null;
  categoryId: number;
  imageUrl?: string | null;
}

export interface AdFilters {
  category?: string;
  type?: AdType;
  search?: string;
  min_price?: number;
  max_price?: number;
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedAds {
  items: Ad[];
  meta: PaginationMeta;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface CategoryStat {
  name: string;
  slug: string;
  total: number;
}

export interface Stats {
  totalAds: number;
  totalUsers: number;
  totalDoacoes: number;
  totalVendas: number;
  adsByCategory: CategoryStat[];
}

export interface ApiError {
  error: string;
}
