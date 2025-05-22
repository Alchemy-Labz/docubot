'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Footer from '@/components/Global/Footer';
import MarkdownRenderer from '@/components/Dashboard/Markdown';
import { Search, Menu, X, ChevronRight, ExternalLink, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Documentation sections organized hierarchically
const docSections = [
  { id: 'introduction', title: 'Introduction', fileName: 'introduction.md' },
  { id: 'getting-started', title: 'Getting Started', fileName: 'getting-started.md' },
  { id: 'uploading-documents', title: 'Uploading Documents', fileName: 'uploading-documents.md' },
  {
    id: 'chatting-with-documents',
    title: 'Chatting with Documents',
    fileName: 'chatting-with-documents.md',
  },
  { id: 'document-management', title: 'Document Management', fileName: 'document-management.md' },
  {
    id: 'code-repository-analysis',
    title: 'Code Repository Analysis',
    fileName: 'code-repository-analysis.md',
  },
  { id: 'exporting-chats', title: 'Exporting Chats', fileName: 'exporting-chats.md' },
  { id: 'subscription-plans', title: 'Subscription Plans', fileName: 'subscription-plans.md' },
  { id: 'privacy-security', title: 'Privacy & Security', fileName: 'privacy-security.md' },
  { id: 'troubleshooting', title: 'Troubleshooting', fileName: 'troubleshooting.md' },
];

// Document content and search functionality
interface DocContent {
  [key: string]: string;
}

interface SearchResult {
  docId: string;
  docTitle: string;
  content: string;
  excerpt: string;
}

export default function DocsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const docParam = searchParams?.get('doc') || 'introduction';
  const searchQuery = searchParams?.get('search') || '';

  const [activeDoc, setActiveDoc] = useState(docParam);
  const [docContent, setDocContent] = useState<DocContent>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load document content - mock function for demonstration
  // In production, you'd fetch the actual documents from your API
  useEffect(() => {
    const loadDoc = async (docId: string) => {
      try {
        if (docContent[docId]) return; // Already loaded

        const section = docSections.find((s) => s.id === docId);
        if (!section) return;

        // In a real implementation, you would fetch from your API
        let content = '';

        try {
          // Try to fetch the actual document from your API
          const response = await fetch(`/api/docs/${section.fileName}`);
          if (response.ok) {
            content = await response.text();
          } else {
            throw new Error(`Failed to load ${section.fileName}`);
          }
        } catch (error) {
          console.error(`API fetch failed for ${section.fileName}:`, error);

          // For demonstration purposes, create a placeholder content
          // In production, you'd handle this error gracefully
          content = `# ${section.title}\n\nThis content is currently being updated. Please try again later.`;
        }

        setDocContent((prev) => ({ ...prev, [docId]: content }));
      } catch (error) {
        console.error(`Failed to load document: ${docId}`, error);
        setDocContent((prev) => ({
          ...prev,
          [docId]: `# ${docSections.find((s) => s.id === docId)?.title || 'Document'}\n\nSorry, this content is currently unavailable. Please try again later.`,
        }));
      }
    };

    // Load active document first
    loadDoc(activeDoc).then(() => setIsLoading(false));

    // If searching, load all documents for search functionality
    if (searchQuery) {
      docSections.forEach((section) => loadDoc(section.id));
    }
  }, [activeDoc, docContent, searchQuery]);

  // Perform search when search query parameter changes
  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    }
  }, [searchQuery, docContent]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle search functionality
  const handleSearch = () => {
    if (!searchInput.trim()) {
      setSearchResults([]);
      router.push(`/help-center/documentation?doc=${activeDoc}`);
      return;
    }

    const results: SearchResult[] = [];
    const searchTermLower = searchInput.toLowerCase();

    // Search through all loaded documents
    Object.keys(docContent).forEach((docId) => {
      const content = docContent[docId] || '';
      if (content.toLowerCase().includes(searchTermLower)) {
        // Find the context around the search term for the excerpt
        const searchTermIndex = content.toLowerCase().indexOf(searchTermLower);
        const startIndex = Math.max(0, searchTermIndex - 40);
        const endIndex = Math.min(content.length, searchTermIndex + searchInput.length + 80);
        let excerpt = content.substring(startIndex, endIndex);

        // Add ellipsis if we're not at the beginning/end
        if (startIndex > 0) excerpt = '...' + excerpt;
        if (endIndex < content.length) excerpt = excerpt + '...';

        const section = docSections.find((s) => s.id === docId);
        if (section) {
          results.push({
            docId: docId,
            docTitle: section.title,
            content: content,
            excerpt: excerpt,
          });
        }
      }
    });

    setSearchResults(results);

    // Only update URL if this is an active search, not from URL parameter
    if (searchInput !== searchQuery) {
      router.push(`/help-center/documentation?search=${encodeURIComponent(searchInput)}`);
    }
  };

  // Handle navigation
  const navigateToDoc = (docId: string) => {
    setActiveDoc(docId);
    setSearchResults([]);
    setSearchInput('');
    router.push(`/help-center/documentation?doc=${docId}`);
    setIsSidebarOpen(false);
  };

  // Handle search result click
  const handleSearchResultClick = (docId: string) => {
    navigateToDoc(docId);
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Create a marked version of text with search term highlighted
  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;

    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-accent/30 px-1 dark:bg-accent3/30">$1</mark>');
  };

  return (
    <div className='flex min-h-screen flex-col overflow-x-hidden bg-gradient-to-br from-accent2/20 to-accent/20 dark:from-accent3/20 dark:to-accent4/20'>
      <div className='flex flex-1 flex-col md:flex-row'>
        {/* Mobile Header with Menu Button */}
        <div className='flex items-center justify-between border-b border-light-300 bg-light-200/80 p-4 dark:border-dark-600 dark:bg-dark-800/80 md:hidden'>
          <Button
            variant='ghost'
            size='icon'
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            className='mr-2'
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
          <h1 className='text-xl font-bold text-dark-800 dark:text-light-200'>
            DocuBot Documentation
          </h1>
        </div>

        {/* Sidebar for Navigation */}
        <div
          className={`fixed inset-0 z-20 h-full w-full transform bg-light-200/95 p-4 transition-transform duration-300 ease-in-out dark:bg-dark-800/95 md:static md:z-0 md:h-auto md:w-64 md:min-w-64 md:transform-none md:border-r md:border-light-300 md:dark:border-dark-600 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className='hidden items-center justify-between md:flex'>
            <h2 className='py-4 text-xl font-bold text-dark-800 dark:text-light-200'>
              Documentation
            </h2>
          </div>

          <div className='mb-4 mt-2'>
            <div className='relative'>
              <input
                type='text'
                placeholder='Search documentation...'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className='w-full rounded-md border border-light-400 bg-light-100/80 px-10 py-2 text-dark-800 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:border-dark-600 dark:bg-dark-700/80 dark:text-light-200 dark:focus:border-accent3 dark:focus:ring-accent3'
                aria-label='Search documentation'
              />
              <Search
                className='absolute left-3 top-2.5 h-5 w-5 text-dark-400 dark:text-light-600'
                aria-hidden='true'
              />
              {searchInput && (
                <Button
                  variant='ghost'
                  size='icon'
                  className='absolute right-1 top-1 h-8 w-8'
                  onClick={() => setSearchInput('')}
                  aria-label='Clear search'
                >
                  <X size={16} />
                </Button>
              )}
            </div>
            <Button
              onClick={handleSearch}
              className='mt-2 w-full bg-accent text-light-100 hover:bg-accent2 dark:bg-accent3 dark:hover:bg-accent4'
            >
              Search
            </Button>
          </div>

          {/* Navigation Links */}
          <nav className='mt-6 space-y-1'>
            {docSections.map((section) => (
              <button
                key={section.id}
                onClick={() => navigateToDoc(section.id)}
                className={`flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition-colors ${
                  activeDoc === section.id
                    ? 'bg-accent/20 font-medium text-accent dark:bg-accent3/20 dark:text-accent3'
                    : 'text-dark-700 hover:bg-light-300/80 dark:text-light-400 dark:hover:bg-dark-700/80'
                }`}
                aria-current={activeDoc === section.id ? 'page' : undefined}
              >
                <ChevronRight
                  size={16}
                  className={`mr-2 ${
                    activeDoc === section.id
                      ? 'text-accent dark:text-accent3'
                      : 'text-dark-400 dark:text-light-600'
                  }`}
                />
                {section.title}
              </button>
            ))}
          </nav>

          {/* Close button for mobile */}
          <div className='mt-6 md:hidden'>
            <Button
              variant='outline'
              className='w-full'
              onClick={toggleSidebar}
              aria-label='Close sidebar'
            >
              Close Menu
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className='flex-1 overflow-auto p-4 md:p-8'>
          {/* Breadcrumb and Title for Desktop */}
          <div className='mb-6 hidden items-center md:flex'>
            <Link
              href='/'
              className='mr-2 flex items-center text-dark-600 hover:text-accent dark:text-light-400 dark:hover:text-accent3'
              aria-label='Go to home page'
            >
              <Home size={16} className='mr-1' />
              Home
            </Link>
            <ChevronRight
              size={16}
              className='mx-2 text-dark-400 dark:text-light-600'
              aria-hidden='true'
            />
            <Link
              href='/help-center/documentation'
              className='text-dark-600 hover:text-accent dark:text-light-400 dark:hover:text-accent3'
              aria-label='Go to documentation page'
            >
              Documentation
            </Link>
            {activeDoc !== 'introduction' && (
              <>
                <ChevronRight
                  size={16}
                  className='mx-2 text-dark-400 dark:text-light-600'
                  aria-hidden='true'
                />
                <span className='font-medium text-dark-800 dark:text-light-200'>
                  {docSections.find((s) => s.id === activeDoc)?.title || ''}
                </span>
              </>
            )}
          </div>

          {/* Handle loading state */}
          {isLoading ? (
            <div className='flex h-64 items-center justify-center'>
              <div className='h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent dark:border-accent3'></div>
              <span className='ml-3 text-dark-700 dark:text-light-300'>
                Loading documentation...
              </span>
            </div>
          ) : searchResults.length > 0 ? (
            // Search Results
            <div>
              <h2 className='mb-4 text-2xl font-bold text-dark-800 dark:text-light-200'>
                Search Results for "{searchInput}"
              </h2>
              <p className='mb-6 text-dark-600 dark:text-light-400'>
                Found {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
              </p>

              <div className='space-y-6'>
                {searchResults.map((result, idx) => (
                  <div
                    key={idx}
                    className='cursor-pointer rounded-lg border border-light-300 bg-light-100/80 p-4 transition-all hover:border-accent hover:shadow-md dark:border-dark-600 dark:bg-dark-700/80 dark:hover:border-accent3'
                    onClick={() => handleSearchResultClick(result.docId)}
                  >
                    <h3 className='mb-2 text-lg font-semibold text-dark-800 dark:text-light-200'>
                      {result.docTitle}
                    </h3>
                    <div
                      className='text-dark-600 dark:text-light-400'
                      dangerouslySetInnerHTML={{
                        __html: highlightSearchTerm(result.excerpt, searchInput),
                      }}
                    />
                    <Button
                      variant='link'
                      className='mt-2 h-auto p-0 text-accent hover:text-accent2 dark:text-accent3 dark:hover:text-accent4'
                      aria-label={`View full ${result.docTitle} documentation`}
                    >
                      View documentation <ExternalLink size={14} className='ml-1' />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Regular Documentation Display
            <div className='prose-sm dark:prose-invert sm:prose-base lg:prose-lg prose max-w-none'>
              <div className='rounded-lg border border-light-300 bg-light-100/80 p-6 shadow-sm dark:border-dark-600 dark:bg-dark-700/80'>
                <h1 className='mb-6 text-3xl font-bold text-dark-800 dark:text-light-200'>
                  {docSections.find((s) => s.id === activeDoc)?.title || 'Documentation'}
                </h1>

                <div className='mt-4'>
                  <MarkdownRenderer>
                    {docContent[activeDoc] ||
                      '# Loading...\nPlease wait while we load the documentation.'}
                  </MarkdownRenderer>
                </div>

                {/* Navigation between sections */}
                <div className='mt-12 flex flex-col items-center justify-between border-t border-light-300 pt-6 dark:border-dark-600 sm:flex-row'>
                  {/* Previous section */}
                  {docSections.findIndex((s) => s.id === activeDoc) > 0 && (
                    <Button
                      variant='outline'
                      className='mb-4 w-full justify-start border-accent text-accent hover:bg-accent/10 dark:border-accent3 dark:text-accent3 dark:hover:bg-accent3/10 sm:mb-0 sm:w-auto'
                      onClick={() => {
                        const currentIndex = docSections.findIndex((s) => s.id === activeDoc);
                        if (currentIndex > 0) {
                          navigateToDoc(docSections[currentIndex - 1].id);
                        }
                      }}
                      aria-label='Previous documentation section'
                    >
                      <ChevronRight size={16} className='mr-2 rotate-180 transform' />
                      {
                        docSections[
                          Math.max(0, docSections.findIndex((s) => s.id === activeDoc) - 1)
                        ].title
                      }
                    </Button>
                  )}

                  {/* Next section */}
                  {docSections.findIndex((s) => s.id === activeDoc) < docSections.length - 1 && (
                    <Button
                      variant='outline'
                      className='w-full justify-end border-accent text-accent hover:bg-accent/10 dark:border-accent3 dark:text-accent3 dark:hover:bg-accent3/10 sm:w-auto'
                      onClick={() => {
                        const currentIndex = docSections.findIndex((s) => s.id === activeDoc);
                        if (currentIndex < docSections.length - 1) {
                          navigateToDoc(docSections[currentIndex + 1].id);
                        }
                      }}
                      aria-label='Next documentation section'
                    >
                      {
                        docSections[
                          Math.min(
                            docSections.length - 1,
                            docSections.findIndex((s) => s.id === activeDoc) + 1
                          )
                        ].title
                      }
                      <ChevronRight size={16} className='ml-2' />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
