import { authService } from './authService';

export interface DataRequest {
  id?: string;
  targetMinistry: string;
  dataType: string;
  purpose: string;
  justification: string;
  urgency: 'low' | 'medium' | 'high';
  status?: 'pending' | 'approved' | 'rejected';
  requestingMinistry?: string;
  createdAt?: string;
  recordIds?: string;
  retentionPeriod?: string;
  legalBasis?: string;
  requestorName?: string;
  requestorPosition?: string;
}

export interface DataRequestResponse {
  success: boolean;
  data?: DataRequest | DataRequest[];
  message?: string;
  error?: string;
}

class DataRequestService {
  private baseUrl = 'http://localhost:4000/data_requests/api';

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...authService.getAuthHeader(),
    };
  }

  async createDataRequest(requestData: DataRequest): Promise<DataRequestResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to create data request',
        };
      }

      return {
        success: true,
        data: data,
        message: 'Data request created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  async getAllDataRequests(): Promise<DataRequestResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to fetch data requests',
        };
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  async getDataRequestById(id: string): Promise<DataRequestResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to fetch data request',
        };
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  async updateDataRequest(id: string, updateData: Partial<DataRequest>): Promise<DataRequestResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to update data request',
        };
      }

      return {
        success: true,
        data: data,
        message: 'Data request updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  async deleteDataRequest(id: string): Promise<DataRequestResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const data = await response.json();
        return {
          success: false,
          error: data.message || 'Failed to delete data request',
        };
      }

      return {
        success: true,
        message: 'Data request deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }
}

export const dataRequestService = new DataRequestService();