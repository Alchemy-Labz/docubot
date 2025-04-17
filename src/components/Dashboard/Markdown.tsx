import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import './prism-synthwave84.css';

interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

type MarkdownRendererProps = {
  children: string;
};

export const MarkdownRenderer = ({ children: markdown }: MarkdownRendererProps) => {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        h1: ({ children }) => (
          <h1 className='my-4 text-2xl font-bold text-neon-300'>{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className='my-3 text-xl font-semibold text-neon-400'>{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className='my-2 text-lg font-medium text-neon-500'>{children}</h3>
        ),
        p: ({ children }) => <p className='my-2 leading-relaxed'>{children}</p>,
        ul: ({ children }) => <ul className='my-2 list-inside list-disc pl-4'>{children}</ul>,
        ol: ({ children }) => <ol className='my-2 list-inside list-decimal pl-4'>{children}</ol>,
        a: ({ href, children }) => (
          <a
            href={href}
            className='text-neon2-300 hover:underline'
            target='_blank'
            rel='noopener noreferrer'
          >
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className='my-4 border-l-4 border-neon-500 pl-4 italic text-light-300'>
            {children}
          </blockquote>
        ),
        code({ inline, className, children, ...props }: CodeBlockProps) {
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
        table: ({ children }) => (
          <div className='my-4 overflow-x-auto'>
            <table className='min-w-full divide-y divide-dark-400'>{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className='bg-dark-600'>{children}</thead>,
        th: ({ children }) => (
          <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-light-300'>
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className='whitespace-nowrap px-6 py-4 text-light-100'>{children}</td>
        ),
      }}
    >
      {markdown}
    </Markdown>
  );
};
