import { auditLogin, auditSignup, auditLogout } from '@/utils/auditLogger';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  ministry?: string;
  role?: string;
  username: string;
  email: string;
  password: string;
  full_name: string;
  position: string;
  ministry_id: number;
  role_id: number;
  phone: string;
}


export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    ministry: string;
    role: string;
    username: string;
  };
  message?: string;
  error?: string;
}

class AuthService {
  private baseUrl = 'http://localhost:4000/auth';
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';
  private ministryKey = "loggedInMinistryId"
  private roleKey = "loggedinRoleId"


  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Login failed',
        };
      }

      if (data.token) {
        this.setToken(data.token);
        this.setUser(data.user);
        // Create audit log for successful login
        auditLogin(credentials.email, 'success');
      }

      return {
        success: true,
        token: data.token,
        user: data.user,
        message: data.message || 'Login successful',
      };
    } catch (error) {
      // Create audit log for failed login
      auditLogin(credentials.email, 'failed');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  async signUp(userData: SignUpData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Registration failed',
        };
      }

      if (data.token) {
        this.setToken(data.token);
        this.setUser(data.user);
        // Create audit log for successful signup
        auditSignup(userData.email, 'success');
      }

      return {
        success: true,
        token: data.token,
        user: data.user,
        message: data.message || 'Registration successful',
      };
    } catch (error) {
      // Create audit log for failed signup
      auditSignup(userData.email, 'failed');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  logout(): void {
    const user = this.getUser();
    if (user?.email) {
      auditLogout(user.email);
    }
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): any | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setUser(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getAuthHeader(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export const authService = new AuthService();