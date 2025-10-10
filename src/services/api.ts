import { Location, Unit, AppRole } from '../types';

interface User {
  id: string;
  email: string;
  role: AppRole;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

const apiCache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();
const pendingRequests = new Map<string, Promise<unknown>>();

const DEFAULT_CACHE_TTL = 5 * 60 * 1000;
const _SHORT_CACHE_TTL = 1 * 60 * 1000;

const getCacheKey = (url: string, options?: RequestInit): string => {
  const method = options?.method || 'GET';
  const body = options?.body ? JSON.stringify(options.body) : '';
  return `${method}:${url}:${body}`;
};

const isCacheValid = (entry: { timestamp: number; ttl: number }): boolean => {
  return Date.now() - entry.timestamp < entry.ttl;
};

const _fetchWithCache = async <T>(
  url: string,
  options?: RequestInit,
  ttl: number = DEFAULT_CACHE_TTL
): Promise<T> => {
  const cacheKey = getCacheKey(url, options);
  
  const cachedEntry = apiCache.get(cacheKey);
  if (cachedEntry && isCacheValid(cachedEntry)) {
    return cachedEntry.data as T;
  }
  
  const pendingRequest = pendingRequests.get(cacheKey);
  if (pendingRequest) {
    return pendingRequest as Promise<T>;
  }
  
  const requestPromise = (async () => {
    try {
      const response = await fetch(url, options);
      const data = await handleResponse<T>(response);
      
      apiCache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        ttl
      });
      
      return data;
    } finally {
      pendingRequests.delete(cacheKey);
    }
  })();
  
  pendingRequests.set(cacheKey, requestPromise);
  
  return requestPromise as Promise<T>;
};

export const clearApiCache = (pattern?: string): void => {
  if (pattern) {
    for (const key of apiCache.keys()) {
      if (key.includes(pattern)) {
        apiCache.delete(key);
      }
    }
  } else {
    apiCache.clear();
  }
};

const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}/${API_VERSION}${endpoint}`;
};

const handleApiError = (error: unknown, message: string): void => {
  console.error(message, error);
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const jsonResponse = await response.json();
  return jsonResponse.data as T;
};

export const fetchLocations = async (): Promise<Location[]> => {
  try {
    return await _fetchWithCache<Location[]>(buildApiUrl('/locations'));
  } catch (error) {
    handleApiError(error, 'Failed to fetch locations');
    throw new Error('Failed to fetch locations');
  }
};

export const fetchLocationById = async (id: string): Promise<Location | null> => {
  try {
    const response = await fetch(buildApiUrl(`/locations/${id}`));
    if (response.status === 404) {
      return null;
    }
    return await handleResponse<Location>(response);
  } catch (error) {
    handleApiError(error, `Failed to fetch location by ID: ${id}`);
    return null;
  }
};

export const fetchLocationBySlug = async (slug: string): Promise<Location | null> => {
  try {
    return await _fetchWithCache<Location | null>(buildApiUrl(`/locations/slug/${slug}`));
  } catch (error) {
    handleApiError(error, `Failed to fetch location by slug: ${slug}`);
    return null;
  }
};

export const createLocation = async (locationData: {
  name: string;
  description?: string;
  image_url?: string;
  slug?: string;
}): Promise<Location> => {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(buildApiUrl('/locations'), {
      method: 'POST',
      headers,
      body: JSON.stringify(locationData),
    });
    const result = await handleResponse<Location>(response);
    
    clearApiCache('/locations');
    
    return result;
  } catch (error) {
    handleApiError(error, 'Failed to create location');
    throw new Error('Failed to create location');
  }
};

export const updateLocation = async (id: string, locationData: {
  name?: string;
  description?: string;
  image_url?: string;
  slug?: string;
}): Promise<Location> => {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(buildApiUrl(`/locations/${id}`), {
      method: 'PUT',
      headers,
      body: JSON.stringify(locationData),
    });
    const result = await handleResponse<Location>(response);
    
    clearApiCache('/locations');
    clearApiCache(`/locations/${id}`);
    
    return result;
  } catch (error) {
    handleApiError(error, `Failed to update location with ID: ${id}`);
    throw new Error('Failed to update location');
  }
};

export const deleteLocation = async (id: string): Promise<boolean> => {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(buildApiUrl(`/locations/${id}`), {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    clearApiCache('/locations');
    clearApiCache(`/locations/${id}`);
    
    return true;
  } catch (error) {
    handleApiError(error, `Failed to delete location with ID: ${id}`);
    return false;
  }
};

export const fetchUnits = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<{ units: Unit[]; total: number; page: number; limit: number; totalPages: number }> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
    const url = buildApiUrl(`/units${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
    return await _fetchWithCache<{ units: Unit[]; total: number; page: number; limit: number; totalPages: number }>(url);
  } catch (error) {
    handleApiError(error, 'Failed to fetch units');
    throw new Error('Failed to fetch units');
  }
};

export const fetchAllUnits = async (): Promise<Unit[]> => {
  try {
    return await _fetchWithCache<Unit[]>(buildApiUrl('/units/all'));
  } catch (error) {
    handleApiError(error, 'Failed to fetch all units');
    throw new Error('Failed to fetch all units');
  }
};

export const fetchUnitsByLocationId = async (locationId: string): Promise<Unit[]> => {
  try {
    return await _fetchWithCache<Unit[]>(buildApiUrl(`/units/location/${locationId}`));
  } catch (error) {
    handleApiError(error, `Failed to fetch units by location ID: ${locationId}`);
    return [];
  }
};

export const fetchUnitsByLocationIdPaginated = async (locationId: string, params?: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<{ units: Unit[]; total: number; page: number; limit: number; totalPages: number }> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
    const url = buildApiUrl(`/units/location/${locationId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
    return await _fetchWithCache<{ units: Unit[]; total: number; page: number; limit: number; totalPages: number }>(url, undefined, _SHORT_CACHE_TTL);
  } catch (error) {
    handleApiError(error, `Failed to fetch units by location ID: ${locationId}`);
    throw new Error('Failed to fetch units');
  }
};

export const fetchUnitById = async (id: string): Promise<Unit | null> => {
  try {
    return await _fetchWithCache<Unit | null>(buildApiUrl(`/units/${id}`));
  } catch (error) {
    handleApiError(error, `Failed to fetch unit by ID: ${id}`);
    return null;
  }
};

export const fetchUnitBySlug = async (slug: string): Promise<Unit | null> => {
  try {
    return await _fetchWithCache<Unit | null>(buildApiUrl(`/units/slug/${slug}`));
  } catch (error) {
    handleApiError(error, `Failed to fetch unit by slug: ${slug}`);
    return null;
  }
};

export const createUnit = async (unitData: FormData | {
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
}): Promise<Unit> => {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Don't set Content-Type for FormData - browser will set it with boundary
    if (!(unitData instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    
    const body = unitData instanceof FormData ? unitData : JSON.stringify(unitData);
    const locationId = unitData instanceof FormData ? unitData.get('location_id') : unitData.location_id;
    
    const response = await fetch(buildApiUrl('/units'), {
      method: 'POST',
      headers,
      body,
    });
    const result = await handleResponse<Unit>(response);
    
    clearApiCache('/units');
    if (locationId) {
      clearApiCache(`/units/location/${locationId}`);
    }
    
    return result;
  } catch (error) {
    handleApiError(error, 'Failed to create unit');
    throw new Error('Failed to create unit');
  }
};

export const updateUnit = async (id: string, unitData: {
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
} | FormData): Promise<Unit> => {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Don't set Content-Type for FormData - browser will set it with boundary
    if (!(unitData instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    
    const body = unitData instanceof FormData ? unitData : JSON.stringify(unitData);
    const response = await fetch(buildApiUrl(`/units/${id}`), {
      method: 'PUT',
      headers,
      body,
    });
    
    if (!response.ok) {
      const _errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const jsonResponse = await response.json();
    const result = jsonResponse.data as Unit;
    
    // Clear all caches to ensure fresh data
    clearApiCache('/units');
    clearApiCache(`/units/${id}`);
    clearApiCache('/units/all');
    
    // Extract location_id from FormData if needed
    let locationId: string | undefined;
    if (unitData instanceof FormData) {
      locationId = unitData.get('location_id') as string;
    } else {
      locationId = unitData.location_id;
    }
    
    if (locationId) {
      clearApiCache(`/units/location/${locationId}`);
    }
    
    return result;
  } catch (error) {
    handleApiError(error, `Failed to update unit with ID: ${id}`);
    throw new Error('Failed to update unit');
  }
};

export const login = async (credentials: {
  email: string;
  password: string;
}): Promise<{ user: User; token: string }> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(buildApiUrl('/auth/login'), {
      method: 'POST',
      headers,
      body: JSON.stringify(credentials),
    });
    return await handleResponse<{ user: User; token: string }>(response);
  } catch (error) {
    handleApiError(error, 'Failed to login');
    throw new Error('Failed to login');
  }
};

export const verifyToken = async (): Promise<{ user: User; valid: boolean }> => {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(buildApiUrl('/auth/verify'), {
      method: 'GET',
      headers,
    });
    return await handleResponse<{ user: User; valid: boolean }>(response);
  } catch (error) {
    handleApiError(error, 'Failed to verify token');
    throw new Error('Failed to verify token');
  }
};

export const deleteUnit = async (id: string): Promise<boolean> => {
  try {
    const unit = await fetchUnitById(id);
    
    const token = getAuthToken();
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(buildApiUrl(`/units/${id}`), {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    clearApiCache('/units');
    clearApiCache(`/units/${id}`);
    if (unit?.location_id) {
      clearApiCache(`/units/location/${unit.location_id}`);
    }
    
    return true;
  } catch (error) {
    handleApiError(error, `Failed to delete unit with ID: ${id}`);
    return false;
  }
};