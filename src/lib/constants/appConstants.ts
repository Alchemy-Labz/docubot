/* eslint-disable import/prefer-default-export */

// Subscription Limits
export const SUBSCRIPTION_LIMITS = {
  FREE: {
    FILE_LIMIT: 3,
    MESSAGE_LIMIT: 5,
  },
  PRO: {
    FILE_LIMIT: 15,
    MESSAGE_LIMIT: 20,
  },
  TEAM: {
    FILE_LIMIT: 100,
    MESSAGE_LIMIT: 50,
  },
} as const;

// Plan Types
export const PLAN_TYPES = {
  STARTER: 'starter',
  PRO: 'pro',
  TEAM: 'team',
} as const;

// Pricing Data
export const PRICING_PLANS = {
  [PLAN_TYPES.STARTER]: {
    id: 'starter',
    name: 'Starter',
    description: 'For individuals exploring DocuBots capabilities',
    pricing: {
      monthly: 'Free',
      annual: 'Free',
      yearlyPrice: null,
    },
    limits: SUBSCRIPTION_LIMITS.FREE,
    features: [
      { title: 'Upload up to 3 documents', included: true },
      { title: '5 AI messages per document', included: true },
      { title: 'File Size Limit: 25MB', included: true },
      { title: 'Basic document analysis', included: true },
      { title: 'Standard email support', included: true },
      { title: 'Delete documents', included: false },
      { title: 'Advanced data exports', included: false },
      { title: 'Priority support', included: false },
    ],
    cta: 'Get Started',
    popular: false,
  },
  [PLAN_TYPES.PRO]: {
    id: 'pro',
    name: 'Professional',
    description: 'For professionals who need more power and flexibility',
    pricing: {
      monthly: '$9.99/mo',
      annual: '$8.33/mo',
      yearlyPrice: null,
    },
    limits: SUBSCRIPTION_LIMITS.PRO,
    features: [
      { title: 'Upload up to 15 documents', included: true },
      { title: 'Up to 20 AI messages per document', included: true },
      { title: 'File Size Limit: 50MB', included: true },
      { title: 'Advanced document analytics', included: true },
      { title: 'Delete documents anytime', included: true },
      { title: 'Advanced data export options', included: true },
      { title: 'Priority email support', included: true },
      { title: 'Access to new features first', included: true },
    ],
    cta: 'Upgrade Now',
    popular: true,
  },
  [PLAN_TYPES.TEAM]: {
    id: 'team',
    name: 'Team',
    description: 'For teams and organizations requiring advanced capabilities',
    pricing: {
      monthly: '$39.99/mo',
      annual: '$33.33/mo',
      yearlyPrice: '$400/year',
    },
    limits: SUBSCRIPTION_LIMITS.TEAM,
    features: [
      { title: 'Upload up to 100 documents', included: true },
      { title: 'Up to 50 AI messages per document', included: true },
      { title: 'File Size Limit: 100MB', included: true },
      { title: 'Advanced document analytics & insights', included: true },
      { title: 'Bulk document processing (up to 25 at once)', included: true },
      { title: 'Team collaboration (up to 25 users)', included: true },
      { title: 'Custom workflows & automation', included: true },
      { title: 'Advanced security & compliance (SOC2, GDPR)', included: true },
      { title: 'Dedicated account manager', included: true },
      { title: 'Custom data retention (up to 5 years)', included: true },
      { title: 'Advanced reporting & team analytics', included: true },
      { title: 'White-label branding options', included: true },
      { title: 'SLA guarantee (99.9% uptime)', included: true },
    ],
    cta: 'Contact Sales',
    popular: false,
    badge: 'Most Powerful',
    highlight: true,
  },
} as const;

// File Upload Settings
export const FILE_UPLOAD = {
  // Legacy max file size (kept for backward compatibility)
  MAX_FILE_SIZE: 15 * 1024 * 1024, // 15MB in bytes

  // Plan-based file size limits
  MAX_FILE_SIZE_BY_PLAN: {
    [PLAN_TYPES.STARTER]: 25 * 1024 * 1024, // 25MB in bytes
    [PLAN_TYPES.PRO]: 50 * 1024 * 1024, // 50MB in bytes
    [PLAN_TYPES.TEAM]: 100 * 1024 * 1024, // 100MB in bytes
  },

  ACCEPTED_FILE_TYPES: {
    'application/pdf': ['.pdf'],
    'text/plain': ['.txt'],
    'text/markdown': ['.md'],
    'text/rtf': ['.rtf'],
  },

  // Utility function to get file size limit for a plan
  getMaxFileSizeForPlan: (planType: string): number => {
    return (
      FILE_UPLOAD.MAX_FILE_SIZE_BY_PLAN[
        planType as keyof typeof FILE_UPLOAD.MAX_FILE_SIZE_BY_PLAN
      ] || FILE_UPLOAD.MAX_FILE_SIZE_BY_PLAN[PLAN_TYPES.STARTER]
    );
  },

  // Utility function to format file size for display
  formatFileSize: (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${Math.round(mb)}MB`;
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
  FILE_TOO_LARGE: "File is too large. Please check your plan's file size limit.",
  INVALID_FILE_TYPE: 'Invalid file type. Please upload a PDF, TXT, MD, or RTF file.',
  UPLOAD_FAILED: 'Upload failed',

  // Plan-specific file size error generator
  FILE_SIZE_EXCEEDED: (planType: string, maxSize: string, fileSize: string) =>
    `File size (${fileSize}) exceeds the ${maxSize} limit for your ${planType} plan. Please upgrade or use a smaller file.`,
  SUBSCRIPTION_LIMIT_REACHED: (planType: string) => {
    if (planType === 'free') {
      return 'You have reached the maximum number of documents. Upgrade to Pro to add more documents.';
    }
    if (planType === 'pro') {
      return 'You have reached the Pro plan document limit. Upgrade to Team for more documents.';
    }
    return 'You have reached the maximum number of documents for your plan.';
  },
  MESSAGE_LIMIT_REACHED: (planType: string, limit: number) =>
    `You have reached the ${planType} limit of ${limit} questions for this document.`,
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
  // Legacy price ID (keeping for backward compatibility)
  PRICE_ID: 'price_1RPxUwL5fHlelvMazFyq1jW4',

  // Plan-specific price IDs
  PRICE_IDS: {
    PRO_MONTHLY: 'price_1RPxUwL5fHlelvMazFyq1jW4',
    PRO_YEARLY: 'price_1RPxZOL5fHlelvMa9zGBMriH',
    TEAM_MONTHLY: 'price_1RuIURL5fHlelvMaMmmAdMfY',
    TEAM_YEARLY: 'price_1RuIURL5fHlelvManBgR8wN1',
  },

  // Map price IDs to plan types
  PRICE_TO_PLAN_MAP: {
    price_1RPxUwL5fHlelvMazFyq1jW4: PLAN_TYPES.PRO,
    price_1RPxZOL5fHlelvMa9zGBMriH: PLAN_TYPES.PRO,
    price_1RuIURL5fHlelvMaMmmAdMfY: PLAN_TYPES.TEAM,
    price_1RuIURL5fHlelvManBgR8wN1: PLAN_TYPES.TEAM,
  },

  // Coupon/Promo codes
  COUPONS: {
    PHLAUNCH20: 'promo_1RuILnL5fHlelvMaG25MFC6E',
    AJSHIPS20: 'promo_1RuIm2L5fHlelvMaQz2WSsyQ',
  },

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
