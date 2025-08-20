'use client';

import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import './prism-synthwave84.css';
import Mermaid from '@/hooks/useMermaid';

interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface TableProps {
  children?: React.ReactNode;
}

interface TableHeadProps {
  children?: React.ReactNode;
}

interface TableRowProps {
  children?: React.ReactNode;
}

interface TableCellProps {
  isHeader?: boolean;
  children?: React.ReactNode;
}

interface MarkdownRendererProps {
  children: string;
}

interface ImageProps {
  src?: string | Blob;
  alt?: string;
  title?: string;
  width?: string | number;
  height?: string | number;
}

const MarkdownRenderer = ({ children: markdown }: MarkdownRendererProps) => {
  // Detect and extract mermaid code blocks
  const prepareMermaidContent = (content: string) => {
    const mermaidPattern = /```mermaid\n([\s\S]*?)```/g;
    const extractedMermaid: string[] = [];
    const processedContent = content.replace(mermaidPattern, (match, mermaidContent) => {
      const placeholder = `<mermaid-diagram-${extractedMermaid.length}/>`;
      extractedMermaid.push(mermaidContent.trim());
      return placeholder;
    });

    return { processedContent, extractedMermaid };
  };

  const { processedContent, extractedMermaid } = prepareMermaidContent(markdown);

  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        // Headings
        h1: ({ children }) => <h1 className='my-4 text-2xl font-bold text-accent'>{children}</h1>,
        h2: ({ children }) => (
          <h2 className='my-3 text-xl font-semibold text-accent2'>{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className='my-2 text-lg font-medium text-primary'>{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className='my-2 text-base font-medium text-light-300'>{children}</h4>
        ),
        h5: ({ children }) => (
          <h5 className='my-1 text-sm font-medium text-light-300'>{children}</h5>
        ),
        h6: ({ children }) => (
          <h6 className='my-1 text-xs font-medium text-light-300'>{children}</h6>
        ),

        // Paragraphs and basic elements
        p: ({ children }) => <p className='my-2 leading-relaxed'>{children}</p>,
        em: ({ children }) => <em className='italic'>{children}</em>,
        strong: ({ children }) => <strong className='font-bold'>{children}</strong>,
        del: ({ children }) => <del className='line-through'>{children}</del>,
        hr: () => <hr className='my-4 border-t border-dark-400' />,

        // Lists
        ul: ({ children }) => <ul className='my-2 list-inside list-disc pl-4'>{children}</ul>,
        ol: ({ children }) => <ol className='my-2 list-inside list-decimal pl-4'>{children}</ol>,
        li: ({ children }) => <li className='my-1'>{children}</li>,

        // Links
        a: ({ href, children, title }) => (
          <Link
            href={href || '#'}
            className='text-accent hover:underline'
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            title={title}
          >
            {children}
          </Link>
        ),

        // Blockquotes
        blockquote: ({ children }) => (
          <blockquote className='my-4 border-l-4 border-primary pl-4 italic text-muted-foreground'>
            {children}
          </blockquote>
        ),

        // Code blocks and inline code
        code({ inline, className, children, ...props }: CodeBlockProps) {
          // Check for mermaid placeholder
          if (
            typeof children === 'string' &&
            children.startsWith('<mermaid-diagram-') &&
            children.endsWith('/>')
          ) {
            const index = parseInt(
              children.replace('<mermaid-diagram-', '').replace('/>', ''),
              10
            );
            if (!isNaN(index) && extractedMermaid[index]) {
              return (
                <div className='my-4 overflow-auto rounded-md bg-dark-800 p-4'>
                  <Mermaid definition={extractedMermaid[index]} _key={`md-mermaid-${index}`} />
                </div>
              );
            }
          }

          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag='div'
              className='my-4 rounded-md bg-transparent px-1 py-0.5 font-mono text-base'
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code
              className='rounded bg-dark-700 px-1 py-0.5 font-mono text-base text-light-100'
              {...props}
            >
              {children}
            </code>
          );
        },

        // Images
        img(props) {
          const { src, alt, title } = props;
          if (!src) return null;

          return (
            <div className='my-4 flex flex-col items-center'>
              <div className='relative max-h-96 w-full'>
                <img
                  src={typeof src === 'string' ? src : URL.createObjectURL(src)}
                  alt={alt || ''}
                  title={title}
                  className='mx-auto max-h-96 rounded-md object-contain'
                />
              </div>
              {alt && (
                <div className='mt-1 flex justify-center'>
                  <p className='border-primary-400 bg-accent1-300 dark:border-primary-600 dark:bg-accent1-800 rounded-md border px-3 py-0.5 text-xs font-light text-dark-600 dark:text-light-500'>
                    {alt}
                  </p>
                </div>
              )}
            </div>
          );
        },

        // Tables
        table: ({ children }: TableProps) => (
          <div className='my-4 overflow-x-auto'>
            <table className='min-w-full divide-y divide-dark-400'>{children}</table>
          </div>
        ),
        thead: ({ children }: TableHeadProps) => <thead className='bg-dark-600'>{children}</thead>,
        tbody: ({ children }: TableProps) => (
          <tbody className='divide-y divide-dark-700'>{children}</tbody>
        ),
        tr: ({ children }: TableRowProps) => <tr>{children}</tr>,
        th: ({ children }: TableCellProps) => (
          <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-light-300'>
            {children}
          </th>
        ),
        td: ({ children }: TableCellProps) => (
          <td className='whitespace-nowrap px-6 py-4 text-light-100'>{children}</td>
        ),
      }}
    >
      {processedContent}
    </Markdown>
  );
};

export default MarkdownRenderer;
