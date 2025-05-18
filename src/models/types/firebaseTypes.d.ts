// src/types/firebase.ts
import { User } from '@firebase/auth';

export interface FirebaseAuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  tokenExpiry: Date | null;
}

export interface FirebaseAuthContextProps extends FirebaseAuthState {
  authenticate: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

export interface FirebaseProviderProps {
  children: React.ReactNode;
}
