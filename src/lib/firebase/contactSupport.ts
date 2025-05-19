// src/lib/firebase/contactSupport.ts
import { collection, addDoc, serverTimestamp, getFirestore } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
  contactMethod: 'email' | 'phone' | 'both';
  marketingOptIn: boolean;
}

export interface SupportTicketData {
  name: string;
  email: string;
  subject: string;
  category: 'technical' | 'billing' | 'feature' | 'other';
  priority: 'low' | 'medium' | 'high';
  message: string;
  userId?: string;
}

export interface ContactSubmissionResult {
  success: boolean;
  id?: string;
  error?: string;
}

export interface SupportTicketResult {
  success: boolean;
  ticketId?: string;
  error?: string;
}

// Helper function to ensure we have a valid Firestore instance
const getFirestoreInstance = () => {
  try {
    return db || getFirestore();
  } catch (error) {
    console.error('Failed to get Firestore instance:', error);
    throw new Error('Database connection failed');
  }
};

// Helper function to remove undefined values from an object
const sanitizeData = (data: Record<string, any>): Record<string, any> => {
  const sanitized: Record<string, any> = {};
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      sanitized[key] = value;
    }
  });
  return sanitized;
};

// Submit contact form to Firebase
export const submitContactForm = async (
  formData: ContactFormData
): Promise<ContactSubmissionResult> => {
  try {
    const firestore = getFirestoreInstance();
    const contactCollection = collection(firestore, 'contact-submissions');

    // Sanitize the form data to remove undefined/empty values
    const sanitizedData = sanitizeData({
      ...formData,
      createdAt: serverTimestamp(),
      status: 'new',
      responded: false,
    });

    const docRef = await addDoc(contactCollection, sanitizedData);

    return {
      success: true,
      id: docRef.id,
    };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

// Submit support ticket to Firebase
export const submitSupportTicket = async (
  ticketData: SupportTicketData
): Promise<SupportTicketResult> => {
  try {
    const firestore = getFirestoreInstance();
    const supportCollection = collection(firestore, 'support-tickets');

    // Generate a readable ticket ID
    const ticketNumber = `DOCU-${Date.now().toString().slice(-6)}`;

    // Prepare the data object with all fields
    const dataToStore = {
      ...ticketData,
      ticketNumber,
      createdAt: serverTimestamp(),
      status: 'open',
      lastUpdated: serverTimestamp(),
      assignedTo: null,
      resolution: null,
    };

    // Sanitize the data to remove undefined values
    const sanitizedData = sanitizeData(dataToStore);

    const docRef = await addDoc(supportCollection, sanitizedData);

    return {
      success: true,
      ticketId: ticketNumber,
    };
  } catch (error) {
    console.error('Error submitting support ticket:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
