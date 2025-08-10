'use server';

import { adminDb } from '@/lib/firebase/firebaseAdmin';
import { auth } from '@clerk/nextjs/server';

/**
 * Validates if a username is available and meets requirements
 */
export async function validateUsername(
  username: string,
  options: { skipAvailabilityCheck?: boolean; excludeUserId?: string } = {}
): Promise<{
  isValid: boolean;
  isAvailable: boolean;
  message?: string;
}> {
  // Protect this action - require authentication for username validation
  try {
    auth.protect();
    const { userId } = await auth();
    if (!userId) {
      return {
        isValid: false,
        isAvailable: false,
        message: 'Authentication required',
      };
    }
  } catch (error) {
    return {
      isValid: false,
      isAvailable: false,
      message: 'Authentication failed',
    };
  }

  // Basic validation
  if (!username) {
    return {
      isValid: false,
      isAvailable: false,
      message: 'Username is required',
    };
  }

  // Username requirements
  const minLength = 3;
  const maxLength = 30;
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;

  if (username.length < minLength) {
    return {
      isValid: false,
      isAvailable: false,
      message: `Username must be at least ${minLength} characters long`,
    };
  }

  if (username.length > maxLength) {
    return {
      isValid: false,
      isAvailable: false,
      message: `Username must be no more than ${maxLength} characters long`,
    };
  }

  if (!usernameRegex.test(username)) {
    return {
      isValid: false,
      isAvailable: false,
      message: 'Username can only contain letters, numbers, hyphens, and underscores',
    };
  }

  // Reserved usernames
  const reservedUsernames = [
    'admin',
    'administrator',
    'root',
    'api',
    'www',
    'mail',
    'ftp',
    'support',
    'help',
    'info',
    'contact',
    'about',
    'privacy',
    'terms',
    'docubot',
    'system',
    'user',
    'guest',
    'test',
    'demo',
    'null',
    'undefined',
    'true',
    'false',
    'settings',
    'dashboard',
    'profile',
    'account',
    'billing',
    'subscription',
    'upgrade',
    'download',
  ];

  if (reservedUsernames.includes(username.toLowerCase())) {
    return {
      isValid: false,
      isAvailable: false,
      message: 'This username is reserved and cannot be used',
    };
  }

  // Skip availability check if requested (e.g., for Clerk webhook signups)
  if (options.skipAvailabilityCheck) {
    return {
      isValid: true,
      isAvailable: true,
      message: 'Username format is valid',
    };
  }

  try {
    // Check if username is already taken
    let usersQuery = adminDb.collection('users').where('username', '==', username).limit(1);

    const querySnapshot = await usersQuery.get();

    if (!querySnapshot.empty) {
      // If we have an excludeUserId, check if the existing user is the same user
      if (options.excludeUserId) {
        const existingUser = querySnapshot.docs[0];
        if (existingUser.id === options.excludeUserId) {
          // Username belongs to the same user, so it's available for them
          return {
            isValid: true,
            isAvailable: true,
            message: 'Username is available',
          };
        }
      }

      return {
        isValid: true,
        isAvailable: false,
        message: 'This username is already taken',
      };
    }

    return {
      isValid: true,
      isAvailable: true,
      message: 'Username is available',
    };
  } catch (error) {
    console.error('Error validating username:', error);
    return {
      isValid: false,
      isAvailable: false,
      message: 'Error validating username. Please try again.',
    };
  }
}

/**
 * Generates username suggestions based on a base name
 */
export async function generateUsernameSuggestions(baseName: string): Promise<string[]> {
  if (!baseName) return [];

  // Clean the base name
  const cleanBase = baseName
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 20);

  if (!cleanBase) return [];

  const suggestions: string[] = [];
  const maxSuggestions = 5;

  // Try the base name first
  const baseValidation = await validateUsername(cleanBase);
  if (baseValidation.isAvailable) {
    suggestions.push(cleanBase);
  }

  // Generate variations
  const variations = [
    `${cleanBase}_user`,
    `${cleanBase}123`,
    `${cleanBase}_${Math.floor(Math.random() * 1000)}`,
    `user_${cleanBase}`,
    `${cleanBase}_${new Date().getFullYear()}`,
  ];

  for (const variation of variations) {
    if (suggestions.length >= maxSuggestions) break;

    const validation = await validateUsername(variation);
    if (validation.isAvailable) {
      suggestions.push(variation);
    }
  }

  return suggestions;
}
