import { useState, useCallback } from 'react';
import { apiClient, ApiResponse } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

// Generic hook for API calls with loading, error, and success states
export function useApi<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);
  const { toast } = useToast();

  const execute = useCallback(async (
    apiCall: () => Promise<ApiResponse<T>>,
    options?: {
      showSuccessToast?: boolean;
      showErrorToast?: boolean;
      successMessage?: string;
      errorMessage?: string;
    }
  ): Promise<ApiResponse<T>> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();

      if (response.success) {
        setData(response.data || null);
        
        if (options?.showSuccessToast) {
          toast({
            title: "Success",
            description: options.successMessage || response.message || "Operation completed successfully",
          });
        }
      } else {
        const errorMessage = options?.errorMessage || response.error || "An error occurred";
        setError(errorMessage);
        
        if (options?.showErrorToast !== false) {
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
        }
      }

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      
      if (options?.showErrorToast !== false) {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }

      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    execute,
    reset
  };
}

// Specific hooks for common operations
export function useAuth() {
  const { execute, loading, error } = useApi();

  const login = useCallback(async (credentials: {
    ministry: string;
    role: string;
    username: string;
    password: string;
  }) => {
    return execute(
      () => apiClient.login(credentials),
      {
        showSuccessToast: true,
        showErrorToast: true,
        successMessage: "Logged in successfully",
      }
    );
  }, [execute]);

  const logout = useCallback(async () => {
    return execute(
      () => apiClient.logout(),
      {
        showSuccessToast: true,
        successMessage: "Logged out successfully",
      }
    );
  }, [execute]);

  return {
    login,
    logout,
    loading,
    error
  };
}

export function useRequests() {
  const { execute, loading, error, data } = useApi();

  const getRequests = useCallback(async (filters?: any) => {
    return execute(() => apiClient.getRequests(filters));
  }, [execute]);

  const createRequest = useCallback(async (requestData: any) => {
    return execute(
      () => apiClient.createRequest(requestData),
      {
        showSuccessToast: true,
        successMessage: "Request created successfully",
      }
    );
  }, [execute]);

  const approveRequest = useCallback(async (id: string) => {
    return execute(
      () => apiClient.approveRequest(id),
      {
        showSuccessToast: true,
        successMessage: "Request approved successfully",
      }
    );
  }, [execute]);

  const rejectRequest = useCallback(async (id: string, reason: string) => {
    return execute(
      () => apiClient.rejectRequest(id, reason),
      {
        showSuccessToast: true,
        successMessage: "Request rejected successfully",
      }
    );
  }, [execute]);

  return {
    requests: data,
    getRequests,
    createRequest,
    approveRequest,
    rejectRequest,
    loading,
    error
  };
}

export function useDashboard() {
  const { execute, loading, error, data } = useApi();

  const getStats = useCallback(async () => {
    return execute(() => apiClient.getDashboardStats());
  }, [execute]);

  const getCharts = useCallback(async () => {
    return execute(() => apiClient.getDashboardCharts());
  }, [execute]);

  return {
    dashboardData: data,
    getStats,
    getCharts,
    loading,
    error
  };
}

export function useAuditLogs() {
  const { execute, loading, error, data } = useApi();

  const getLogs = useCallback(async (filters?: any) => {
    return execute(() => apiClient.getAuditLogs(filters));
  }, [execute]);

  const exportLogs = useCallback(async (format: 'csv' | 'xlsx' = 'csv') => {
    return execute(
      () => apiClient.exportAuditLogs(format),
      {
        showSuccessToast: true,
        successMessage: "Audit logs exported successfully",
      }
    );
  }, [execute]);

  return {
    auditLogs: data,
    getLogs,
    exportLogs,
    loading,
    error
  };
}