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

// User Document Schema
export interface UserDocument {
  // Core identification
  clerkId: string;
  email: string;

  // Personal information
  firstName: string;
  lastName: string;
  username: string;

  // Computed fields
  name: string; // Full name (firstName + lastName)

  // Subscription and billing
  planType: 'starter' | 'pro' | 'team';
  stripecustomerId?: string | null;

  // Timestamps
  registrationDate: Date;
  lastLogin: Date;
  lastTokenRefresh: Date;
  createdAt: Date;
  lastUpdated: Date;

  // Initialization tracking
  isUserInitialized: boolean;
}

// Input data for user initialization
export interface UserInitializationData {
  email?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  clerkId?: string;
  isSignup?: boolean;
}

// Response from user initialization
export interface UserInitializationResponse {
  success: boolean;
  needsOnboarding: boolean;
  message?: string;
  missingFields?: string[];
}
