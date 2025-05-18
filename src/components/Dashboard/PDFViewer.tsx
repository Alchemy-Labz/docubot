// src/components/Dashboard/PDFViewer.tsx
'use client';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { Document, Page, pdfjs } from 'react-pdf';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { Input } from '../ui/input';
import { ERROR_MESSAGES } from '@/lib/constants/appConstants';

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
          throw new Error(`${ERROR_MESSAGES.FAILED_TO_FETCH_PDF}: ${response.status}`);
        }
        const fileBlob = await response.blob();
        setFile(fileBlob);
      } catch (err) {
        console.error('Error fetching PDF file:', err);
        setError(err instanceof Error ? err.message : ERROR_MESSAGES.FAILED_TO_FETCH_PDF);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchFile();
    }
  }, [url]);

  const handlePageChange = (newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, numPages));
    setCurrentPage(validPage);
  };

  const handlePageNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      handlePageChange(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        handlePageChange(currentPage - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        handlePageChange(currentPage + 1);
        break;
      case 'Home':
        e.preventDefault();
        handlePageChange(1);
        break;
      case 'End':
        e.preventDefault();
        handlePageChange(numPages);
        break;
      default:
        break;
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setNumPages(numPages);
    setLoading(false);
  };

  return (
    <div
      className='flex h-full w-full flex-col'
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role='application'
      aria-label={`PDF viewer for ${fileName}`}
      aria-describedby='pdf-viewer-instructions'
    >
      <div id='pdf-viewer-instructions' className='sr-only'>
        PDF document viewer. Use arrow keys to navigate pages, or use the navigation controls.
        Current page: {currentPage} of {numPages}
      </div>

      {/* PDF Controls */}
      <div
        className='sticky top-0 z-10 flex items-center justify-between bg-accent3/20 bg-light-600 p-2 shadow-md dark:bg-dark-600'
        role='toolbar'
        aria-label='PDF viewer controls'
      >
        <div className='hidden max-w-[200px] truncate text-sm font-medium md:block'>
          <span className='sr-only'>Document: </span>
          {fileName}
        </div>

        {/* Page Navigation */}
        <div className='flex items-center space-x-2' role='group' aria-label='Page navigation'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1 || loading}
            aria-label={`Go to previous page. Current page: ${currentPage}`}
          >
            <ChevronLeft className='h-4 w-4' aria-hidden='true' />
          </Button>

          <div className='flex items-center space-x-1'>
            <label htmlFor='page-input' className='sr-only'>
              Current page number
            </label>
            <Input
              id='page-input'
              type='number'
              min={1}
              max={numPages}
              value={currentPage}
              onChange={handlePageNumberInput}
              className='w-14 text-center'
              disabled={loading}
              aria-describedby='page-info'
            />
            <span id='page-info' className='text-sm'>
              <span className='sr-only'>of</span>/ {numPages}
            </span>
          </div>

          <Button
            variant='outline'
            size='icon'
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= numPages || loading}
            aria-label={`Go to next page. Current page: ${currentPage}`}
          >
            <ChevronRight className='h-4 w-4' aria-hidden='true' />
          </Button>
        </div>

        {/* View Controls */}
        <div className='flex items-center space-x-2' role='group' aria-label='View controls'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => setRotation((rotation + 90) % 360)}
            disabled={loading}
            aria-label={`Rotate document 90 degrees. Current rotation: ${rotation} degrees`}
          >
            <RotateCw className='h-4 w-4' aria-hidden='true' />
          </Button>

          <Button
            variant='outline'
            size='icon'
            onClick={() => setScale(Math.min(scale * 1.2, 2.5))}
            disabled={scale >= 2.5 || loading}
            aria-label={`Zoom in. Current zoom: ${Math.round(scale * 100)}%`}
          >
            <ZoomIn className='h-4 w-4' aria-hidden='true' />
          </Button>

          <Button
            variant='outline'
            size='icon'
            onClick={() => setScale(Math.max(scale / 1.2, 0.4))}
            disabled={scale <= 0.4 || loading}
            aria-label={`Zoom out. Current zoom: ${Math.round(scale * 100)}%`}
          >
            <ZoomOut className='h-4 w-4' aria-hidden='true' />
          </Button>
        </div>
      </div>

      {/* PDF Content */}
      <div className='flex-1 overflow-auto bg-light-400/40 dark:bg-dark-800/40'>
        {loading ? (
          <div
            className='flex h-full items-center justify-center'
            role='status'
            aria-live='polite'
          >
            <Loader2 className='h-12 w-12 animate-spin text-accent' aria-hidden='true' />
            <span className='sr-only'>Loading PDF document...</span>
          </div>
        ) : error ? (
          <div
            className='flex h-full items-center justify-center p-4 text-center'
            role='alert'
            aria-live='assertive'
          >
            <div>
              <h3 className='mb-2 text-lg font-medium text-destructive'>Error loading PDF</h3>
              <p className='text-destructive'>{error}</p>
            </div>
          </div>
        ) : (
          <Document
            file={file}
            loading={
              <div role='status' aria-label='Loading PDF page'>
                <Loader2 className='h-12 w-12 animate-spin text-accent' aria-hidden='true' />
                <span className='sr-only'>Loading page...</span>
              </div>
            }
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(err) => {
              console.error('Error loading PDF document:', err);
              setError(ERROR_MESSAGES.FAILED_TO_LOAD_PDF_DOCUMENT);
            }}
            rotate={rotation}
            className='flex justify-center'
            aria-label={`PDF document: ${fileName}`}
          >
            <Page
              pageNumber={currentPage}
              scale={scale}
              className='shadow-lg'
              renderTextLayer={false}
              renderAnnotationLayer={false}
              loading={
                <div role='status' aria-label='Loading page content'>
                  <Loader2 className='h-8 w-8 animate-spin text-accent' aria-hidden='true' />
                  <span className='sr-only'>Loading page content...</span>
                </div>
              }
              aria-label={`Page ${currentPage} of ${numPages}`}
            />
          </Document>
        )}
      </div>

      {/* Status for screen readers */}
      <div className='sr-only' aria-live='polite' aria-atomic='true' id='pdf-status'>
        {!loading &&
          !error &&
          `Viewing page ${currentPage} of ${numPages}. Zoom: ${Math.round(scale * 100)}%. Rotation: ${rotation} degrees.`}
      </div>
    </div>
  );
};

export default PDFViewer;
