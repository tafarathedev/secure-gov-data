import { useState, useEffect } from 'react';
import { auditLogService, AuditLog, AuditLogResponse } from '@/services/auditLogService';
import { useToast } from '@/hooks/use-toast';

export const useAuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await auditLogService.getAllAuditLogs();
      if (response.success && Array.isArray(response.data)) {
        setLogs(response.data);
      } else {
        setError(response.error || 'Failed to fetch audit logs');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createLog = async (logData: AuditLog) => {
    setLoading(true);
    try {
      const response = await auditLogService.createAuditLog(logData);
      if (response.success) {
        await fetchLogs(); // Refresh the list
        toast({
          title: "Success",
          description: "Audit log created successfully",
        });
        return response;
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to create audit log",
          variant: "destructive"
        });
        return response;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateLog = async (id: string, updateData: Partial<AuditLog>) => {
    setLoading(true);
    try {
      const response = await auditLogService.updateAuditLog(id, updateData);
      if (response.success) {
        await fetchLogs(); // Refresh the list
        toast({
          title: "Success",
          description: "Audit log updated successfully",
        });
        return response;
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update audit log",
          variant: "destructive"
        });
        return response;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteLog = async (id: string) => {
    setLoading(true);
    try {
      const response = await auditLogService.deleteAuditLog(id);
      if (response.success) {
        await fetchLogs(); // Refresh the list
        toast({
          title: "Success",
          description: "Audit log deleted successfully",
        });
        return response;
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete audit log",
          variant: "destructive"
        });
        return response;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getLogById = async (id: string) => {
    setLoading(true);
    try {
      const response = await auditLogService.getAuditLogById(id);
      if (response.success) {
        return response.data as AuditLog;
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to fetch audit log",
          variant: "destructive"
        });
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return {
    logs,
    loading,
    error,
    fetchLogs,
    createLog,
    updateLog,
    deleteLog,
    getLogById,
  };
};