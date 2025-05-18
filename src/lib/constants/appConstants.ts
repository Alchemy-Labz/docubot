/* eslint-disable import/prefer-default-export */

// Subscription Limits
export const SUBSCRIPTION_LIMITS = {
  FREE: {
    FILE_LIMIT: 5,
    MESSAGE_LIMIT: 3,
  },
  PRO: {
    FILE_LIMIT: 12,
    MESSAGE_LIMIT: 15,
  },
} as const;

// File Upload Settings
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 15 * 1024 * 1024, // 15MB in bytes
  ACCEPTED_FILE_TYPES: {
    'application/pdf': ['.pdf'],
    'text/plain': ['.txt'],
    'text/markdown': ['.md'],
    'text/rtf': ['.rtf'],
  },
} as const;

// Firebase Settings
export const FIREBASE_CONFIG = {
  CUSTOM_TOKEN_EXPIRY: 60 * 60 * 24 * 30 * 1000, // 30 days in milliseconds
  TOKEN_REFRESH_BUFFER: 5 * 60 * 1000, // 5 minutes in milliseconds
  TOKEN_SAFETY_MARGIN: 55 * 60 * 1000, // 55 minutes in milliseconds
  TOKEN_EXPIRY_SECONDS: 60 * 60 * 24 * 30, // 30 days in seconds
} as const;

// Chat Settings
export const CHAT_CONFIG = {
  HISTORY_LIMIT: 6, // Number of previous messages to include in context
  SCROLL_BEHAVIOR: 'smooth' as ScrollBehavior,
} as const;

// OpenAI Settings
export const OPENAI_CONFIG = {
  MODEL_NAME: 'gpt-4o-mini',
  MAX_DURATION: 30, // seconds
} as const;

// Pinecone Settings
export const PINECONE_CONFIG = {
  INDEX_NAME: 'docubot',
} as const;

// UI Settings
export const UI_CONFIG = {
  MOBILE_BREAKPOINT: 768, // pixels
  TABLET_BREAKPOINT: 1024, // pixels
  THEME_TRANSITION_DISABLED: false,
} as const;

// File Type Icons
export const FILE_TYPE_ICONS = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'text/plain': 'txt',
  'text/markdown': 'md',
  'text/rtf': 'rtf',
} as const;

// Default file icon for unsupported types
export const DEFAULT_FILE_ICON = 'document';

// File Type Labels
export const FILE_TYPE_LABELS = {
  'application/pdf': 'PDF',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'text/plain': 'TXT',
  'text/markdown': 'MD',
  'text/rtf': 'RTF',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'User authentication failed',
  FILE_TOO_LARGE: 'File is too large. Maximum size is 15MB.',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload a PDF, TXT, MD, or RTF file.',
  UPLOAD_FAILED: 'Upload failed',
  SUBSCRIPTION_LIMIT_REACHED:
    'You have reached the maximum number of documents. Upgrade to Pro to add more documents.',
  MESSAGE_LIMIT_REACHED: (hasActiveMembership: boolean, limit: number) =>
    `You have reached the ${hasActiveMembership ? 'pro' : 'free'} limit of ${limit} questions for this document.`,
  DOCUMENT_NOT_FOUND: 'Document data not found',
  DOWNLOAD_URL_NOT_FOUND: 'Download URL not found',
  UNSUPPORTED_FILE_TYPE: (fileType: string) => `Unsupported file type: ${fileType}`,
  NO_USER_LOGGED_IN: 'No user logged in',
  NO_PINECONE_VECTOR_STORE: 'No Pinecone Vector Store found',
  STRIPE_CUSTOMER_NOT_FOUND: 'No Stripe customer ID found',
  FIREBASE_TOKEN_NOT_FOUND: 'Firebase token not found',
  NO_FILE_PROVIDED: 'No file provided',
  FAILED_TO_FETCH_PDF: 'Failed to fetch PDF',
  INVALID_FIREBASE_SERVICE_KEY: 'Invalid Firebase service key format',
  FIREBASE_SERVICE_KEY_NOT_DEFINED: 'Firebase service key is not defined',
  FAILED_TO_FETCH_DOCUMENT: 'Failed to fetch document',
  FAILED_TO_LOAD_PDF_DOCUMENT: 'Failed to load PDF document',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  DOCUMENT_CONSUMED: (fileType: string, fileName: string) =>
    `DocuBot has consumed the ${fileType}: ${fileName}`,
  QUESTION_PROCESSED: 'Question processed successfully!',
  MEMBERSHIP_ACTIVATED: 'Membership activated successfully',
  DOCUMENT_DELETED: 'Document deleted successfully',
  WEBHOOK_PROCESSED: 'Webhook processed successfully',
  FIREBASE_TOKEN_GENERATED: 'Firebase token generated and stored',
} as const;

// Stripe Configuration
export const STRIPE_CONFIG = {
  PRICE_ID: 'price_1RPxUwL5fHlelvMazFyq1jW4',
  WEBHOOK_EVENTS: {
    CHECKOUT_SESSION_COMPLETED: 'checkout.session.completed',
    CUSTOMER_SUBSCRIPTION_CREATED: 'customer.subscription.created',
    CUSTOMER_SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
    CUSTOMER_SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
    INVOICE_PAYMENT_SUCCEEDED: 'invoice.payment_succeeded',
    INVOICE_PAYMENT_FAILED: 'invoice.payment_failed',
  },
  SUBSCRIPTION_STATUSES: {
    ACTIVE: 'active',
    TRIALING: 'trialing',
  },
} as const;
