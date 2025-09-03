import { useState, useEffect } from 'react';
import { dataRequestService, DataRequest, DataRequestResponse } from '@/services/dataRequestService';
import { auditLogService } from '@/services/auditLogService';
import { useToast } from '@/hooks/use-toast';

export const useDataRequests = () => {
  const [requests, setRequests] = useState<DataRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const logActivity = async (action: string, resource: string, details: string, status: 'success' | 'failed' = 'success') => {
    try {
      await auditLogService.createAuditLog({
        action: action as any,
        resource,
        details,
        status,
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dataRequestService.getAllDataRequests();
      if (response.success && Array.isArray(response.data)) {
        setRequests(response.data);
        await logActivity('data_access', 'Data Requests', 'Fetched all data requests');
      } else {
        setError(response.error || 'Failed to fetch requests');
        await logActivity('data_access', 'Data Requests', `Failed to fetch requests: ${response.error}`, 'failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      await logActivity('data_access', 'Data Requests', `Error fetching requests: ${errorMessage}`, 'failed');
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (requestData: DataRequest) => {
    setLoading(true);
    try {
      const response = await dataRequestService.createDataRequest(requestData);
      if (response.success) {
        await fetchRequests(); // Refresh the list
        toast({
          title: "Success",
          description: "Data request created successfully",
        });
        const newRequest = response.data as DataRequest;
        await logActivity('data_request', `Request ${newRequest?.id || 'NEW'}`, `Created new data request for ${requestData.dataType}`);
        return response;
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to create request",
          variant: "destructive"
        });
        await logActivity('data_request', 'New Request', `Failed to create request: ${response.error}`, 'failed');
        return response;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      await logActivity('data_request', 'New Request', `Error creating request: ${errorMessage}`, 'failed');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateRequest = async (id: string, updateData: Partial<DataRequest>) => {
    setLoading(true);
    try {
      const response = await dataRequestService.updateDataRequest(id, updateData);
      if (response.success) {
        await fetchRequests(); // Refresh the list
        toast({
          title: "Success",
          description: "Data request updated successfully",
        });
        await logActivity('update', `Request ${id}`, `Updated data request with status: ${updateData.status || 'modified'}`);
        return response;
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update request",
          variant: "destructive"
        });
        await logActivity('update', `Request ${id}`, `Failed to update request: ${response.error}`, 'failed');
        return response;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      await logActivity('update', `Request ${id}`, `Error updating request: ${errorMessage}`, 'failed');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteRequest = async (id: string) => {
    setLoading(true);
    try {
      const response = await dataRequestService.deleteDataRequest(id);
      if (response.success) {
        await fetchRequests(); // Refresh the list
        toast({
          title: "Success",
          description: "Data request deleted successfully",
        });
        await logActivity('delete', `Request ${id}`, 'Deleted data request');
        return response;
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete request",
          variant: "destructive"
        });
        await logActivity('delete', `Request ${id}`, `Failed to delete request: ${response.error}`, 'failed');
        return response;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      await logActivity('delete', `Request ${id}`, `Error deleting request: ${errorMessage}`, 'failed');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (id: string) => {
    return await updateRequest(id, { status: 'approved' });
  };

  const rejectRequest = async (id: string) => {
    return await updateRequest(id, { status: 'rejected' });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return {
    requests,
    loading,
    error,
    fetchRequests,
    createRequest,
    updateRequest,
    deleteRequest,
    approveRequest,
    rejectRequest,
  };
};