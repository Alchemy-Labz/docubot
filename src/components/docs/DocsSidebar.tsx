// src/components/docs/DocsSidebar.tsx
import React from 'react';
import { ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DocSearch from './DocSearch';

interface DocSection {
  id: string;
  title: string;
  fileName: string;
}

interface DocsSidebarProps {
  sections: DocSection[];
  activeDoc: string;
  onNavigate: (docId: string) => void;
  onSearch: (query: string) => void;
  initialQuery?: string;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function DocsSidebar({
  sections,
  activeDoc,
  onNavigate,
  onSearch,
  initialQuery = '',
  isMobile = false,
  isOpen = false,
  onClose = () => {},
}: DocsSidebarProps) {
  return (
    <div
      className={`fixed inset-0 z-20 h-full w-full transform bg-light-200/95 p-4 transition-transform duration-300 ease-in-out dark:bg-dark-800/95 md:static md:z-0 md:h-auto md:w-64 md:min-w-64 md:transform-none md:border-r md:border-light-300 md:dark:border-dark-600 ${
        isMobile && isOpen ? 'translate-x-0' : isMobile ? '-translate-x-full' : 'translate-x-0'
      }`}
    >
      <div className='hidden items-center justify-between md:flex'>
        <h2 className='py-4 text-xl font-bold text-dark-800 dark:text-light-200'>Documentation</h2>
      </div>

      {/* Mobile Search */}
      <div className='mb-4 mt-2'>
        <DocSearch onSearch={onSearch} initialQuery={initialQuery} />
      </div>

      {/* Navigation Links */}
      <nav className='mt-6 space-y-1' aria-label='Documentation navigation'>
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onNavigate(section.id)}
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
      {isMobile && (
        <div className='mt-6'>
          <Button
            variant='outline'
            className='w-full'
            onClick={onClose}
            aria-label='Close sidebar'
          >
            <X size={16} className='mr-2' />
            Close Menu
          </Button>
        </div>
      )}
    </div>
  );
}
