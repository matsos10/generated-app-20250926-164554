import { create } from 'zustand';
import { toast } from 'sonner';
interface User {
  id: string;
  email: string;
  name?: string;
  subscriptionPlan?: 'pro' | 'premium';
  subscriptionStatus?: 'active' | 'trialing' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete' | 'incomplete_expired' | 'paused';
}
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: Record<string, string>) => Promise<boolean>;
  signup: (details: Record<string, string>) => Promise<boolean>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}
const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Login failed');
      }
      set({ user: data.data, isAuthenticated: true });
      toast.success('Login successful!');
      return true;
    } catch (error) {
      toast.error((error as Error).message);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  signup: async (details) => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Signup failed');
      }
      set({ user: data.data, isAuthenticated: true });
      toast.success('Account created successfully!');
      return true;
    } catch (error) {
      toast.error((error as Error).message);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      set({ user: null, isAuthenticated: false });
      toast.info('You have been logged out.');
    }
  },
  checkSession: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      if (response.ok && data.success) {
        set({ user: data.data, isAuthenticated: true });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
export default useAuthStore;