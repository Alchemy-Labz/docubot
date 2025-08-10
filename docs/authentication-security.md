# Authentication & Security Model

## Overview

This application uses a dual authentication system:

1. **Clerk** for user authentication and session management
2. **Firebase Auth** for Firestore database access

## Authentication Flow

### 1. User Authentication

- Users authenticate through Clerk (sign-in/sign-up)
- Clerk provides user session and JWT tokens
- User data is stored in Clerk's system

### 2. Firebase Authentication

- Server generates Firebase custom tokens using Admin SDK
- Client uses custom tokens to authenticate with Firebase
- Firebase auth enables Firestore database access

### 3. Database Access Patterns

#### Server-Side Operations (Admin SDK)

- Use `adminDb` from `@/lib/firebase/firebaseAdmin`
- Bypass Firestore security rules (admin privileges)
- Protected by Clerk's `auth.protect()` in server actions
- Examples: User initialization, document operations, admin functions

#### Client-Side Operations (Client SDK)

- Use `db` from `@/lib/firebase/firebase`
- Subject to Firestore security rules
- Require Firebase authentication via custom tokens
- Examples: Real-time chat, file uploads, user interactions

## Security Rules

### Firestore Security Rules

```javascript
// Users can only access their own data
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
}

// Admins can access all data
allow read, write: if isAdmin();
```

### Server Action Protection

All server actions are protected with:

```typescript
auth.protect();
const { userId } = await auth();
if (!userId) throw new Error('Unauthorized');
```

## Key Security Features

### 1. Authentication Required

- All database operations require authentication
- Server actions use Clerk auth protection
- Client operations use Firebase auth

### 2. User Isolation

- Users can only access their own data
- Firestore rules enforce user-specific access
- Admin users have elevated permissions

### 3. Token Management

- Firebase tokens are generated server-side
- Tokens are stored securely in Firestore
- Automatic token refresh on expiration

### 4. API Route Protection

- Firebase token API requires Clerk authentication
- Middleware protects sensitive routes
- Webhook routes bypass middleware for external services

## Implementation Details

### Protected Server Actions

- `deleteDocument` - Requires auth + subscription check
- `askQuestion` - Requires auth + usage limits
- `initializeUser` - Admin operation
- `validateUsername` - Requires authentication
- `createStripePortal` - Requires auth + Stripe customer

### Client-Side Authentication

- `FirebaseProvider` manages authentication state
- Automatic token refresh and error handling
- Real-time authentication status updates

### Database Operations

- Admin SDK operations for server actions
- Client SDK operations for real-time features
- Proper error handling for auth failures

## Security Best Practices

1. **Always authenticate** before database operations
2. **Use admin SDK** for server-side operations
3. **Implement proper error handling** for auth failures
4. **Follow principle of least privilege** in security rules
5. **Validate user permissions** before sensitive operations
6. **Log security events** for monitoring and debugging
