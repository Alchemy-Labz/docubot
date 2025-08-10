// src/components/Admin/AdminDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useFirebaseAuth } from '@/providers/FirebaseContext';
import {
  Users,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Mail,
  Phone,
  ExternalLink,
  Loader2,
  Eye,
  User,
  Calendar,
  Tag,
  AlertTriangle,
  Briefcase,
  DollarSign,
  Building2,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  updateContactSubmissionStatus,
  updateSupportTicket,
  getAdminStats,
} from '@/lib/firebase/adminQueries';
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import toast from 'react-hot-toast';

interface AdminStats {
  totalContacts: number;
  totalTickets: number;
  openTickets: number;
  pendingContacts: number;
  careerApplications: number;
  investorInquiries: number;
}

interface CareerApplication {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  experience: string;
  location?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  expectedSalary?: string;
  startDate?: string;
  coverLetter: string;
  resumeDescription?: string;
  timestamp: any;
  status: 'new' | 'reviewing' | 'interview' | 'hired' | 'rejected';
  applicationId: string;
  source: string;
}

interface InvestorInquiry {
  id: string;
  name: string;
  email: string;
  company: string;
  position?: string;
  phone?: string;
  investorType: string;
  investmentRange?: string;
  investmentTimeline?: string;
  areasOfInterest?: string;
  experience?: string;
  message: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  timestamp: any;
  status: 'new' | 'contacted' | 'meeting-scheduled' | 'declined' | 'completed';
  inquiryId: string;
  source: string;
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
  contactMethod: 'email' | 'phone' | 'both';
  marketingOptIn: boolean;
  createdAt: any;
  status: 'new' | 'contacted' | 'resolved';
  responded: boolean;
}

interface SupportTicket {
  id: string;
  name: string;
  email: string;
  subject: string;
  category: 'technical' | 'billing' | 'feature' | 'other';
  priority: 'low' | 'medium' | 'high';
  message: string;
  userId?: string;
  ticketNumber: string;
  createdAt: any;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  lastUpdated: any;
  assignedTo?: string;
  resolution?: string;
}

const AdminDashboard: React.FC = () => {
  const { user, isLoaded } = useUser();
  const { isAuthenticated: isFirebaseAuthenticated } = useFirebaseAuth();
  const router = useRouter();

  // Check admin access
  const isAdmin = user?.publicMetadata?.isAdmin === true;

  // Stats
  const [stats, setStats] = useState<AdminStats>({
    totalContacts: 0,
    totalTickets: 0,
    openTickets: 0,
    pendingContacts: 0,
    careerApplications: 0,
    investorInquiries: 0,
  });

  // Contact submissions
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [contactsFilters, setContactsFilters] = useState({
    status: 'all',
    search: '',
  });

  // Support tickets
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [ticketsFilters, setTicketsFilters] = useState({
    status: 'all',
    category: 'all',
    priority: 'all',
    search: '',
  });

  // Career applications
  const [careerApplications, setCareerApplications] = useState<CareerApplication[]>([]);
  const [careersLoading, setCareersLoading] = useState(true);
  const [careersFilters, setCareersFilters] = useState({
    status: 'all',
    position: 'all',
    search: '',
  });

  // Investor inquiries
  const [investorInquiries, setInvestorInquiries] = useState<InvestorInquiry[]>([]);
  const [investorsLoading, setInvestorsLoading] = useState(true);
  const [investorsFilters, setInvestorsFilters] = useState({
    status: 'all',
    investorType: 'all',
    search: '',
  });

  // Dialog states
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [selectedCareerApp, setSelectedCareerApp] = useState<CareerApplication | null>(null);
  const [selectedInvestorInquiry, setSelectedInvestorInquiry] = useState<InvestorInquiry | null>(
    null
  );
  const [isUpdating, setIsUpdating] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (isLoaded && !isAdmin) {
      router.push('/dashboard');
      toast.error('Access denied. Admin privileges required.');
    }
  }, [isLoaded, isAdmin, router]);

  // Load initial data
  useEffect(() => {
    if (isAdmin && isFirebaseAuthenticated) {
      const timer = setTimeout(() => {
        loadAdminStats();
        loadContactSubmissions();
        loadSupportTickets();
        loadCareerApplications();
        loadInvestorInquiries();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isAdmin, isFirebaseAuthenticated]);

  const loadAdminStats = async () => {
    try {
      const adminStats = await getAdminStats();
      // Load additional stats for career applications and investor inquiries
      const careerQuery = query(
        collection(db, 'career-applications'),
        orderBy('timestamp', 'desc')
      );
      const investorQuery = query(
        collection(db, 'investor-inquiries'),
        orderBy('timestamp', 'desc')
      );
      const supportQuery = query(
        collection(db, 'support-tickets'),
        orderBy('timestamp', 'desc')
      );
      const contactQuery = query(
        collection(db, 'contact-submissions'),
        orderBy('timestamp', 'desc')
      );

      const [careerSnapshot, investorSnapshot, supportSnapshot, contactSnapshot] = await Promise.all([
        getDocs(careerQuery),
        getDocs(investorQuery),
        getDocs(supportQuery),
        getDocs(contactQuery),
      ]);

      setStats({
        ...adminStats,
        careerApplications: careerSnapshot.size,
        investorInquiries: investorSnapshot.size,
        totalTickets: supportSnapshot.size,
        openTickets: supportSnapshot.docs.filter((doc) => {
          const data = doc.data();
          return data.status === 'open' || data.status === 'in-progress';
        }).length,
        totalContacts: contactSnapshot.size,
        pendingContacts: contactSnapshot.docs.filter((doc) => {
          const data = doc.data();
          return data.status === 'new';
        }).length,
      });
    } catch (error) {
      console.error('Error loading admin stats:', error);
      toast.error('Failed to load dashboard stats');
    }
  };

  const loadContactSubmissions = async () => {
    try {
      setContactsLoading(true);
      const q = query(
        collection(db, 'contact-submissions'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const querySnapshot = await getDocs(q);
      const submissions: ContactSubmission[] = [];

      querySnapshot.forEach((doc) => {
        submissions.push({
          id: doc.id,
          ...doc.data(),
        } as ContactSubmission);
      });

      setContactSubmissions(submissions);
    } catch (error) {
      console.error('Error loading contact submissions:', error);
      toast.error('Failed to load contact submissions');
    } finally {
      setContactsLoading(false);
    }
  };

  const loadSupportTickets = async () => {
    try {
      setTicketsLoading(true);
      const q = query(collection(db, 'support-tickets'), orderBy('createdAt', 'desc'), limit(50));
      const querySnapshot = await getDocs(q);
      const tickets: SupportTicket[] = [];

      querySnapshot.forEach((doc) => {
        tickets.push({
          id: doc.id,
          ...doc.data(),
        } as SupportTicket);
      });

      setSupportTickets(tickets);
    } catch (error) {
      console.error('Error loading support tickets:', error);
      toast.error('Failed to load support tickets');
    } finally {
      setTicketsLoading(false);
    }
  };

  const loadCareerApplications = async () => {
    try {
      setCareersLoading(true);
      const q = query(
        collection(db, 'career-applications'),
        orderBy('timestamp', 'desc'),
        limit(50)
      );
      const querySnapshot = await getDocs(q);
      const applications: CareerApplication[] = [];

      querySnapshot.forEach((doc) => {
        applications.push({
          id: doc.id,
          ...doc.data(),
        } as CareerApplication);
      });

      setCareerApplications(applications);
    } catch (error) {
      console.error('Error loading career applications:', error);
      toast.error('Failed to load career applications');
    } finally {
      setCareersLoading(false);
    }
  };

  const loadInvestorInquiries = async () => {
    try {
      setInvestorsLoading(true);
      const q = query(
        collection(db, 'investor-inquiries'),
        orderBy('timestamp', 'desc'),
        limit(50)
      );
      const querySnapshot = await getDocs(q);
      const inquiries: InvestorInquiry[] = [];

      querySnapshot.forEach((doc) => {
        inquiries.push({
          id: doc.id,
          ...doc.data(),
        } as InvestorInquiry);
      });

      setInvestorInquiries(inquiries);
    } catch (error) {
      console.error('Error loading investor inquiries:', error);
      toast.error('Failed to load investor inquiries');
    } finally {
      setInvestorsLoading(false);
    }
  };

  const updateCareerApplicationStatus = async (applicationId: string, status: string) => {
    try {
      setIsUpdating(true);
      const applicationRef = doc(db, 'career-applications', applicationId);
      await updateDoc(applicationRef, {
        status,
        lastUpdated: Timestamp.now(),
      });

      // Reload applications
      await loadCareerApplications();
      toast.success('Application status updated successfully');
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    } finally {
      setIsUpdating(false);
    }
  };

  const updateInvestorInquiryStatus = async (inquiryId: string, status: string) => {
    try {
      setIsUpdating(true);
      const inquiryRef = doc(db, 'investor-inquiries', inquiryId);
      await updateDoc(inquiryRef, {
        status,
        lastUpdated: Timestamp.now(),
      });

      // Reload inquiries
      await loadInvestorInquiries();
      toast.success('Inquiry status updated successfully');
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      toast.error('Failed to update inquiry status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-accent2/20 text-accent2 dark:bg-accent/20 dark:text-accent';
      case 'reviewing':
      case 'contacted':
        return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400';
      case 'interview':
      case 'meeting-scheduled':
        return 'bg-blue-500/20 text-blue-600 dark:text-blue-400';
      case 'hired':
      case 'completed':
        return 'bg-green-500/20 text-green-600 dark:text-green-400';
      case 'rejected':
      case 'declined':
        return 'bg-red-500/20 text-red-600 dark:text-red-400';
      default:
        return 'bg-light-500/20 text-dark-600 dark:text-light-400';
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Filter functions
  const filteredContacts = contactSubmissions.filter((contact) => {
    const statusMatch =
      contactsFilters.status === 'all' || contact.status === contactsFilters.status;
    const searchMatch =
      contactsFilters.search === '' ||
      contact.name.toLowerCase().includes(contactsFilters.search.toLowerCase()) ||
      contact.email.toLowerCase().includes(contactsFilters.search.toLowerCase()) ||
      contact.subject.toLowerCase().includes(contactsFilters.search.toLowerCase());

    return statusMatch && searchMatch;
  });

  const filteredTickets = supportTickets.filter((ticket) => {
    const statusMatch = ticketsFilters.status === 'all' || ticket.status === ticketsFilters.status;
    const categoryMatch =
      ticketsFilters.category === 'all' || ticket.category === ticketsFilters.category;
    const priorityMatch =
      ticketsFilters.priority === 'all' || ticket.priority === ticketsFilters.priority;
    const searchMatch =
      ticketsFilters.search === '' ||
      ticket.name.toLowerCase().includes(ticketsFilters.search.toLowerCase()) ||
      ticket.email.toLowerCase().includes(ticketsFilters.search.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(ticketsFilters.search.toLowerCase());

    return statusMatch && categoryMatch && priorityMatch && searchMatch;
  });

  const filteredCareers = careerApplications.filter((app) => {
    const statusMatch = careersFilters.status === 'all' || app.status === careersFilters.status;
    const positionMatch =
      careersFilters.position === 'all' || app.position === careersFilters.position;
    const searchMatch =
      careersFilters.search === '' ||
      app.name.toLowerCase().includes(careersFilters.search.toLowerCase()) ||
      app.email.toLowerCase().includes(careersFilters.search.toLowerCase()) ||
      app.position.toLowerCase().includes(careersFilters.search.toLowerCase());

    return statusMatch && positionMatch && searchMatch;
  });

  const filteredInvestors = investorInquiries.filter((inquiry) => {
    const statusMatch =
      investorsFilters.status === 'all' || inquiry.status === investorsFilters.status;
    const typeMatch =
      investorsFilters.investorType === 'all' ||
      inquiry.investorType === investorsFilters.investorType;
    const searchMatch =
      investorsFilters.search === '' ||
      inquiry.name.toLowerCase().includes(investorsFilters.search.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(investorsFilters.search.toLowerCase()) ||
      inquiry.company.toLowerCase().includes(investorsFilters.search.toLowerCase());

    return statusMatch && typeMatch && searchMatch;
  });

  if (!isLoaded) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-accent2/20 to-accent/20 dark:from-accent3/20 dark:to-accent4/20'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className='mb-8 text-3xl font-bold text-dark-800 dark:text-light-300'>
            Admin Dashboard
          </h1>

          {/* Stats Cards */}
          <div className='mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            <Card className='bg-light-400/30 shadow-lg shadow-dark-900/30 ring-1 ring-accent2/80 drop-shadow-md dark:bg-dark-700/50 dark:ring-accent/80'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Contact Submissions</CardTitle>
                <MessageSquare className='h-4 w-4 text-accent2 dark:text-accent' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-dark-800 dark:text-light-300'>
                  {stats.totalContacts}
                </div>
                <p className='text-xs text-dark-600 dark:text-light-400'>
                  {stats.pendingContacts} pending responses
                </p>
              </CardContent>
            </Card>

            <Card className='bg-light-400/30 shadow-lg shadow-dark-900/30 ring-1 ring-accent2/80 drop-shadow-md dark:bg-dark-700/50 dark:ring-accent/80'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Support Tickets</CardTitle>
                <AlertCircle className='h-4 w-4 text-accent2 dark:text-accent' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-dark-800 dark:text-light-300'>
                  {stats.totalTickets}
                </div>
                <p className='text-xs text-dark-600 dark:text-light-400'>
                  {stats.openTickets} open tickets
                </p>
              </CardContent>
            </Card>

            <Card className='bg-light-400/30 shadow-lg shadow-dark-900/30 ring-1 ring-accent2/80 drop-shadow-md dark:bg-dark-700/50 dark:ring-accent/80'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Career Applications</CardTitle>
                <Briefcase className='h-4 w-4 text-accent2 dark:text-accent' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-dark-800 dark:text-light-300'>
                  {stats.careerApplications}
                </div>
                <p className='text-xs text-dark-600 dark:text-light-400'>
                  Total applications received
                </p>
              </CardContent>
            </Card>

            <Card className='bg-light-400/30 shadow-lg shadow-dark-900/30 ring-1 ring-accent2/80 drop-shadow-md dark:bg-dark-700/50 dark:ring-accent/80'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Investor Inquiries</CardTitle>
                <DollarSign className='h-4 w-4 text-accent2 dark:text-accent' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-dark-800 dark:text-light-300'>
                  {stats.investorInquiries}
                </div>
                <p className='text-xs text-dark-600 dark:text-light-400'>
                  Investment opportunities
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue='contacts' className='space-y-4'>
            <TabsList className='grid w-full grid-cols-4'>
              <TabsTrigger value='contacts'>Contact Submissions</TabsTrigger>
              <TabsTrigger value='tickets'>Support Tickets</TabsTrigger>
              <TabsTrigger value='careers'>Career Applications</TabsTrigger>
              <TabsTrigger value='investors'>Investor Inquiries</TabsTrigger>
            </TabsList>

            {/* Contact Submissions Tab */}
            <TabsContent value='contacts' className='space-y-4'>
              {/* Filters */}
              <Card className='bg-light-400/30 shadow-lg shadow-dark-900/30 ring-1 ring-accent2/80 drop-shadow-md dark:bg-dark-700/50 dark:ring-accent/80'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Filter className='h-5 w-5' />
                    Contact Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid gap-4 md:grid-cols-3'>
                    <div className='space-y-2'>
                      <Label htmlFor='contact-status'>Status</Label>
                      <Select
                        value={contactsFilters.status}
                        onValueChange={(value) =>
                          setContactsFilters((prev) => ({ ...prev, status: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='All statuses' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='all'>All statuses</SelectItem>
                          <SelectItem value='new'>New</SelectItem>
                          <SelectItem value='contacted'>Contacted</SelectItem>
                          <SelectItem value='resolved'>Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='contact-search'>Search</Label>
                      <div className='relative'>
                        <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                        <Input
                          id='contact-search'
                          placeholder='Search contacts...'
                          value={contactsFilters.search}
                          onChange={(e) =>
                            setContactsFilters((prev) => ({ ...prev, search: e.target.value }))
                          }
                          className='pl-8'
                        />
                      </div>
                    </div>
                    <div className='flex items-end'>
                      <Button
                        onClick={loadContactSubmissions}
                        variant='outline'
                        className='w-full'
                      >
                        <RefreshCw className='mr-2 h-4 w-4' />
                        Refresh
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Submissions List */}
              <Card className='bg-light-400/30 shadow-lg shadow-dark-900/30 ring-1 ring-accent2/80 drop-shadow-md dark:bg-dark-700/50 dark:ring-accent/80'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <MessageSquare className='h-5 w-5' />
                    Contact Submissions ({filteredContacts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {contactsLoading ? (
                    <div className='flex items-center justify-center py-8'>
                      <Loader2 className='h-8 w-8 animate-spin' />
                    </div>
                  ) : filteredContacts.length === 0 ? (
                    <div className='flex items-center justify-center py-8 text-dark-600 dark:text-light-400'>
                      No contact submissions found
                    </div>
                  ) : (
                    <div className='space-y-4'>
                      {filteredContacts.map((contact) => (
                        <div
                          key={contact.id}
                          className='flex items-center justify-between rounded-lg border border-light-500/20 p-4 dark:border-dark-600/40'
                        >
                          <div className='flex-1'>
                            <div className='mb-2 flex items-center gap-2'>
                              <h3 className='font-medium text-dark-800 dark:text-light-300'>
                                {contact.name}
                              </h3>
                              <Badge className={getStatusBadgeVariant(contact.status)}>
                                {contact.status}
                              </Badge>
                              <span className='flex items-center text-xs text-dark-600 dark:text-light-400'>
                                <Calendar className='mr-1 h-3 w-3' />
                                {formatDate(contact.createdAt)}
                              </span>
                            </div>
                            <p className='text-sm text-dark-700 dark:text-light-300'>
                              <strong>Subject:</strong> {contact.subject}
                            </p>
                            {contact.company && (
                              <p className='text-sm text-dark-600 dark:text-light-400'>
                                <strong>Company:</strong> {contact.company}
                              </p>
                            )}
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => setSelectedContact(contact)}
                              >
                                <Eye className='h-4 w-4' />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className='max-w-2xl'>
                              <DialogHeader>
                                <DialogTitle>Contact Submission Details</DialogTitle>
                                <DialogDescription>
                                  Manage this contact submission
                                </DialogDescription>
                              </DialogHeader>
                              {selectedContact && (
                                <div className='space-y-4'>
                                  <div className='grid gap-4 md:grid-cols-2'>
                                    <div>
                                      <Label>Name</Label>
                                      <p className='text-sm'>{selectedContact.name}</p>
                                    </div>
                                    <div>
                                      <Label>Email</Label>
                                      <p className='text-sm'>{selectedContact.email}</p>
                                    </div>
                                    <div>
                                      <Label>Subject</Label>
                                      <p className='text-sm'>{selectedContact.subject}</p>
                                    </div>
                                    <div>
                                      <Label>Message</Label>
                                      <p className='text-sm'>{selectedContact.message}</p>
                                    </div>
                                  </div>
                                  <div className='flex gap-2'>
                                    <Button
                                      onClick={() =>
                                        window.open(
                                          `mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`
                                        )
                                      }
                                      size='sm'
                                      variant='outline'
                                    >
                                      <ExternalLink className='mr-1 h-4 w-4' />
                                      Reply by Email
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Support Tickets Tab */}
            <TabsContent value='tickets' className='space-y-4'>
              {/* Filters */}
              <Card className='bg-light-400/30 shadow-lg shadow-dark-900/30 ring-1 ring-accent2/80 drop-shadow-md dark:bg-dark-700/50 dark:ring-accent/80'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Filter className='h-5 w-5' />
                    Ticket Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid gap-4 md:grid-cols-5'>
                    <div className='space-y-2'>
                      <Label htmlFor='ticket-status'>Status</Label>
                      <Select
                        value={ticketsFilters.status}
                        onValueChange={(value) =>
                          setTicketsFilters((prev) => ({ ...prev, status: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='All statuses' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='all'>All statuses</SelectItem>
                          <SelectItem value='open'>Open</SelectItem>
                          <SelectItem value='in-progress'>In Progress</SelectItem>
                          <SelectItem value='resolved'>Resolved</SelectItem>
                          <SelectItem value='closed'>Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='ticket-category'>Category</Label>
                      <Select
                        value={ticketsFilters.category}
                        onValueChange={(value) =>
                          setTicketsFilters((prev) => ({ ...prev, category: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='All categories' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='all'>All categories</SelectItem>
                          <SelectItem value='technical'>Technical</SelectItem>
                          <SelectItem value='billing'>Billing</SelectItem>
                          <SelectItem value='feature'>Feature</SelectItem>
                          <SelectItem value='other'>Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='ticket-priority'>Priority</Label>
                      <Select
                        value={ticketsFilters.priority}
                        onValueChange={(value) =>
                          setTicketsFilters((prev) => ({ ...prev, priority: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='All priorities' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='all'>All priorities</SelectItem>
                          <SelectItem value='low'>Low</SelectItem>
                          <SelectItem value='medium'>Medium</SelectItem>
                          <SelectItem value='high'>High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='ticket-search'>Search</Label>
                      <div className='relative'>
                        <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                        <Input
                          id='ticket-search'
                          placeholder='Search tickets...'
                          value={ticketsFilters.search}
                          onChange={(e) =>
                            setTicketsFilters((prev) => ({ ...prev, search: e.target.value }))
                          }
                          className='pl-8'
                        />
                      </div>
                    </div>
                    <div className='flex items-end'>
                      <Button onClick={loadSupportTickets} variant='outline' className='w-full'>
                        <RefreshCw className='mr-2 h-4 w-4' />
                        Refresh
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Support Tickets List */}
              <Card className='bg-light-400/30 shadow-lg shadow-dark-900/30 ring-1 ring-accent2/80 drop-shadow-md dark:bg-dark-700/50 dark:ring-accent/80'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <AlertCircle className='h-5 w-5' />
                    Support Tickets ({filteredTickets.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {ticketsLoading ? (
                    <div className='flex items-center justify-center py-8'>
                      <Loader2 className='h-8 w-8 animate-spin' />
                    </div>
                  ) : filteredTickets.length === 0 ? (
                    <div className='flex items-center justify-center py-8 text-dark-600 dark:text-light-400'>
                      No support tickets found
                    </div>
                  ) : (
                    <div className='space-y-4'>
                      {filteredTickets.map((ticket) => (
                        <div
                          key={ticket.id}
                          className='flex items-center justify-between rounded-lg border border-light-500/20 p-4 dark:border-dark-600/40'
                        >
                          <div className='flex-1'>
                            <div className='mb-2 flex items-center gap-2'>
                              <h3 className='font-medium text-dark-800 dark:text-light-300'>
                                {ticket.name}
                              </h3>
                              <Badge className={getStatusBadgeVariant(ticket.status)}>
                                {ticket.status}
                              </Badge>
                              <span className='flex items-center text-xs text-dark-600 dark:text-light-400'>
                                <Calendar className='mr-1 h-3 w-3' />
                                {formatDate(ticket.createdAt)}
                              </span>
                            </div>
                            <p className='text-sm text-dark-700 dark:text-light-300'>
                              <strong>Subject:</strong> {ticket.subject}
                            </p>
                            <p className='text-sm text-dark-600 dark:text-light-400'>
                              <strong>Category:</strong> {ticket.category}
                            </p>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => setSelectedTicket(ticket)}
                              >
                                <Eye className='h-4 w-4' />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className='max-w-2xl'>
                              <DialogHeader>
                                <DialogTitle>Support Ticket Details</DialogTitle>
                                <DialogDescription>Manage this support ticket</DialogDescription>
                              </DialogHeader>
                              {selectedTicket && (
                                <div className='space-y-4'>
                                  <div className='grid gap-4 md:grid-cols-2'>
                                    <div>
                                      <Label>Ticket Number</Label>
                                      <p className='text-sm'>{selectedTicket.ticketNumber}</p>
                                    </div>
                                    <div>
                                      <Label>Name</Label>
                                      <p className='text-sm'>{selectedTicket.name}</p>
                                    </div>
                                    <div>
                                      <Label>Email</Label>
                                      <p className='text-sm'>{selectedTicket.email}</p>
                                    </div>
                                    <div>
                                      <Label>Category</Label>
                                      <p className='text-sm'>{selectedTicket.category}</p>
                                    </div>
                                    <div>
                                      <Label>Subject</Label>
                                      <p className='text-sm'>{selectedTicket.subject}</p>
                                    </div>
                                    <div>
                                      <Label>Message</Label>
                                      <p className='text-sm'>{selectedTicket.message}</p>
                                    </div>
                                  </div>
                                  <div className='flex gap-2'>
                                    <Button
                                      onClick={() =>
                                        window.open(
                                          `mailto:${selectedTicket.email}?subject=Re: ${selectedTicket.subject}`
                                        )
                                      }
                                      size='sm'
                                      variant='outline'
                                    >
                                      <ExternalLink className='mr-1 h-4 w-4' />
                                      Reply by Email
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Career Applications Tab */}
            <TabsContent value='careers' className='space-y-4'>
              {/* Filters */}
              <Card className='bg-light-400/30 shadow-lg shadow-dark-900/30 ring-1 ring-accent2/80 drop-shadow-md dark:bg-dark-700/50 dark:ring-accent/80'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Filter className='h-5 w-5' />
                    Career Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid gap-4 md:grid-cols-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='career-status'>Status</Label>
                      <Select
                        value={careersFilters.status}
                        onValueChange={(value) =>
                          setCareersFilters((prev) => ({ ...prev, status: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='All statuses' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='all'>All statuses</SelectItem>
                          <SelectItem value='new'>New</SelectItem>
                          <SelectItem value='reviewing'>Reviewing</SelectItem>
                          <SelectItem value='interview'>Interview</SelectItem>
                          <SelectItem value='hired'>Hired</SelectItem>
                          <SelectItem value='rejected'>Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='career-position'>Position</Label>
                      <Select
                        value={careersFilters.position}
                        onValueChange={(value) =>
                          setCareersFilters((prev) => ({ ...prev, position: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='All positions' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='all'>All positions</SelectItem>
                          <SelectItem value='frontend-developer'>Frontend Developer</SelectItem>
                          <SelectItem value='backend-developer'>Backend Developer</SelectItem>
                          <SelectItem value='fullstack-developer'>Full Stack Developer</SelectItem>
                          <SelectItem value='ai-engineer'>AI Engineer</SelectItem>
                          <SelectItem value='product-manager'>Product Manager</SelectItem>
                          <SelectItem value='other'>Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='career-search'>Search</Label>
                      <div className='relative'>
                        <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                        <Input
                          id='career-search'
                          placeholder='Search applications...'
                          value={careersFilters.search}
                          onChange={(e) =>
                            setCareersFilters((prev) => ({ ...prev, search: e.target.value }))
                          }
                          className='pl-8'
                        />
                      </div>
                    </div>
                    <div className='flex items-end'>
                      <Button
                        onClick={loadCareerApplications}
                        variant='outline'
                        className='w-full'
                      >
                        <RefreshCw className='mr-2 h-4 w-4' />
                        Refresh
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Career Applications List */}
              <Card className='bg-light-400/30 shadow-lg shadow-dark-900/30 ring-1 ring-accent2/80 drop-shadow-md dark:bg-dark-700/50 dark:ring-accent/80'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Briefcase className='h-5 w-5' />
                    Career Applications ({filteredCareers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {careersLoading ? (
                    <div className='flex items-center justify-center py-8'>
                      <Loader2 className='h-8 w-8 animate-spin' />
                    </div>
                  ) : filteredCareers.length === 0 ? (
                    <div className='flex items-center justify-center py-8 text-dark-600 dark:text-light-400'>
                      No career applications found
                    </div>
                  ) : (
                    <div className='space-y-4'>
                      {filteredCareers.map((application) => (
                        <div
                          key={application.id}
                          className='flex items-center justify-between rounded-lg border border-light-500/20 p-4 dark:border-dark-600/40'
                        >
                          <div className='flex-1'>
                            <div className='mb-2 flex items-center gap-2'>
                              <h3 className='font-medium text-dark-800 dark:text-light-300'>
                                {application.name}
                              </h3>
                              <Badge className={getStatusBadgeVariant(application.status)}>
                                {application.status}
                              </Badge>
                              <span className='flex items-center text-xs text-dark-600 dark:text-light-400'>
                                <Calendar className='mr-1 h-3 w-3' />
                                {formatDate(application.timestamp)}
                              </span>
                            </div>
                            <p className='text-sm text-dark-700 dark:text-light-300'>
                              <strong>Position:</strong> {application.position}
                            </p>
                            <p className='text-sm text-dark-600 dark:text-light-400'>
                              <strong>Experience:</strong> {application.experience}
                            </p>
                          </div>
                          <div className='flex gap-2'>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant='outline'
                                  size='sm'
                                  onClick={() => setSelectedCareerApp(application)}
                                >
                                  <Eye className='h-4 w-4' />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className='max-h-[80vh] max-w-4xl overflow-y-auto'>
                                <DialogHeader>
                                  <DialogTitle>Career Application Details</DialogTitle>
                                  <DialogDescription>
                                    Application ID: {application.applicationId}
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedCareerApp && (
                                  <div className='space-y-6'>
                                    <div className='grid gap-4 md:grid-cols-2'>
                                      <div>
                                        <Label>Name</Label>
                                        <p className='text-sm'>{selectedCareerApp.name}</p>
                                      </div>
                                      <div>
                                        <Label>Email</Label>
                                        <p className='text-sm'>{selectedCareerApp.email}</p>
                                      </div>
                                      <div>
                                        <Label>Position</Label>
                                        <p className='text-sm'>{selectedCareerApp.position}</p>
                                      </div>
                                      <div>
                                        <Label>Experience Level</Label>
                                        <p className='text-sm'>{selectedCareerApp.experience}</p>
                                      </div>
                                      {selectedCareerApp.phone && (
                                        <div>
                                          <Label>Phone</Label>
                                          <p className='text-sm'>{selectedCareerApp.phone}</p>
                                        </div>
                                      )}
                                      {selectedCareerApp.location && (
                                        <div>
                                          <Label>Location</Label>
                                          <p className='text-sm'>{selectedCareerApp.location}</p>
                                        </div>
                                      )}
                                      {selectedCareerApp.portfolioUrl && (
                                        <div>
                                          <Label>Portfolio</Label>
                                          <a
                                            href={selectedCareerApp.portfolioUrl}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='text-sm text-accent hover:underline'
                                          >
                                            {selectedCareerApp.portfolioUrl}
                                          </a>
                                        </div>
                                      )}
                                      {selectedCareerApp.linkedinUrl && (
                                        <div>
                                          <Label>LinkedIn</Label>
                                          <a
                                            href={selectedCareerApp.linkedinUrl}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='text-sm text-accent hover:underline'
                                          >
                                            {selectedCareerApp.linkedinUrl}
                                          </a>
                                        </div>
                                      )}
                                    </div>

                                    <div>
                                      <Label>Cover Letter</Label>
                                      <div className='mt-2 rounded-md bg-light-300/50 p-3 dark:bg-dark-600/50'>
                                        <p className='whitespace-pre-wrap text-sm'>
                                          {selectedCareerApp.coverLetter}
                                        </p>
                                      </div>
                                    </div>

                                    {selectedCareerApp.resumeDescription && (
                                      <div>
                                        <Label>Resume Summary</Label>
                                        <div className='mt-2 rounded-md bg-light-300/50 p-3 dark:bg-dark-600/50'>
                                          <p className='whitespace-pre-wrap text-sm'>
                                            {selectedCareerApp.resumeDescription}
                                          </p>
                                        </div>
                                      </div>
                                    )}

                                    <div className='flex flex-wrap gap-2'>
                                      <Button
                                        onClick={() =>
                                          updateCareerApplicationStatus(
                                            selectedCareerApp.id,
                                            'reviewing'
                                          )
                                        }
                                        disabled={isUpdating}
                                        size='sm'
                                        variant='outline'
                                      >
                                        Mark as Reviewing
                                      </Button>
                                      <Button
                                        onClick={() =>
                                          updateCareerApplicationStatus(
                                            selectedCareerApp.id,
                                            'interview'
                                          )
                                        }
                                        disabled={isUpdating}
                                        size='sm'
                                        variant='outline'
                                      >
                                        Schedule Interview
                                      </Button>
                                      <Button
                                        onClick={() =>
                                          window.open(
                                            `mailto:${selectedCareerApp.email}?subject=Re: Application for ${selectedCareerApp.position}`
                                          )
                                        }
                                        size='sm'
                                        variant='outline'
                                      >
                                        <ExternalLink className='mr-1 h-4 w-4' />
                                        Reply by Email
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Investor Inquiries Tab */}
            <TabsContent value='investors' className='space-y-4'>
              {/* Filters */}
              <Card className='bg-light-400/30 shadow-lg shadow-dark-900/30 ring-1 ring-accent2/80 drop-shadow-md dark:bg-dark-700/50 dark:ring-accent/80'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Filter className='h-5 w-5' />
                    Investor Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid gap-4 md:grid-cols-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='investor-status'>Status</Label>
                      <Select
                        value={investorsFilters.status}
                        onValueChange={(value) =>
                          setInvestorsFilters((prev) => ({ ...prev, status: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='All statuses' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='all'>All statuses</SelectItem>
                          <SelectItem value='new'>New</SelectItem>
                          <SelectItem value='contacted'>Contacted</SelectItem>
                          <SelectItem value='meeting-scheduled'>Meeting Scheduled</SelectItem>
                          <SelectItem value='completed'>Completed</SelectItem>
                          <SelectItem value='declined'>Declined</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='investor-type'>Investor Type</Label>
                      <Select
                        value={investorsFilters.investorType}
                        onValueChange={(value) =>
                          setInvestorsFilters((prev) => ({ ...prev, investorType: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='All types' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='all'>All types</SelectItem>
                          <SelectItem value='angel'>Angel Investor</SelectItem>
                          <SelectItem value='vc'>Venture Capital</SelectItem>
                          <SelectItem value='pe'>Private Equity</SelectItem>
                          <SelectItem value='corporate'>Corporate Venture</SelectItem>
                          <SelectItem value='family-office'>Family Office</SelectItem>
                          <SelectItem value='strategic'>Strategic Investor</SelectItem>
                          <SelectItem value='other'>Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='investor-search'>Search</Label>
                      <div className='relative'>
                        <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                        <Input
                          id='investor-search'
                          placeholder='Search inquiries...'
                          value={investorsFilters.search}
                          onChange={(e) =>
                            setInvestorsFilters((prev) => ({ ...prev, search: e.target.value }))
                          }
                          className='pl-8'
                        />
                      </div>
                    </div>
                    <div className='flex items-end'>
                      <Button onClick={loadInvestorInquiries} variant='outline' className='w-full'>
                        <RefreshCw className='mr-2 h-4 w-4' />
                        Refresh
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Investor Inquiries List */}
              <Card className='bg-light-400/30 shadow-lg shadow-dark-900/30 ring-1 ring-accent2/80 drop-shadow-md dark:bg-dark-700/50 dark:ring-accent/80'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <DollarSign className='h-5 w-5' />
                    Investor Inquiries ({filteredInvestors.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {investorsLoading ? (
                    <div className='flex items-center justify-center py-8'>
                      <Loader2 className='h-8 w-8 animate-spin' />
                    </div>
                  ) : filteredInvestors.length === 0 ? (
                    <div className='flex items-center justify-center py-8 text-dark-600 dark:text-light-400'>
                      No investor inquiries found
                    </div>
                  ) : (
                    <div className='space-y-4'>
                      {filteredInvestors.map((inquiry) => (
                        <div
                          key={inquiry.id}
                          className='flex items-center justify-between rounded-lg border border-light-500/20 p-4 dark:border-dark-600/40'
                        >
                          <div className='flex-1'>
                            <div className='mb-2 flex items-center gap-2'>
                              <h3 className='font-medium text-dark-800 dark:text-light-300'>
                                {inquiry.name}
                              </h3>
                              <Badge className={getStatusBadgeVariant(inquiry.status)}>
                                {inquiry.status}
                              </Badge>
                              <span className='flex items-center text-xs text-dark-600 dark:text-light-400'>
                                <Calendar className='mr-1 h-3 w-3' />
                                {formatDate(inquiry.timestamp)}
                              </span>
                            </div>
                            <p className='text-sm text-dark-700 dark:text-light-300'>
                              <strong>Company:</strong> {inquiry.company}
                            </p>
                            <p className='text-sm text-dark-600 dark:text-light-400'>
                              <strong>Investor Type:</strong> {inquiry.investorType}
                            </p>
                          </div>
                          <div className='flex gap-2'>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant='outline'
                                  size='sm'
                                  onClick={() => setSelectedInvestorInquiry(inquiry)}
                                >
                                  <Eye className='h-4 w-4' />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className='max-h-[80vh] max-w-4xl overflow-y-auto'>
                                <DialogHeader>
                                  <DialogTitle>Investor Inquiry Details</DialogTitle>
                                  <DialogDescription>
                                    Inquiry ID: {inquiry.inquiryId}
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedInvestorInquiry && (
                                  <div className='space-y-6'>
                                    <div className='grid gap-4 md:grid-cols-2'>
                                      <div>
                                        <Label>Name</Label>
                                        <p className='text-sm'>{selectedInvestorInquiry.name}</p>
                                      </div>
                                      <div>
                                        <Label>Email</Label>
                                        <p className='text-sm'>{selectedInvestorInquiry.email}</p>
                                      </div>
                                      <div>
                                        <Label>Company</Label>
                                        <p className='text-sm'>
                                          {selectedInvestorInquiry.company}
                                        </p>
                                      </div>
                                      <div>
                                        <Label>Investor Type</Label>
                                        <p className='text-sm'>
                                          {selectedInvestorInquiry.investorType}
                                        </p>
                                      </div>
                                      {selectedInvestorInquiry.position && (
                                        <div>
                                          <Label>Position</Label>
                                          <p className='text-sm'>
                                            {selectedInvestorInquiry.position}
                                          </p>
                                        </div>
                                      )}
                                      {selectedInvestorInquiry.investmentRange && (
                                        <div>
                                          <Label>Investment Range</Label>
                                          <p className='text-sm'>
                                            {selectedInvestorInquiry.investmentRange}
                                          </p>
                                        </div>
                                      )}
                                      {selectedInvestorInquiry.linkedinUrl && (
                                        <div>
                                          <Label>LinkedIn</Label>
                                          <a
                                            href={selectedInvestorInquiry.linkedinUrl}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='text-sm text-accent hover:underline'
                                          >
                                            {selectedInvestorInquiry.linkedinUrl}
                                          </a>
                                        </div>
                                      )}
                                      {selectedInvestorInquiry.websiteUrl && (
                                        <div>
                                          <Label>Website</Label>
                                          <a
                                            href={selectedInvestorInquiry.websiteUrl}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='text-sm text-accent hover:underline'
                                          >
                                            {selectedInvestorInquiry.websiteUrl}
                                          </a>
                                        </div>
                                      )}
                                    </div>

                                    <div>
                                      <Label>Message</Label>
                                      <div className='mt-2 rounded-md bg-light-300/50 p-3 dark:bg-dark-600/50'>
                                        <p className='whitespace-pre-wrap text-sm'>
                                          {selectedInvestorInquiry.message}
                                        </p>
                                      </div>
                                    </div>

                                    {selectedInvestorInquiry.experience && (
                                      <div>
                                        <Label>Investment Experience</Label>
                                        <div className='mt-2 rounded-md bg-light-300/50 p-3 dark:bg-dark-600/50'>
                                          <p className='whitespace-pre-wrap text-sm'>
                                            {selectedInvestorInquiry.experience}
                                          </p>
                                        </div>
                                      </div>
                                    )}

                                    <div className='flex flex-wrap gap-2'>
                                      <Button
                                        onClick={() =>
                                          updateInvestorInquiryStatus(
                                            selectedInvestorInquiry.id,
                                            'contacted'
                                          )
                                        }
                                        disabled={isUpdating}
                                        size='sm'
                                        variant='outline'
                                      >
                                        Mark as Contacted
                                      </Button>
                                      <Button
                                        onClick={() =>
                                          updateInvestorInquiryStatus(
                                            selectedInvestorInquiry.id,
                                            'meeting-scheduled'
                                          )
                                        }
                                        disabled={isUpdating}
                                        size='sm'
                                        variant='outline'
                                      >
                                        Schedule Meeting
                                      </Button>
                                      <Button
                                        onClick={() =>
                                          window.open(
                                            `mailto:${selectedInvestorInquiry.email}?subject=Re: Investment Inquiry from ${selectedInvestorInquiry.company}`
                                          )
                                        }
                                        size='sm'
                                        variant='outline'
                                      >
                                        <ExternalLink className='mr-1 h-4 w-4' />
                                        Reply by Email
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
