import { Location, Unit } from '../types';

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

const buildApiUrl = (endpoint: string): string => {
  if (endpoint.includes('/v')) {
    return `${API_BASE_URL}${endpoint}`;
  }
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
    const response = await fetch(buildApiUrl('/locations'));
    return await handleResponse<Location[]>(response);
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
    const response = await fetch(buildApiUrl(`/locations/slug/${slug}`));
    if (response.status === 404) {
      return null;
    }
    return await handleResponse<Location>(response);
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
    return await handleResponse<Location>(response);
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
    return await handleResponse<Location>(response);
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
    const response = await fetch(url);
    return await handleResponse<{ units: Unit[]; total: number; page: number; limit: number; totalPages: number }>(response);
  } catch (error) {
    handleApiError(error, 'Failed to fetch units');
    throw new Error('Failed to fetch units');
  }
};

export const fetchAllUnits = async (): Promise<Unit[]> => {
  try {
    const response = await fetch(buildApiUrl('/units/all'));
    return await handleResponse<Unit[]>(response);
  } catch (error) {
    handleApiError(error, 'Failed to fetch all units');
    throw new Error('Failed to fetch all units');
  }
};

export const fetchUnitsByLocationId = async (locationId: string): Promise<Unit[]> => {
  try {
    const response = await fetch(buildApiUrl(`/units/location/${locationId}`));
    return await handleResponse<Unit[]>(response);
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
    const response = await fetch(url);
    return await handleResponse<{ units: Unit[]; total: number; page: number; limit: number; totalPages: number }>(response);
  } catch (error) {
    handleApiError(error, `Failed to fetch units by location ID: ${locationId}`);
    throw new Error('Failed to fetch units');
  }
};

export const fetchUnitById = async (id: string): Promise<Unit | null> => {
  try {
    const response = await fetch(buildApiUrl(`/units/${id}`));
    if (response.status === 404) {
      return null;
    }
    return await handleResponse<Unit>(response);
  } catch (error) {
    handleApiError(error, `Failed to fetch unit by ID: ${id}`);
    return null;
  }
};

export const fetchUnitBySlug = async (slug: string): Promise<Unit | null> => {
  try {
    const response = await fetch(buildApiUrl(`/units/slug/${slug}`));
    if (response.status === 404) {
      return null;
    }
    return await handleResponse<Unit>(response);
  } catch (error) {
    handleApiError(error, `Failed to fetch unit by slug: ${slug}`);
    return null;
  }
};

export const createUnit = async (unitData: {
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
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(buildApiUrl('/units'), {
      method: 'POST',
      headers,
      body: JSON.stringify(unitData),
    });
    return await handleResponse<Unit>(response);
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
}): Promise<Unit> => {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(buildApiUrl(`/units/${id}`), {
      method: 'PUT',
      headers,
      body: JSON.stringify(unitData),
    });
    return await handleResponse<Unit>(response);
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
    return true;
  } catch (error) {
    handleApiError(error, `Failed to delete unit with ID: ${id}`);
    return false;
  }
};