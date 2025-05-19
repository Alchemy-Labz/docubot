// TypeScript interfaces for contact and support forms
// Add this to src/types/forms.ts or similar location

export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  inquiryType: 'general' | 'sales' | 'technical' | 'media' | 'career' | 'feedback';
  message: string;
  timestamp: Date;
  status: 'new' | 'in-progress' | 'resolved' | 'closed';
  source: 'contact-page';
  assignedTo?: string;
  priority?: 'low' | 'medium' | 'high';
  notes?: string[];
  lastUpdated?: Date;
}

export interface SupportTicket {
  id?: string;
  ticketNumber: string;
  name: string;
  email: string;
  subject: string;
  category: 'technical' | 'billing' | 'account' | 'feature' | 'performance' | 'other';
  priority: 'low' | 'medium' | 'high';
  message: string;
  deviceInfo?: string;
  steps?: string;
  attachmentDescription?: string;
  timestamp: Date;
  status: 'open' | 'in-progress' | 'waiting-for-customer' | 'resolved' | 'closed';
  source: 'support-page';
  userId?: string;
  assignedTo?: string;
  resolution?: string;
  resolutionTimestamp?: Date;
  userAgent?: string;
  url?: string;
  tags?: string[];
  lastUpdated?: Date;
  customerSatisfaction?: 1 | 2 | 3 | 4 | 5;
}

export interface InquiryType {
  value: string;
  label: string;
  description?: string;
}

export interface SupportCategory {
  value: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export interface Priority {
  value: string;
  label: string;
  description: string;
  color: string;
}

// Form validation types
export interface ContactFormErrors {
  name?: string;
  email?: string;
  subject?: string;
  inquiryType?: string;
  message?: string;
}

export interface SupportFormErrors {
  name?: string;
  email?: string;
  subject?: string;
  category?: string;
  message?: string;
}

// API response types
export interface FormSubmissionResponse {
  success: boolean;
  message: string;
  ticketNumber?: string;
  error?: string;
}
