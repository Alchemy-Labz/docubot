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
  fetchContactSubmissions,
  fetchSupportTickets,
  updateContactSubmissionStatus,
  updateSupportTicket,
  getAdminStats,
  type ContactSubmission,
  type SupportTicket,
} from '@/lib/firebase/adminQueries';
import toast from 'react-hot-toast';

interface AdminStats {
  totalContacts: number;
  totalTickets: number;
  openTickets: number;
  pendingContacts: number;
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

  // Dialog states
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
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
      // Add a small delay to ensure Firebase is properly initialized
      const timer = setTimeout(() => {
        loadAdminStats();
        loadContactSubmissions();
        loadSupportTickets();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isAdmin, isFirebaseAuthenticated]);

  const loadAdminStats = async () => {
    try {
      const adminStats = await getAdminStats();
      setStats(adminStats);
    } catch (error) {
      console.error('Error loading admin stats:', error);
      toast.error('Failed to load dashboard stats');
    }
  };

  const loadContactSubmissions = async () => {
    try {
      setContactsLoading(true);
      const { submissions } = await fetchContactSubmissions({
        limitCount: 50,
        status: contactsFilters.status === 'all' ? undefined : contactsFilters.status,
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
      const { tickets } = await fetchSupportTickets({
        limitCount: 50,
        status: ticketsFilters.status === 'all' ? undefined : ticketsFilters.status,
        category: ticketsFilters.category === 'all' ? undefined : ticketsFilters.category,
        priority: ticketsFilters.priority === 'all' ? undefined : ticketsFilters.priority,
      });
      setSupportTickets(tickets);
    } catch (error) {
      console.error('Error loading support tickets:', error);
      toast.error('Failed to load support tickets');
    } finally {
      setTicketsLoading(false);
    }
  };

  const handleUpdateContactStatus = async (
    submissionId: string,
    status: 'new' | 'contacted' | 'resolved'
  ) => {
    try {
      setIsUpdating(true);
      await updateContactSubmissionStatus(submissionId, status, status !== 'new');
      await loadContactSubmissions();
      await loadAdminStats();
      toast.success('Contact submission updated successfully');
      setSelectedContact(null);
    } catch (error) {
      console.error('Error updating contact submission:', error);
      toast.error('Failed to update contact submission');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateTicketStatus = async (
    ticketId: string,
    updates: Partial<Pick<SupportTicket, 'status' | 'assignedTo' | 'resolution'>>
  ) => {
    try {
      setIsUpdating(true);
      await updateSupportTicket(ticketId, updates);
      await loadSupportTickets();
      await loadAdminStats();
      toast.success('Support ticket updated successfully');
      setSelectedTicket(null);
    } catch (error) {
      console.error('Error updating support ticket:', error);
      toast.error('Failed to update support ticket');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      { variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }
    > = {
      new: { variant: 'default', icon: <Clock className='h-3 w-3' /> },
      open: { variant: 'default', icon: <Clock className='h-3 w-3' /> },
      contacted: { variant: 'secondary', icon: <Mail className='h-3 w-3' /> },
      'in-progress': { variant: 'secondary', icon: <AlertCircle className='h-3 w-3' /> },
      resolved: { variant: 'outline', icon: <CheckCircle className='h-3 w-3' /> },
      closed: { variant: 'outline', icon: <CheckCircle className='h-3 w-3' /> },
    };

    const config = variants[status] || variants.new;

    return (
      <Badge variant={config.variant} className='flex items-center gap-1'>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
      medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
      high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };

    return (
      <Badge className={colors[priority] || colors.medium}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    return timestamp.toDate().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredContacts = contactSubmissions.filter(
    (contact) =>
      contact.name.toLowerCase().includes(contactsFilters.search.toLowerCase()) ||
      contact.email.toLowerCase().includes(contactsFilters.search.toLowerCase()) ||
      contact.subject.toLowerCase().includes(contactsFilters.search.toLowerCase())
  );

  const filteredTickets = supportTickets.filter(
    (ticket) =>
      ticket.name.toLowerCase().includes(ticketsFilters.search.toLowerCase()) ||
      ticket.email.toLowerCase().includes(ticketsFilters.search.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(ticketsFilters.search.toLowerCase()) ||
      ticket.ticketNumber.toLowerCase().includes(ticketsFilters.search.toLowerCase())
  );

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Don't render anything if not admin or Firebase not ready
  if (!isLoaded || !isAdmin || !isFirebaseAuthenticated) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-accent2/20 to-accent/20 p-4 dark:from-accent3/20 dark:to-accent4/20 sm:p-6 lg:p-8'>
      <div className='mx-auto max-w-7xl space-y-8'>
        {/* Header */}
        <motion.div initial='hidden' animate='visible' variants={fadeIn}>
          <h1 className='text-3xl font-bold text-dark-800 dark:text-light-300'>Admin Dashboard</h1>
          <p className='text-dark-600 dark:text-light-400'>
            Manage contact submissions and support tickets
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'
          initial='hidden'
          animate='visible'
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
        >
          <motion.div variants={fadeIn}>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Total Contacts</CardTitle>
                <Users className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{stats.totalContacts}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Pending Contacts</CardTitle>
                <Clock className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{stats.pendingContacts}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Total Tickets</CardTitle>
                <MessageSquare className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{stats.totalTickets}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Open Tickets</CardTitle>
                <AlertTriangle className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{stats.openTickets}</div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Tabs for Contact Submissions and Support Tickets */}
        <motion.div initial='hidden' animate='visible' variants={fadeIn}>
          <Tabs defaultValue='contacts' className='space-y-4'>
            <TabsList>
              <TabsTrigger value='contacts'>Contact Submissions</TabsTrigger>
              <TabsTrigger value='tickets'>Support Tickets</TabsTrigger>
            </TabsList>

            {/* Contact Submissions Tab */}
            <TabsContent value='contacts' className='space-y-4'>
              {/* Filters */}
              <Card>
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
                        onValueChange={(value) => {
                          setContactsFilters((prev) => ({ ...prev, status: value }));
                          loadContactSubmissions();
                        }}
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
                        <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                        <Input
                          id='contact-search'
                          placeholder='Search contacts...'
                          value={contactsFilters.search}
                          onChange={(e) =>
                            setContactsFilters((prev) => ({ ...prev, search: e.target.value }))
                          }
                          className='pl-9'
                        />
                      </div>
                    </div>

                    <div className='flex items-end'>
                      <Button onClick={loadContactSubmissions} disabled={contactsLoading}>
                        {contactsLoading ? (
                          <Loader2 className='h-4 w-4 animate-spin' />
                        ) : (
                          'Refresh'
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Submissions List */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Submissions ({filteredContacts.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {contactsLoading ? (
                    <div className='flex items-center justify-center py-8'>
                      <Loader2 className='h-8 w-8 animate-spin' />
                    </div>
                  ) : filteredContacts.length === 0 ? (
                    <div className='py-8 text-center text-muted-foreground'>
                      No contact submissions found
                    </div>
                  ) : (
                    <div className='space-y-4'>
                      {filteredContacts.map((contact) => (
                        <div
                          key={contact.id}
                          className='rounded-lg border border-accent2/20 bg-light-100/80 p-4 dark:border-accent/20 dark:bg-dark-700/80'
                        >
                          <div className='flex items-start justify-between'>
                            <div className='flex-1 space-y-2'>
                              <div className='flex items-center gap-2'>
                                <h3 className='font-semibold text-dark-800 dark:text-light-300'>
                                  {contact.name}
                                </h3>
                                {getStatusBadge(contact.status)}
                              </div>
                              <div className='flex items-center gap-4 text-sm text-dark-600 dark:text-light-400'>
                                <span className='flex items-center gap-1'>
                                  <Mail className='h-3 w-3' />
                                  {contact.email}
                                </span>
                                {contact.phone && (
                                  <span className='flex items-center gap-1'>
                                    <Phone className='h-3 w-3' />
                                    {contact.phone}
                                  </span>
                                )}
                                <span className='flex items-center gap-1'>
                                  <Calendar className='h-3 w-3' />
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
                                      {selectedContact.company && (
                                        <div>
                                          <Label>Company</Label>
                                          <p className='text-sm'>{selectedContact.company}</p>
                                        </div>
                                      )}
                                      {selectedContact.phone && (
                                        <div>
                                          <Label>Phone</Label>
                                          <p className='text-sm'>{selectedContact.phone}</p>
                                        </div>
                                      )}
                                      <div>
                                        <Label>Contact Method</Label>
                                        <p className='text-sm capitalize'>
                                          {selectedContact.contactMethod}
                                        </p>
                                      </div>
                                      <div>
                                        <Label>Marketing Opt-in</Label>
                                        <p className='text-sm'>
                                          {selectedContact.marketingOptIn ? 'Yes' : 'No'}
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <Label>Subject</Label>
                                      <p className='text-sm'>{selectedContact.subject}</p>
                                    </div>
                                    <div>
                                      <Label>Message</Label>
                                      <p className='whitespace-pre-wrap text-sm'>
                                        {selectedContact.message}
                                      </p>
                                    </div>
                                    <div className='flex gap-2'>
                                      <Button
                                        onClick={() =>
                                          handleUpdateContactStatus(
                                            selectedContact.id,
                                            'contacted'
                                          )
                                        }
                                        disabled={
                                          isUpdating || selectedContact.status === 'contacted'
                                        }
                                        size='sm'
                                      >
                                        Mark as Contacted
                                      </Button>
                                      <Button
                                        onClick={() =>
                                          handleUpdateContactStatus(selectedContact.id, 'resolved')
                                        }
                                        disabled={
                                          isUpdating || selectedContact.status === 'resolved'
                                        }
                                        size='sm'
                                        variant='outline'
                                      >
                                        Mark as Resolved
                                      </Button>
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
              <Card>
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
                        onValueChange={(value) => {
                          setTicketsFilters((prev) => ({ ...prev, status: value }));
                          loadSupportTickets();
                        }}
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
                        onValueChange={(value) => {
                          setTicketsFilters((prev) => ({ ...prev, category: value }));
                          loadSupportTickets();
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='All categories' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='all'>All categories</SelectItem>
                          <SelectItem value='technical'>Technical</SelectItem>
                          <SelectItem value='billing'>Billing</SelectItem>
                          <SelectItem value='feature'>Feature Request</SelectItem>
                          <SelectItem value='other'>Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='ticket-priority'>Priority</Label>
                      <Select
                        value={ticketsFilters.priority}
                        onValueChange={(value) => {
                          setTicketsFilters((prev) => ({ ...prev, priority: value }));
                          loadSupportTickets();
                        }}
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
                        <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                        <Input
                          id='ticket-search'
                          placeholder='Search tickets...'
                          value={ticketsFilters.search}
                          onChange={(e) =>
                            setTicketsFilters((prev) => ({ ...prev, search: e.target.value }))
                          }
                          className='pl-9'
                        />
                      </div>
                    </div>

                    <div className='flex items-end'>
                      <Button onClick={loadSupportTickets} disabled={ticketsLoading}>
                        {ticketsLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : 'Refresh'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Support Tickets List */}
              <Card>
                <CardHeader>
                  <CardTitle>Support Tickets ({filteredTickets.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {ticketsLoading ? (
                    <div className='flex items-center justify-center py-8'>
                      <Loader2 className='h-8 w-8 animate-spin' />
                    </div>
                  ) : filteredTickets.length === 0 ? (
                    <div className='py-8 text-center text-muted-foreground'>
                      No support tickets found
                    </div>
                  ) : (
                    <div className='space-y-4'>
                      {filteredTickets.map((ticket) => (
                        <div
                          key={ticket.id}
                          className='rounded-lg border border-accent2/20 bg-light-100/80 p-4 dark:border-accent/20 dark:bg-dark-700/80'
                        >
                          <div className='flex items-start justify-between'>
                            <div className='flex-1 space-y-2'>
                              <div className='flex items-center gap-2'>
                                <h3 className='font-semibold text-dark-800 dark:text-light-300'>
                                  {ticket.ticketNumber}
                                </h3>
                                {getStatusBadge(ticket.status)}
                                {getPriorityBadge(ticket.priority)}
                                <Badge variant='outline' className='capitalize'>
                                  <Tag className='mr-1 h-3 w-3' />
                                  {ticket.category}
                                </Badge>
                              </div>
                              <div className='flex items-center gap-4 text-sm text-dark-600 dark:text-light-400'>
                                <span className='flex items-center gap-1'>
                                  <User className='h-3 w-3' />
                                  {ticket.name}
                                </span>
                                <span className='flex items-center gap-1'>
                                  <Mail className='h-3 w-3' />
                                  {ticket.email}
                                </span>
                                <span className='flex items-center gap-1'>
                                  <Calendar className='h-3 w-3' />
                                  {formatDate(ticket.createdAt)}
                                </span>
                              </div>
                              <p className='text-sm text-dark-700 dark:text-light-300'>
                                <strong>Subject:</strong> {ticket.subject}
                              </p>
                              {ticket.assignedTo && (
                                <p className='text-sm text-dark-600 dark:text-light-400'>
                                  <strong>Assigned to:</strong> {ticket.assignedTo}
                                </p>
                              )}
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
                              <DialogContent className='max-w-3xl'>
                                <DialogHeader>
                                  <DialogTitle>
                                    Support Ticket Details - {ticket.ticketNumber}
                                  </DialogTitle>
                                  <DialogDescription>Manage this support ticket</DialogDescription>
                                </DialogHeader>
                                {selectedTicket && (
                                  <div className='space-y-4'>
                                    <div className='grid gap-4 md:grid-cols-2'>
                                      <div>
                                        <Label>Customer Name</Label>
                                        <p className='text-sm'>{selectedTicket.name}</p>
                                      </div>
                                      <div>
                                        <Label>Email</Label>
                                        <p className='text-sm'>{selectedTicket.email}</p>
                                      </div>
                                      <div>
                                        <Label>Category</Label>
                                        <p className='text-sm capitalize'>
                                          {selectedTicket.category}
                                        </p>
                                      </div>
                                      <div>
                                        <Label>Priority</Label>
                                        <p className='text-sm capitalize'>
                                          {selectedTicket.priority}
                                        </p>
                                      </div>
                                      <div>
                                        <Label>Status</Label>
                                        <p className='text-sm capitalize'>
                                          {selectedTicket.status}
                                        </p>
                                      </div>
                                      <div>
                                        <Label>Created</Label>
                                        <p className='text-sm'>
                                          {formatDate(selectedTicket.createdAt)}
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <Label>Subject</Label>
                                      <p className='text-sm'>{selectedTicket.subject}</p>
                                    </div>
                                    <div>
                                      <Label>Description</Label>
                                      <p className='whitespace-pre-wrap text-sm'>
                                        {selectedTicket.message}
                                      </p>
                                    </div>
                                    {selectedTicket.resolution && (
                                      <div>
                                        <Label>Resolution</Label>
                                        <p className='whitespace-pre-wrap text-sm'>
                                          {selectedTicket.resolution}
                                        </p>
                                      </div>
                                    )}
                                    <div className='space-y-4'>
                                      <div className='grid gap-4 md:grid-cols-2'>
                                        <div className='space-y-2'>
                                          <Label>Update Status</Label>
                                          <Select
                                            onValueChange={(value) =>
                                              handleUpdateTicketStatus(selectedTicket.id, {
                                                status: value as SupportTicket['status'],
                                              })
                                            }
                                          >
                                            <SelectTrigger>
                                              <SelectValue placeholder='Select status' />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value='open'>Open</SelectItem>
                                              <SelectItem value='in-progress'>
                                                In Progress
                                              </SelectItem>
                                              <SelectItem value='resolved'>Resolved</SelectItem>
                                              <SelectItem value='closed'>Closed</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className='space-y-2'>
                                          <Label>Assign To</Label>
                                          <Input
                                            placeholder='Assignee name'
                                            onBlur={(e) => {
                                              if (e.target.value !== selectedTicket.assignedTo) {
                                                handleUpdateTicketStatus(selectedTicket.id, {
                                                  assignedTo: e.target.value || undefined,
                                                });
                                              }
                                            }}
                                            defaultValue={selectedTicket.assignedTo || ''}
                                          />
                                        </div>
                                      </div>
                                      <div className='space-y-2'>
                                        <Label>Resolution Notes</Label>
                                        <Textarea
                                          placeholder='Add resolution notes...'
                                          onBlur={(e) => {
                                            if (e.target.value !== selectedTicket.resolution) {
                                              handleUpdateTicketStatus(selectedTicket.id, {
                                                resolution: e.target.value || undefined,
                                              });
                                            }
                                          }}
                                          defaultValue={selectedTicket.resolution || ''}
                                        />
                                      </div>
                                      <div className='flex gap-2'>
                                        <Button
                                          onClick={() =>
                                            window.open(
                                              `mailto:${selectedTicket.email}?subject=Re: [${selectedTicket.ticketNumber}] ${selectedTicket.subject}`
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
