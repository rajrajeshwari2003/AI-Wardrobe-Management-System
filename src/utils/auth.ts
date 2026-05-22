import { supabase } from './supabaseClient';


export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
}

export const authService = {
 async signup(email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: 'Network error' };
  }
},

  async login(email: string, password: string): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.session) {
        return { success: false, error: error?.message || 'Login failed' };
      }

      const session: AuthSession = {
        user: {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name || 'User',
        },
        accessToken: data.session.access_token,
      };

      // Store session in localStorage
      localStorage.setItem('auth_session', JSON.stringify(session));

      return { success: true, session };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error' };
    }
  },

  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('auth_session');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  async getSession(): Promise<AuthSession | null> {
    try {
      // Check localStorage first
      const stored = localStorage.getItem('auth_session');
      if (stored) {
        return JSON.parse(stored);
      }

      // Check Supabase session
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const session: AuthSession = {
          user: {
            id: data.session.user.id,
            email: data.session.user.email!,
            name: data.session.user.user_metadata?.name || 'User',
          },
          accessToken: data.session.access_token,
        };
        localStorage.setItem('auth_session', JSON.stringify(session));
        return session;
      }

      return null;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  },
};
