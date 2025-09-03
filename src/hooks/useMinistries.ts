import { useState, useEffect } from 'react';
import { ministryService, Ministry, MinistryResponse } from '@/services/ministryService';
import { useToast } from '@/hooks/use-toast';

export const useMinistries = () => {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMinistries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ministryService.getAllMinistries();
      if (response.success && Array.isArray(response.data)) {
        setMinistries(response.data);
      } else {
        setError(response.error || 'Failed to fetch ministries');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getMinistryById = async (id: string) => {
    setLoading(true);
    try {
      const response = await ministryService.getMinistryById(id);
      if (response.success) {
        return response.data as Ministry;
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to fetch ministry",
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

  const getMinistryOptions = () => {
    return ministries.map(ministry => ({
      value: ministry.id.toString(),
      label: ministry.name,
      id: ministry.id
    }));
  };

  useEffect(() => {
    fetchMinistries();
  }, []);

  return {
    ministries,
    loading,
    error,
    fetchMinistries,
    getMinistryById,
    getMinistryOptions,
  };
};