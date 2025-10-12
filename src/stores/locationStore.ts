import { create } from 'zustand';
import { LocationState, Location, CreateLocationInput, UpdateLocationInput } from '../types';
import {
  fetchLocations as apiFetchLocations,
  fetchLocationById as apiFetchLocationById,
  fetchLocationBySlug as apiFetchLocationBySlug,
  createLocation as apiCreateLocation,
  updateLocation as apiUpdateLocation,
  deleteLocation as apiDeleteLocation
} from '../services/api';

const _mapDrizzleLocation = (drizzleLocation: {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  slug: string | null;
  unitsCount: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}): Location => ({
  id: drizzleLocation.id,
  name: drizzleLocation.name,
  description: drizzleLocation.description,
  image_url: drizzleLocation.imageUrl,
  slug: drizzleLocation.slug,
  units_count: drizzleLocation.unitsCount ? parseInt(drizzleLocation.unitsCount) : null,
  created_at: drizzleLocation.createdAt?.toISOString() || null,
  updated_at: drizzleLocation.updatedAt?.toISOString() || null,
});

const handleStoreError = (error: unknown, message: string, setError: (error: string) => void): void => {
  console.error(message, error);
  setError(message);
};

export const useLocationStore = create<LocationState>((set, _get) => ({
  locations: [],
  selectedLocation: null,
  isLoading: false,
  error: null,

  fetchLocations: async (): Promise<void> => {
    set({ isLoading: true, error: null });
    try {
      const locations = await apiFetchLocations();
      set({ locations, isLoading: false });
    } catch (error) {
      handleStoreError(error, 'Failed to fetch locations', (errorMsg) =>
        set({ error: errorMsg, isLoading: false })
      );
    }
  },

  fetchLocationById: async (id: string): Promise<Location | null> => {
    try {
      return await apiFetchLocationById(id);
    } catch (error) {
      handleStoreError(error, `Failed to fetch location by ID: ${id}`, () => {});
      return null;
    }
  },

  fetchLocationBySlug: async (slug: string): Promise<Location | null> => {
    try {
      return await apiFetchLocationBySlug(slug);
    } catch (error) {
      handleStoreError(error, `Failed to fetch location by slug: ${slug}`, () => {});
      return null;
    }
  },

  createLocation: async (locationData: CreateLocationInput): Promise<Location | null> => {
    try {
      const newLocation = await apiCreateLocation(locationData);
      set(state => ({
        locations: [...state.locations, newLocation],
        error: null
      }));
      return newLocation;
    } catch (error) {
      handleStoreError(error, 'Failed to create location', (errorMsg) =>
        set({ error: errorMsg })
      );
      return null;
    }
  },

  updateLocation: async (id: string, locationData: UpdateLocationInput): Promise<Location | null> => {
    try {
      const updatedLocation = await apiUpdateLocation(id, locationData);
      set(state => ({
        locations: state.locations.map(loc =>
          loc.id === id ? updatedLocation : loc
        ),
        selectedLocation: state.selectedLocation?.id === id ? updatedLocation : state.selectedLocation,
        error: null
      }));
      return updatedLocation;
    } catch (error) {
      handleStoreError(error, `Failed to update location with ID: ${id}`, (errorMsg) =>
        set({ error: errorMsg })
      );
      return null;
    }
  },

  deleteLocation: async (id: string): Promise<boolean> => {
    try {
      const success = await apiDeleteLocation(id);
      if (success) {
        set(state => ({
          locations: state.locations.filter(loc => loc.id !== id),
          selectedLocation: state.selectedLocation?.id === id ? null : state.selectedLocation,
          error: null
        }));
      }
      return success;
    } catch (error) {
      handleStoreError(error, `Failed to delete location with ID: ${id}`, (errorMsg) =>
        set({ error: errorMsg })
      );
      return false;
    }
  },

  setSelectedLocation: (location: Location | null): void => {
    set({ selectedLocation: location });
  },
}));