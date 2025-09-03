import { authService } from './authService';

export interface AuditLog {
  id?: string;
  timestamp?: string;
  user?: string;
  ministry?: string;
  action: 'login' | 'data_request' | 'data_access' | 'approval' | 'rejection' | 'download' | 'create' | 'update' | 'delete';
  resource: string;
  status?: 'success' | 'failed' | 'pending';
  ipAddress?: string;
  details: string;
  riskLevel?: 'low' | 'medium' | 'high';
}

export interface AuditLogResponse {
  success: boolean;
  data?: AuditLog | AuditLog[];
  message?: string;
  error?: string;
}

class AuditLogService {
  private baseUrl = 'http://localhost:4000/audit-logs/api';

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...authService.getAuthHeader(),
    };
  }

  async getAllAuditLogs(): Promise<AuditLogResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to fetch audit logs',
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

  async getAuditLogById(id: string): Promise<AuditLogResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to fetch audit log',
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

  async createAuditLog(logData: AuditLog): Promise<AuditLogResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(logData),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to create audit log',
        };
      }

      return {
        success: true,
        data: data,
        message: 'Audit log created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  async updateAuditLog(id: string, updateData: Partial<AuditLog>): Promise<AuditLogResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/logs/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to update audit log',
        };
      }

      return {
        success: true,
        data: data,
        message: 'Audit log updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  async deleteAuditLog(id: string): Promise<AuditLogResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/logs/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const data = await response.json();
        return {
          success: false,
          error: data.message || 'Failed to delete audit log',
        };
      }

      return {
        success: true,
        message: 'Audit log deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }
}

export const auditLogService = new AuditLogService();