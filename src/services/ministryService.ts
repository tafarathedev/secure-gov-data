import { authService } from './authService';

export interface Ministry {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MinistryResponse {
  success: boolean;
  data?: Ministry | Ministry[];
  message?: string;
  error?: string;
}

class MinistryService {
  private baseUrl = 'http://localhost:4000/ministries/api';

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...authService.getAuthHeader(),
    };
  }

  async getAllMinistries(): Promise<MinistryResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/ministry`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to fetch ministries',
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

  async getMinistryById(id: string): Promise<MinistryResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/ministry/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to fetch ministry',
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
}

export const ministryService = new MinistryService();