import { authService } from './authService';

export interface AuditLog {
  id?: string;
  user_id?: string;
  user_email?: string;
  ministry_id?: number;
  timestamp?: string;
  action: 'login' | 'data_request' | 'data_access' | 'approval' | 'rejection' | 'download' | 'create' | 'update' | 'delete' | 'signup' | 'logout';
  resource: string;
  resource_id?: string;
  status?: 'success' | 'failed' | 'pending';
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  details: string;
  risk_level?: 'low' | 'medium' | 'high';
  country?: string;
  city?: string;
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

  
  
  // Helper method to get user IP address
  private async getUserIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return '127.0.0.1'; // fallback
    }
  }

  // Helper method to get user location
  private async getUserLocation(ip: string): Promise<{ country?: string; city?: string }> {
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      const data = await response.json();
      return {
        country: data.country_name,
        city: data.city
      };
    } catch (error) {
      return {};
    }
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
        data: data.data ,
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

  

  async createAuditLog(logData: Partial<AuditLog>): Promise<AuditLogResponse> {
    try {
      // Get current user info
      const currentUser = authService.getUser().user;
      const userIP = await this.getUserIP();
      const location = await this.getUserLocation(userIP);
      console.log("current User" , currentUser)
      // Prepare the audit log data to match backend structure
      const auditLogPayload = {
        user_id: currentUser?.id,
        user_email: currentUser?.email,
        ministry_id: currentUser?.ministry_id,
        action: logData.action,
        resource: logData.resource,
        resource_id: logData.resource_id,
        status: logData.status || 'success',
        ip_address: userIP,
        user_agent: navigator.userAgent,
        session_id: authService.getToken()?.substring(0, 20), // Use token as session ID
        details: logData.details,
        risk_level: logData.risk_level || 'low',
        country: location.country,
        city: location.city
      };

      /* console.log('Creating audit log:', auditLogPayload); */
      
      const response = await fetch(`${this.baseUrl}/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(auditLogPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Failed to create audit log:', data);
        return {
          success: false,
          error: data.message || 'Failed to create audit log',
        };
      }

      console.log('Audit log created successfully:', data);
      return {
        success: true,
        data: data,
        message: 'Audit log created successfully',
      };
    } catch (error) {
      console.error('Error creating audit log:', error);
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