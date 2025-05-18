// src/components/Dashboard/RichTextViewer.tsx
'use client';

import { useEffect, useState } from 'react';
import { Loader2, Download } from 'lucide-react';
import Link from 'next/link';

interface RichTextViewerProps {
  url: string;
  fileName: string;
}

const RichTextViewer = ({ url, fileName }: RichTextViewerProps) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const parseRtf = (rtf: string): string => {
      try {
        // Extract the text content from RTF
        let text = rtf;

        // Remove RTF headers and control sequences
        text = text.replace(/^.*?\\viewkind4/, '');

        // Replace curly braces syntax with HTML tags for better display
        text = text.replace(/\{\\f[0-9]+\s/g, '');
        text = text.replace(/\{\\[a-z0-9]+\s+([^{}]*)\}/g, '$1');

        // Handle paragraphs
        text = text.replace(/\\par\s/g, '\n\n');

        // Handle special formatting
        text = text.replace(/\\b\s(.*?)\\b0\s/g, '<strong>$1</strong>');
        text = text.replace(/\\i\s(.*?)\\i0\s/g, '<em>$1</em>');
        text = text.replace(/\\ul\s(.*?)\\ul0\s/g, '<u>$1</u>');

        // Clean up any remaining RTF control sequences
        text = text.replace(/\\[a-z0-9]+(-?\d+)?[ ]?/g, '');
        text = text.replace(/\}\}/g, '');
        text = text.replace(/\{\{/g, '');
        text = text.replace(/\}/g, '');
        text = text.replace(/\{/g, '');

        // Preserve line breaks for better formatting
        const paragraphs = text.split('\n\n').filter((p) => p.trim() !== '');

        // Format HTML content with proper paragraphs and styling
        let html = '<div class="rtf-document">';

        // Add paragraphs
        paragraphs.forEach((paragraph) => {
          if (paragraph.trim()) {
            html += `<p>${paragraph.trim()}</p>`;
          }
        });

        html += '</div>';
        return html;
      } catch (err) {
        console.error('RTF parsing error:', err);
        // Basic fallback if parsing fails
        return `<pre>${rtf.replace(/[\\{}]/g, '')}</pre>`;
      }
    };

    const fetchRtfContent = async () => {
      try {
        setLoading(true);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch RTF: ${response.status}`);
        }

        const rtfText = await response.text();
        const formattedHtml = parseRtf(rtfText);
        setContent(formattedHtml);
      } catch (err) {
        console.error('Error loading RTF:', err);
        setError(err instanceof Error ? err.message : 'Failed to load RTF document');
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchRtfContent();
    }
  }, [url]);

  return (
    <div className='flex h-full w-full flex-col bg-dark-800 dark:bg-dark-900'>
      <div className='sticky top-0 z-10 flex items-center justify-between bg-dark-700 px-4 py-2'>
        <div className='flex items-center'>
          <span className='text-sm font-medium text-light-300'>{fileName}</span>
          <span className='ml-2 rounded bg-accent px-2 py-0.5 text-xs font-medium text-light-300'>
            Rich Text Format
          </span>
        </div>

        <Link
          href={url}
          download={fileName}
          className='flex items-center rounded bg-accent px-3 py-1 text-sm font-medium text-white transition hover:bg-accent2'
        >
          <Download className='mr-1 h-4 w-4' />
          Download
        </Link>
      </div>

      <div className='flex-1 overflow-auto p-6'>
        {loading ? (
          <div className='flex h-full items-center justify-center'>
            <Loader2 className='h-12 w-12 animate-spin text-accent' />
          </div>
        ) : error ? (
          <div className='flex h-full items-center justify-center p-4 text-center'>
            <p className='text-destructive'>Error loading document: {error}</p>
          </div>
        ) : (
          <div
            className='rtf-viewer text-light-300'
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </div>
  );
};

export default RichTextViewer;
