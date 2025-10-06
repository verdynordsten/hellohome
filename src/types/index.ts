// Centralized data types for the application

export type AppRole = "admin" | "user";

export interface Location {
  id: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
  slug?: string | null;
  units_count?: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Unit {
  id: string;
  location_id: string;
  type: string;
  name?: string | null;
  unit_name?: string | null;
  slug?: string | null;
  description?: string | null;
  price_per_month?: number | null;
  price_per_night?: number | null;
  available?: boolean | null;
  image_url?: string | null;
  images?: string[] | null;
  features?: string[] | null;
  view?: string | null;
  floor?: string | null;
  building?: string | null;
  tower?: string | null;
  map_embed_url?: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string | null;
}

// Input types for creating/updating data
export interface CreateLocationInput {
  name: string;
  description?: string;
  image_url?: string;
  slug?: string;
  units_count?: number;
}

export interface UpdateLocationInput {
  name?: string;
  description?: string;
  image_url?: string;
  slug?: string;
  units_count?: number;
}

export interface CreateUnitInput {
  location_id: string;
  type: string;
  name?: string;
  unit_name?: string;
  slug?: string;
  description?: string;
  price_per_month?: number;
  price_per_night?: number;
  available?: boolean;
  image_url?: string;
  images?: string[];
  features?: string[];
  view?: string;
  floor?: string;
  building?: string;
  tower?: string;
  map_embed_url?: string;
}

export interface UpdateUnitInput {
  location_id?: string;
  type?: string;
  name?: string;
  unit_name?: string;
  slug?: string;
  description?: string;
  price_per_month?: number;
  price_per_night?: number;
  available?: boolean;
  image_url?: string;
  images?: string[];
  features?: string[];
  view?: string;
  floor?: string;
  building?: string;
  tower?: string;
  map_embed_url?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

// Store types for Zustand
export interface AuthState {
  user: {
    id: string;
    email: string;
    role?: AppRole;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export interface LocationState {
  locations: Location[];
  selectedLocation: Location | null;
  isLoading: boolean;
  error: string | null;
  fetchLocations: () => Promise<void>;
  fetchLocationById: (id: string) => Promise<Location | null>;
  fetchLocationBySlug: (slug: string) => Promise<Location | null>;
  createLocation: (location: CreateLocationInput) => Promise<Location | null>;
  updateLocation: (id: string, location: UpdateLocationInput) => Promise<Location | null>;
  deleteLocation: (id: string) => Promise<boolean>;
  setSelectedLocation: (location: Location | null) => void;
}

export interface UnitState {
  units: Unit[];
  selectedUnit: Unit | null;
  unitsByLocation: Record<string, Unit[]>;
  isLoading: boolean;
  error: string | null;
  // Pagination state
  currentPage: number;
  totalPages: number;
  totalUnits: number;
  unitsPerPage: number;
  searchQuery: string;
  // Sorting state
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  fetchUnits: (params?: { page?: number; limit?: number; search?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }) => Promise<void>;
  fetchUnitsByLocationId: (locationId: string) => Promise<Unit[]>;
  fetchUnitsByLocationIdPaginated: (locationId: string, params?: { page?: number; limit?: number; search?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }) => Promise<{ units: Unit[]; total: number; page: number; limit: number; totalPages: number }>;
  fetchUnitById: (id: string) => Promise<Unit | null>;
  fetchUnitBySlug: (slug: string) => Promise<Unit | null>;
  createUnit: (unit: CreateUnitInput) => Promise<Unit | null>;
  updateUnit: (id: string, unit: UpdateUnitInput) => Promise<Unit | null>;
  deleteUnit: (id: string) => Promise<boolean>;
  setSelectedUnit: (unit: Unit | null) => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setUnitsPerPage: (limit: number) => void;
  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}