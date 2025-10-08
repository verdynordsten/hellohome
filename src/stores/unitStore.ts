import { create } from 'zustand';
import { UnitState, Unit, CreateUnitInput, UpdateUnitInput } from '../types';
import {
  fetchUnits as apiFetchUnits,
  fetchAllUnits as apiFetchAllUnits,
  fetchUnitsByLocationId as apiFetchUnitsByLocationId,
  fetchUnitsByLocationIdPaginated as apiFetchUnitsByLocationIdPaginated,
  fetchUnitById as apiFetchUnitById,
  fetchUnitBySlug as apiFetchUnitBySlug,
  createUnit as apiCreateUnit,
  updateUnit as apiUpdateUnit,
  deleteUnit as apiDeleteUnit
} from '../services/api';

const _mapDrizzleUnit = (drizzleUnit: {
  id: string;
  locationId: string;
  type: string;
  name: string | null;
  unitName: string | null;
  slug: string | null;
  description: string | null;
  pricePerMonth: string | null;
  pricePerNight: string | null;
  available: boolean | null;
  imageUrl: string | null;
  images: string[] | null;
  features: string[] | null;
  view: string | null;
  floor: string | null;
  building: string | null;
  tower: string | null;
  mapEmbedUrl: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}): Unit => ({
  id: drizzleUnit.id,
  location_id: drizzleUnit.locationId,
  type: drizzleUnit.type,
  name: drizzleUnit.name,
  unit_name: drizzleUnit.unitName,
  slug: drizzleUnit.slug,
  description: drizzleUnit.description,
  price_per_month: drizzleUnit.pricePerMonth ? parseFloat(drizzleUnit.pricePerMonth) : null,
  price_per_night: drizzleUnit.pricePerNight ? parseFloat(drizzleUnit.pricePerNight) : null,
  available: drizzleUnit.available,
  image_url: drizzleUnit.imageUrl,
  images: drizzleUnit.images,
  features: drizzleUnit.features,
  view: drizzleUnit.view,
  floor: drizzleUnit.floor,
  building: drizzleUnit.building,
  tower: drizzleUnit.tower,
  map_embed_url: drizzleUnit.mapEmbedUrl,
  created_at: drizzleUnit.createdAt?.toISOString() || null,
  updated_at: drizzleUnit.updatedAt?.toISOString() || null,
});

export const useUnitStore = create<UnitState>((set, _get) => ({
  units: [],
  selectedUnit: null,
  unitsByLocation: {},
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalUnits: 0,
  unitsPerPage: 10,
  searchQuery: "",
  sortBy: "price_per_night",
  sortOrder: "asc" as 'asc' | 'desc',

  fetchUnits: async (params?: { page?: number; limit?: number; search?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }) => {
    set({ isLoading: true, error: null });
    try {
      const page = params?.page || _get().currentPage;
      const limit = params?.limit || _get().unitsPerPage;
      const search = params?.search || _get().searchQuery;
      const sortBy = params?.sortBy || _get().sortBy;
      const sortOrder = params?.sortOrder || _get().sortOrder;
      
      const response = await apiFetchUnits({ page, limit, search, sortBy, sortOrder });
      
      const unitsByLocation: Record<string, Unit[]> = {};
      response.units.forEach((unit) => {
        if (!unitsByLocation[unit.location_id]) {
          unitsByLocation[unit.location_id] = [];
        }
        unitsByLocation[unit.location_id].push(unit);
      });
      
      set({
        units: response.units,
        unitsByLocation,
        currentPage: response.page,
        totalPages: response.totalPages,
        totalUnits: response.total,
        unitsPerPage: response.limit,
        searchQuery: search,
        sortBy: sortBy,
        sortOrder: sortOrder,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to fetch units:', error);
      set({ error: 'Failed to fetch units', isLoading: false });
    }
  },

  fetchAllUnits: async () => {
    set({ isLoading: true, error: null });
    try {
      const units = await apiFetchAllUnits();
      
      const unitsByLocation: Record<string, Unit[]> = {};
      units.forEach((unit) => {
        if (!unitsByLocation[unit.location_id]) {
          unitsByLocation[unit.location_id] = [];
        }
        unitsByLocation[unit.location_id].push(unit);
      });
      
      set({ units, unitsByLocation, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch all units:', error);
      set({ error: 'Failed to fetch all units', isLoading: false });
    }
  },

  fetchUnitsByLocationId: async (locationId: string) => {
    try {
      return await apiFetchUnitsByLocationId(locationId);
    } catch (error) {
      console.error('Failed to fetch units by location ID:', error);
      return [];
    }
  },

  fetchUnitsByLocationIdPaginated: async (locationId: string, params?: { page?: number; limit?: number; search?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }) => {
    try {
      const response = await apiFetchUnitsByLocationIdPaginated(locationId, params);
      
      set((state) => ({
        ...state,
        units: response.units,
        currentPage: response.page,
        totalPages: response.totalPages,
        totalUnits: response.total,
        unitsPerPage: response.limit,
        isLoading: false,
      }));
      
      return response;
    } catch (error) {
      console.error('Failed to fetch units by location ID with pagination:', error);
      set({ error: 'Failed to fetch units', isLoading: false });
      return {
        units: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1
      };
    }
  },

  fetchUnitById: async (id: string) => {
    try {
      return await apiFetchUnitById(id);
    } catch (error) {
      console.error('Failed to fetch unit by ID:', error);
      return null;
    }
  },

  fetchUnitBySlug: async (slug: string) => {
    try {
      return await apiFetchUnitBySlug(slug);
    } catch (error) {
      console.error('Failed to fetch unit by slug:', error);
      return null;
    }
  },

  createUnit: async (unitData: CreateUnitInput) => {
    set({ isLoading: true, error: null });
    try {
      const newUnit = await apiCreateUnit(unitData);
      
      set((state) => ({
        units: [...state.units, newUnit],
        isLoading: false,
      }));
      
      if (newUnit.location_id) {
        set((state) => ({
          unitsByLocation: {
            ...state.unitsByLocation,
            [newUnit.location_id]: [
              ...(state.unitsByLocation[newUnit.location_id] || []),
              newUnit,
            ],
          },
        }));
      }
      
      return newUnit;
    } catch (error) {
      console.error('Failed to create unit:', error);
      set({ error: 'Failed to create unit', isLoading: false });
      return null;
    }
  },

  updateUnit: async (id: string, unitData: UpdateUnitInput) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUnit = await apiUpdateUnit(id, unitData);
      
      set((state) => ({
        units: state.units.map((unit) =>
          unit.id === id ? updatedUnit : unit
        ),
        isLoading: false,
      }));
      
      if (updatedUnit.location_id) {
        set((state) => ({
          unitsByLocation: {
            ...state.unitsByLocation,
            [updatedUnit.location_id]: (state.unitsByLocation[updatedUnit.location_id] || [])
              .map((unit) => (unit.id === id ? updatedUnit : unit)),
          },
        }));
      }
      
      return updatedUnit;
    } catch (error) {
      console.error('Failed to update unit:', error);
      set({ error: 'Failed to update unit', isLoading: false });
      return null;
    }
  },

  deleteUnit: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const success = await apiDeleteUnit(id);
      
      if (success) {
        const unitToDelete = _get().units.find((unit) => unit.id === id);

        set((state) => ({
          units: state.units.filter((unit) => unit.id !== id),
          isLoading: false,
        }));
        
        if (unitToDelete?.location_id) {
          set((state) => ({
            unitsByLocation: {
              ...state.unitsByLocation,
              [unitToDelete.location_id]: (state.unitsByLocation[unitToDelete.location_id] || [])
                .filter((unit) => unit.id !== id),
            },
          }));
        }
        
        return true;
      } else {
        throw new Error('Failed to delete unit');
      }
    } catch (error) {
      console.error('Failed to delete unit:', error);
      set({ error: 'Failed to delete unit', isLoading: false });
      return false;
    }
  },

  setSelectedUnit: (unit: Unit | null) => {
    set({ selectedUnit: unit });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query, currentPage: 1 });
    _get().fetchUnits({
      page: 1,
      limit: _get().unitsPerPage,
      search: query,
      sortBy: 'price_per_night',
      sortOrder: _get().sortOrder
    });
  },

  setCurrentPage: (page: number) => {
    set({ currentPage: page });
    _get().fetchUnits({
      page,
      limit: _get().unitsPerPage,
      search: _get().searchQuery,
      sortBy: 'price_per_night',
      sortOrder: _get().sortOrder
    });
  },

  setUnitsPerPage: (limit: number) => {
    set({ unitsPerPage: limit, currentPage: 1 });
    _get().fetchUnits({
      page: 1,
      limit,
      search: _get().searchQuery,
      sortBy: 'price_per_night',
      sortOrder: _get().sortOrder
    });
  },

  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => {
    set({ sortBy: 'price_per_night', sortOrder, currentPage: 1 });
    _get().fetchUnits({
      page: 1,
      limit: _get().unitsPerPage,
      search: _get().searchQuery,
      sortBy: 'price_per_night',
      sortOrder
    });
  },
}));