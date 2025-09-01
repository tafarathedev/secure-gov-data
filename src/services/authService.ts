import { apiClient } from './api';

export interface User {
  id: string;
  username: string;
  ministry: string;
  role: string;
  permissions: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

class AuthService {
  private static instance: AuthService;
  private authState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null
  };
  private listeners: Array<(state: AuthState) => void> = [];

  private constructor() {
    // Initialize auth state from localStorage on startup
    this.initializeAuth();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private initializeAuth() {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.authState = {
          isAuthenticated: true,
          user,
          token
        };
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.clearAuth();
      }
    }
  }

  async login(credentials: {
    ministry: string;
    role: string;
    username: string;
    password: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiClient.login(credentials);
      
      if (response.success && response.data) {
        const { token, user } = response.data;
        
        // Store auth data
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
        
        // Update state
        this.authState = {
          isAuthenticated: true,
          user: {
            ...user,
            permissions: this.getPermissionsForRole(user.role)
          },
          token
        };
        
        this.notifyListeners();
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuth();
    }
  }

  private clearAuth() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    
    this.authState = {
      isAuthenticated: false,
      user: null,
      token: null
    };
    
    this.notifyListeners();
  }

  private getPermissionsForRole(role: string): string[] {
    const rolePermissions: Record<string, string[]> = {
      'admin': [
        'view_all_requests',
        'create_request',
        'approve_request',
        'reject_request',
        'view_audit_logs',
        'export_data',
        'manage_users'
      ],
      'reviewer': [
        'view_requests',
        'create_request',
        'approve_request',
        'reject_request',
        'view_audit_logs',
        'export_data'
      ],
      'operator': [
        'view_requests',
        'create_request',
        'view_audit_logs'
      ],
      'viewer': [
        'view_requests',
        'view_audit_logs'
      ]
    };

    return rolePermissions[role.toLowerCase()] || ['view_requests'];
  }

  getAuthState(): AuthState {
    return { ...this.authState };
  }

  isAuthenticated(): boolean {
    return this.authState.isAuthenticated;
  }

  getCurrentUser(): User | null {
    return this.authState.user;
  }

  hasPermission(permission: string): boolean {
    if (!this.authState.user) return false;
    return this.authState.user.permissions.includes(permission);
  }

  hasAnyPermission(permissions: string[]): boolean {
    if (!this.authState.user) return false;
    return permissions.some(permission => 
      this.authState.user?.permissions.includes(permission)
    );
  }

  canAccessMinistry(ministry: string): boolean {
    if (!this.authState.user) return false;
    
    // Admin can access all ministries
    if (this.authState.user.role.toLowerCase() === 'admin') return true;
    
    // Users can access their own ministry
    return this.authState.user.ministry === ministry;
  }

  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.getAuthState()));
  }

  // Check if token is expired and refresh if needed
  async checkTokenValidity(): Promise<boolean> {
    if (!this.authState.token) return false;

    try {
      // Try to refresh the token
      const response = await apiClient.refreshToken();
      
      if (response.success && response.data) {
        // Update token
        const { token, user } = response.data;
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
        
        this.authState.token = token;
        this.authState.user = {
          ...user,
          permissions: this.getPermissionsForRole(user.role)
        };
        
        this.notifyListeners();
        return true;
      } else {
        // Token refresh failed, clear auth
        this.clearAuth();
        return false;
      }
    } catch (error) {
      console.error('Token validation error:', error);
      this.clearAuth();
      return false;
    }
  }
}

export const authService = AuthService.getInstance();

// React hook for using auth service
import { useState, useEffect } from 'react';

export function useAuthState() {
  const [authState, setAuthState] = useState<AuthState>(authService.getAuthState());

  useEffect(() => {
    const unsubscribe = authService.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  return {
    ...authState,
    login: authService.login.bind(authService),
    logout: authService.logout.bind(authService),
    hasPermission: authService.hasPermission.bind(authService),
    hasAnyPermission: authService.hasAnyPermission.bind(authService),
    canAccessMinistry: authService.canAccessMinistry.bind(authService),
    checkTokenValidity: authService.checkTokenValidity.bind(authService)
  };
}