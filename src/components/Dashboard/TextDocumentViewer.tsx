// src/components/Dashboard/TextDocumentViewer.tsx
'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { MarkdownRenderer } from './Markdown';
import RichTextViewer from './RichTextViewer';

interface TextDocumentViewerProps {
  url: string;
  fileName: string;
  fileType: string;
}

const TextDocumentViewer = ({ url, fileName, fileType }: TextDocumentViewerProps) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get a friendly display name for the file type
  const getFileTypeDisplay = (): string => {
    switch (fileType) {
      case 'text/plain':
        return 'Text';
      case 'text/markdown':
        return 'Markdown';
      case 'text/rtf':
      case 'application/rtf':
        return 'Rich Text Format (RTF)';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'Word Document (DOCX)';
      default:
        return 'Document';
    }
  };

  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true);
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch document: ${response.status}`);
        }

        // For DOCX files, we can't display them directly in the browser
        if (
          fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
          setContent(
            'DOCX files cannot be displayed directly in the browser. Please download the file to view it.'
          );
          setLoading(false);
          return;
        }

        // For RTF files, we'll just load the content for the component
        if (fileType === 'text/rtf' || fileType === 'application/rtf') {
          const text = await response.text();
          setContent(text);
          setLoading(false);
          return;
        }

        // For text files, markdown, and other types
        const text = await response.text();
        setContent(text);
      } catch (err) {
        console.error('Error fetching document:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch document');
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchDocument();
    }
  }, [url, fileType]);

  // Special handling for DOCX files
  if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return (
      <div className='flex h-full flex-col items-center justify-center bg-light-400/40 p-8 dark:bg-dark-800/40'>
        <div className='mb-8 max-w-lg text-center'>
          <h3 className='mb-4 text-xl font-bold'>DOCX File Preview</h3>
          <p className='mb-6'>
            DOCX files cannot be displayed directly in the browser. Please download the file to
            view it.
          </p>
          <Link
            href={url}
            download={fileName}
            className='inline-block rounded-md bg-accent px-6 py-3 font-semibold text-white transition hover:bg-accent2'
          >
            Download {fileName}
          </Link>
        </div>
      </div>
    );
  }

  // Special handling for RTF files
  if ((fileType === 'text/rtf' || fileType === 'application/rtf') && !loading && !error) {
    return <RichTextViewer url={url} fileName={fileName} />;
  }

  return (
    <div className='flex h-full w-full flex-col bg-light-400/40 dark:bg-dark-800/40'>
      <div className='sticky top-0 z-10 flex items-center justify-between bg-light-600 p-2 shadow-md dark:bg-dark-600'>
        <div className='flex items-center'>
          <div className='max-w-[200px] truncate text-sm font-medium'>{fileName}</div>
          <span className='ml-2 rounded bg-accent/20 px-2 py-0.5 text-xs font-medium text-dark-700 dark:text-light-300'>
            {getFileTypeDisplay()}
          </span>
        </div>

        <Link
          href={url}
          download={fileName}
          className='rounded bg-accent px-3 py-1 text-sm font-medium text-white transition hover:bg-accent2'
        >
          Download
        </Link>
      </div>
      <div className='flex-1 overflow-auto p-4'>
        {loading ? (
          <div className='flex h-full items-center justify-center'>
            <Loader2 className='h-12 w-12 animate-spin text-accent' />
          </div>
        ) : error ? (
          <div className='flex h-full items-center justify-center p-4 text-center'>
            <p className='text-destructive'>Error loading document: {error}</p>
          </div>
        ) : (
          <div className='prose-lg dark:prose-invert prose max-w-none'>
            {fileType === 'text/markdown' ? (
              <MarkdownRenderer>{content}</MarkdownRenderer>
            ) : (
              <pre className='whitespace-pre-wrap break-words rounded-md bg-dark-800/50 p-4 text-light-300'>
                {content}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextDocumentViewer;
