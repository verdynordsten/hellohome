export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  signal?: AbortSignal;
}

const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

const buildApiUrl = (endpoint: string): string => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';
  return `${API_BASE_URL}/${API_VERSION}${endpoint}`;
};

export const uploadFiles = async (
  endpoint: string,
  formData: FormData,
  options?: UploadOptions
): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    const token = getAuthToken();
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const xhr = new XMLHttpRequest();
    
    // Handle progress
    if (options?.onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100)
          };
          options.onProgress!(progress);
        }
      });
    }

    // Handle completion
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response.data);
        } catch (_error) {
          reject(new Error('Invalid response from server'));
        }
      } else {
        try {
          const errorResponse = JSON.parse(xhr.responseText);
          reject(new Error(errorResponse.message || `HTTP error! status: ${xhr.status}`));
        } catch {
          reject(new Error(`HTTP error! status: ${xhr.status}`));
        }
      }
    });

    // Handle errors
    xhr.addEventListener('error', () => {
      reject(new Error('Network error occurred during upload'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload was aborted'));
    });

    // Handle abort signal
    if (options?.signal) {
      options.signal.addEventListener('abort', () => {
        xhr.abort();
      });
    }

    // Open and send request
    xhr.open('POST', buildApiUrl(endpoint));
    
    // Set headers
    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });
    
    xhr.send(formData);
  });
};

export const uploadUnitImages = async (
  formData: FormData,
  options?: UploadOptions
): Promise<unknown> => {
  return uploadFiles('/units/upload', formData, options);
};

export const uploadLocationImage = async (
  formData: FormData,
  options?: UploadOptions
): Promise<unknown> => {
  return uploadFiles('/locations/upload', formData, options);
};