import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'consumer' | 'manufacturer' | 'pharmacy' | 'regulator';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole, organization?: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'medify_users';
const CURRENT_USER_KEY = 'medify_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (!storedUsers) return [];

    try {
      return JSON.parse(storedUsers);
    } catch {
      return [];
    }
  });

  const persistUsers = (nextUsers: User[]) => {
    setUsers(nextUsers);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(nextUsers));
  };

  const login = async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundUser = users.find(user => user.email === email);
    if (!foundUser) {
      throw new Error('Invalid credentials');
    }

    setUser(foundUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(foundUser));
  };

  const signup = async (email: string, password: string, name: string, role: UserRole, organization?: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role,
      organization,
    };

    const nextUsers = [...users, newUser];
    persistUsers(nextUsers);
    setUser(newUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
  };

  const forgotPassword = async (email: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundUser = users.find((user) => user.email === email);
    if (!foundUser) {
      throw new Error('No account found for that email address.');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      forgotPassword,
      logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
