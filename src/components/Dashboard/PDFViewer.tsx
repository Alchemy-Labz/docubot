// src/components/Dashboard/PDFViewer.tsx
'use client';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { Document, Page, pdfjs } from 'react-pdf';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { Input } from '../ui/input';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  url: string;
  fileName?: string;
}

const PDFViewer = ({ url, fileName = 'Document' }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [file, setFile] = useState<Blob | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [scale, setScale] = useState<number>(0.9);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFile = async () => {
      setLoading(true);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch PDF: ${response.status}`);
        }
        const fileBlob = await response.blob();
        setFile(fileBlob);
      } catch (err) {
        console.error('Error fetching PDF file:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch PDF file');
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchFile();
    }
  }, [url]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(Math.max(1, Math.min(newPage, numPages)));
  };

  const handlePageNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      handlePageChange(value);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setNumPages(numPages);
    setLoading(false);
  };

  return (
    <div className='flex h-full w-full flex-col'>
      <div className='sticky top-0 z-10 flex items-center justify-between bg-accent3/20 bg-light-600 p-2 shadow-md dark:bg-dark-600'>
        <div className='hidden max-w-[200px] truncate text-sm font-medium md:block'>
          {fileName}
        </div>

        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1 || loading}
            aria-label='Previous page'
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>

          <div className='flex items-center space-x-1'>
            <Input
              type='number'
              min={1}
              max={numPages}
              value={currentPage}
              onChange={handlePageNumberInput}
              className='w-14 text-center'
              disabled={loading}
              aria-label='Page number'
            />
            <span className='text-sm'>/ {numPages}</span>
          </div>

          <Button
            variant='outline'
            size='icon'
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= numPages || loading}
            aria-label='Next page'
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>

        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => setRotation((rotation + 90) % 360)}
            disabled={loading}
            aria-label='Rotate document'
          >
            <RotateCw className='h-4 w-4' />
          </Button>

          <Button
            variant='outline'
            size='icon'
            onClick={() => setScale(Math.min(scale * 1.2, 2.5))}
            disabled={scale >= 2.5 || loading}
            aria-label='Zoom in'
          >
            <ZoomIn className='h-4 w-4' />
          </Button>

          <Button
            variant='outline'
            size='icon'
            onClick={() => setScale(Math.max(scale / 1.2, 0.4))}
            disabled={scale <= 0.4 || loading}
            aria-label='Zoom out'
          >
            <ZoomOut className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <div className='flex-1 overflow-auto bg-light-400/40 dark:bg-dark-800/40'>
        {loading ? (
          <div className='flex h-full items-center justify-center'>
            <Loader2 className='h-12 w-12 animate-spin text-accent' />
          </div>
        ) : error ? (
          <div className='flex h-full items-center justify-center p-4 text-center'>
            <p className='text-destructive'>Error loading PDF: {error}</p>
          </div>
        ) : (
          <Document
            file={file}
            loading={<Loader2 className='h-12 w-12 animate-spin text-accent' />}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(err) => {
              console.error('Error loading PDF document:', err);
              setError('Failed to load PDF document');
            }}
            rotate={rotation}
            className='flex justify-center'
          >
            <Page
              pageNumber={currentPage}
              scale={scale}
              className='shadow-lg'
              renderTextLayer={false}
              renderAnnotationLayer={false}
              loading={<Loader2 className='h-8 w-8 animate-spin text-accent' />}
            />
          </Document>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;
