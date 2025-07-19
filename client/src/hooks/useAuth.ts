import { useState, useEffect, createContext, useContext } from 'react';
import { User, AuthState } from '@/types/auth';

const AuthContext = createContext<{
  auth: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: (googleData: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
} | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useAuthState() {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAuth({
          user: data.user,
          token,
          isAuthenticated: true
        });
      } else {
        localStorage.removeItem('auth_token');
        setAuth({
          user: null,
          token: null,
          isAuthenticated: false
        });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      localStorage.removeItem('auth_token');
      setAuth({
        user: null,
        token: null,
        isAuthenticated: false
      });
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('auth_token', data.token);
    setAuth({
      user: data.user,
      token: data.token,
      isAuthenticated: true
    });
  };

  const register = async (email: string, password: string, name: string) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, name })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const data = await response.json();
    localStorage.setItem('auth_token', data.token);
    setAuth({
      user: data.user,
      token: data.token,
      isAuthenticated: true
    });
  };

  const loginWithGoogle = async (googleData: any) => {
    const response = await fetch('/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(googleData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Google login failed');
    }

    const data = await response.json();
    localStorage.setItem('auth_token', data.token);
    setAuth({
      user: data.user,
      token: data.token,
      isAuthenticated: true
    });
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setAuth({
      user: null,
      token: null,
      isAuthenticated: false
    });
  };

  return {
    auth,
    login,
    register,
    loginWithGoogle,
    logout,
    loading
  };
}

export { AuthContext };