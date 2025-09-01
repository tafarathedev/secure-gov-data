import { apiConfig } from '@/config/database';

// Types for API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginRequest {
  ministry: string;
  role: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    ministry: string;
    role: string;
  };
}

// HTTP client class for API calls
class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = apiConfig.baseUrl;
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: AbortSignal.timeout(apiConfig.timeout),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message
      };
    } catch (error) {
      console.error('API Request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>(
      apiConfig.endpoints.auth.login,
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );

    if (response.success && response.data?.token) {
      this.token = response.data.token;
      localStorage.setItem('auth_token', this.token);
    }

    return response;
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await this.request<void>(
      apiConfig.endpoints.auth.logout,
      { method: 'POST' }
    );

    this.token = null;
    localStorage.removeItem('auth_token');
    
    return response;
  }

  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>(
      apiConfig.endpoints.auth.refresh,
      { method: 'POST' }
    );
  }

  // Data request methods
  async getRequests(filters?: {
    status?: string;
    ministry?: string;
    urgency?: string;
    search?: string;
  }): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }

    const endpoint = `${apiConfig.endpoints.requests.list}?${params.toString()}`;
    return this.request<any[]>(endpoint);
  }

  async createRequest(requestData: any): Promise<ApiResponse<any>> {
    return this.request<any>(
      apiConfig.endpoints.requests.create,
      {
        method: 'POST',
        body: JSON.stringify(requestData),
      }
    );
  }

  async updateRequest(id: string, data: any): Promise<ApiResponse<any>> {
    return this.request<any>(
      `${apiConfig.endpoints.requests.update}/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  }

  async approveRequest(id: string): Promise<ApiResponse<any>> {
    const endpoint = apiConfig.endpoints.requests.approve.replace(':id', id);
    return this.request<any>(endpoint, { method: 'POST' });
  }

  async rejectRequest(id: string, reason: string): Promise<ApiResponse<any>> {
    const endpoint = apiConfig.endpoints.requests.reject.replace(':id', id);
    return this.request<any>(endpoint, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // Dashboard methods
  async getDashboardStats(): Promise<ApiResponse<any>> {
    return this.request<any>(apiConfig.endpoints.dashboard.stats);
  }

  async getDashboardCharts(): Promise<ApiResponse<any>> {
    return this.request<any>(apiConfig.endpoints.dashboard.charts);
  }

  // Audit methods
  async getAuditLogs(filters?: {
    action?: string;
    ministry?: string;
    risk?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }

    const endpoint = `${apiConfig.endpoints.audit.logs}?${params.toString()}`;
    return this.request<any[]>(endpoint);
  }

  async exportAuditLogs(format: 'csv' | 'xlsx' = 'csv'): Promise<ApiResponse<Blob>> {
    const response = await fetch(
      `${this.baseUrl}${apiConfig.endpoints.audit.export}?format=${format}`,
      {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    const blob = await response.blob();
    return {
      success: true,
      data: blob
    };
  }

  // Reference data methods
  async getMinistries(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(apiConfig.endpoints.ministries);
  }

  async getDataTypes(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(apiConfig.endpoints.dataTypes);
  }

  // User management methods
  async getUsers(filters?: { ministry?: string; role?: string }): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }

    const endpoint = `${apiConfig.endpoints.users}?${params.toString()}`;
    return this.request<any[]>(endpoint);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Utility functions for common operations
export const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const formatApiError = (error: string): string => {
  // Map common API errors to user-friendly messages
  const errorMap: Record<string, string> = {
    'Network request failed': 'Unable to connect to the server. Please check your internet connection.',
    'Invalid credentials': 'Invalid username or password. Please try again.',
    'Unauthorized': 'Your session has expired. Please log in again.',
    'Forbidden': 'You do not have permission to perform this action.',
    'Not found': 'The requested resource was not found.',
    'Internal server error': 'A server error occurred. Please try again later.',
  };

  return errorMap[error] || error || 'An unexpected error occurred.';
};