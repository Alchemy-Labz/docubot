'use client';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { Document, Page, pdfjs } from 'react-pdf';
import { useEffect, useState } from 'react';
import { Button } from '@/c/ui/button';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  RotateCw,
  ZoomIn,
  ZoomOut,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { Input } from '../ui/input';
import { useSearchParams } from 'next/navigation';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFViewer = ({ url }: { url: string }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [file, setFile] = useState<Blob | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [scale, setScale] = useState<number>(0.9);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const isPdfVisible = searchParams.get('pdf') !== 'hidden';

  useEffect(() => {
    const fetchFile = async () => {
      setLoading(true);
      try {
        const response = await fetch(url);
        const file = await response.blob();
        setFile(file);
      } catch (error) {
        console.error('Error fetching file:', error);
        setError('Failed to fetch PDF file');
      }
    };
    fetchFile();
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
      <div className='bg-accent-100 dark:bg-accent-800 sticky top-0 z-10 flex items-center justify-between rounded-md bg-accent3/20 p-2 shadow-md'>
        {isPdfVisible && (
          <div className='mt-4 flex items-center space-x-2'>
            <div className='flex items-center space-x-2'>
              <Button
                variant='outline'
                size='icon'
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
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
                  className='w-16 text-center'
                />
                <span>/ {numPages}</span>
              </div>
              <Button
                variant='outline'
                size='icon'
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= numPages}
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
            <div className='flex items-center space-x-2'>
              <Button
                variant='outline'
                size='icon'
                onClick={() => setRotation((rotation + 90) % 360)}
              >
                <RotateCw className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='icon'
                onClick={() => setScale(scale * 1.2)}
                disabled={scale >= 2}
              >
                <ZoomIn className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='icon'
                onClick={() => setScale(scale / 1.2)}
                disabled={scale <= 0.5}
              >
                <ZoomOut className='h-4 w-4' />
              </Button>
            </div>
          </div>
        )}
        <Link
          href={`?pdf=${isPdfVisible ? 'hidden' : 'visible'}`}
          className={`ml-auto ${!isPdfVisible ? 'fixed bottom-4 right-4 z-50' : ''}`}
        >
          <Button variant='outline' size='icon' className='lg:-rotate-90'>
            {isPdfVisible ? (
              <ChevronUp className='h-4 w-4' />
            ) : (
              <ChevronDown className='h-4 w-4' />
            )}
          </Button>
        </Link>
      </div>
      {isPdfVisible && (
        <div className='flex-1 overflow-auto'>
          {!file ? (
            <div className='flex h-full items-center justify-center'>
              <Loader2 className='h-12 w-12 animate-spin text-accent' />
            </div>
          ) : (
            <Document
              file={file}
              loading={null}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={(error) => {
                setError('Failed to load PDF file');
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
              />
            </Document>
          )}
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
