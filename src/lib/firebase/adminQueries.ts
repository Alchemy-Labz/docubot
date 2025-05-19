// src/lib/firebase/adminQueries.ts
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  doc,
  updateDoc,
  where,
  Timestamp,
  getFirestore,
} from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Helper function to ensure we have a valid Firestore instance
const getFirestoreInstance = () => {
  try {
    // Get or initialize Firebase app
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

    // Get Firestore instance
    const db = getFirestore(app);

    return db;
  } catch (error) {
    console.error('Failed to get Firestore instance:', error);
    throw new Error('Database connection failed');
  }
};

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
  contactMethod: 'email' | 'phone' | 'both';
  marketingOptIn: boolean;
  createdAt: Timestamp;
  status: 'new' | 'contacted' | 'resolved';
  responded: boolean;
}

export interface SupportTicket {
  id: string;
  name: string;
  email: string;
  subject: string;
  category: 'technical' | 'billing' | 'feature' | 'other';
  priority: 'low' | 'medium' | 'high';
  message: string;
  userId?: string;
  ticketNumber: string;
  createdAt: Timestamp;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  lastUpdated: Timestamp;
  assignedTo?: string;
  resolution?: string;
}

export interface AdminQueryOptions {
  limitCount?: number;
  lastDoc?: any;
  status?: string;
  category?: string;
  priority?: string;
}

// Fetch contact submissions with pagination and filtering
export const fetchContactSubmissions = async (
  options: AdminQueryOptions = {}
): Promise<{ submissions: ContactSubmission[]; lastDoc: any }> => {
  try {
    const { limitCount = 20, lastDoc, status } = options;
    const firestore = getFirestoreInstance();
    const contactCollection = collection(firestore, 'contact-submissions');

    let q = query(contactCollection, orderBy('createdAt', 'desc'), limit(limitCount));

    if (status) {
      q = query(
        contactCollection,
        where('status', '==', status),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    }

    if (lastDoc) {
      q = query(
        contactCollection,
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(limitCount)
      );
    }

    const querySnapshot = await getDocs(q);
    const submissions: ContactSubmission[] = [];

    querySnapshot.forEach((doc) => {
      submissions.push({
        id: doc.id,
        ...doc.data(),
      } as ContactSubmission);
    });

    const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

    return { submissions, lastDoc: newLastDoc };
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    throw new Error('Failed to fetch contact submissions');
  }
};

// Fetch support tickets with pagination and filtering
export const fetchSupportTickets = async (
  options: AdminQueryOptions = {}
): Promise<{ tickets: SupportTicket[]; lastDoc: any }> => {
  try {
    const { limitCount = 20, lastDoc, status, category, priority } = options;
    const firestore = getFirestoreInstance();
    const ticketsCollection = collection(firestore, 'support-tickets');

    let q = query(ticketsCollection, orderBy('createdAt', 'desc'), limit(limitCount));

    // Apply filters
    if (status) {
      q = query(
        ticketsCollection,
        where('status', '==', status),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    }
    if (category) {
      q = query(
        ticketsCollection,
        where('category', '==', category),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    }
    if (priority) {
      q = query(
        ticketsCollection,
        where('priority', '==', priority),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    }

    if (lastDoc) {
      q = query(
        ticketsCollection,
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(limitCount)
      );
    }

    const querySnapshot = await getDocs(q);
    const tickets: SupportTicket[] = [];

    querySnapshot.forEach((doc) => {
      tickets.push({
        id: doc.id,
        ...doc.data(),
      } as SupportTicket);
    });

    const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

    return { tickets, lastDoc: newLastDoc };
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    throw new Error('Failed to fetch support tickets');
  }
};

// Update contact submission status
export const updateContactSubmissionStatus = async (
  submissionId: string,
  status: 'new' | 'contacted' | 'resolved',
  responded: boolean = false
): Promise<void> => {
  try {
    const firestore = getFirestoreInstance();
    const submissionRef = doc(firestore, 'contact-submissions', submissionId);
    await updateDoc(submissionRef, {
      status,
      responded,
      lastUpdated: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating contact submission status:', error);
    throw new Error('Failed to update contact submission status');
  }
};

// Update support ticket
export const updateSupportTicket = async (
  ticketId: string,
  updates: Partial<Pick<SupportTicket, 'status' | 'assignedTo' | 'resolution'>>
): Promise<void> => {
  try {
    const firestore = getFirestoreInstance();
    const ticketRef = doc(firestore, 'support-tickets', ticketId);
    await updateDoc(ticketRef, {
      ...updates,
      lastUpdated: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating support ticket:', error);
    throw new Error('Failed to update support ticket');
  }
};

// Get stats for dashboard
export const getAdminStats = async (): Promise<{
  totalContacts: number;
  totalTickets: number;
  openTickets: number;
  pendingContacts: number;
}> => {
  try {
    const firestore = getFirestoreInstance();

    // Get total contacts
    const contactsQuery = query(collection(firestore, 'contact-submissions'));
    const contactsSnapshot = await getDocs(contactsQuery);
    const totalContacts = contactsSnapshot.size;

    // Get pending contacts
    const pendingContactsQuery = query(
      collection(firestore, 'contact-submissions'),
      where('status', '==', 'new')
    );
    const pendingContactsSnapshot = await getDocs(pendingContactsQuery);
    const pendingContacts = pendingContactsSnapshot.size;

    // Get total tickets
    const ticketsQuery = query(collection(firestore, 'support-tickets'));
    const ticketsSnapshot = await getDocs(ticketsQuery);
    const totalTickets = ticketsSnapshot.size;

    // Get open tickets
    const openTicketsQuery = query(
      collection(firestore, 'support-tickets'),
      where('status', 'in', ['open', 'in-progress'])
    );
    const openTicketsSnapshot = await getDocs(openTicketsQuery);
    const openTickets = openTicketsSnapshot.size;

    return {
      totalContacts,
      totalTickets,
      openTickets,
      pendingContacts,
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    throw new Error('Failed to fetch admin stats');
  }
};
