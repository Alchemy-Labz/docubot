/* eslint-disable react/function-component-definition */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  definition: string;
  _key?: string;
}

export default function Mermaid({ definition, _key }: MermaidProps) {
  const [diagramId] = useState(
    () => `mermaid-${_key || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`}`
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize mermaid configuration
    mermaid.initialize({
      startOnLoad: false,
      theme: 'forest',
      securityLevel: 'loose',
      fontFamily: 'inherit',
    });

    const currentRef = containerRef.current;

    return () => {
      // Cleanup function
      if (currentRef) {
        currentRef.innerHTML = '';
      }
    };
  }, []);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current || !definition.trim()) return;

      try {
        // Clear previous content and error
        containerRef.current.innerHTML = '';
        setError(null);

        // Ensure the container is empty before rendering
        const { svg } = await mermaid.render(diagramId, definition.trim());

        if (containerRef.current) {
          containerRef.current.innerHTML = svg;

          // Add styles to SVG
          const svgElement = containerRef.current.querySelector('svg');
          if (svgElement) {
            svgElement.style.maxWidth = '100%';
            svgElement.style.height = 'auto';
            svgElement.style.borderRadius = '0.375rem'; // rounded-md
          }
        }
      } catch (err) {
        console.error('Error rendering mermaid diagram:', err);
        setError('Failed to render diagram. Please check the syntax.');
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
      }
    };

    renderDiagram();
  }, [definition, diagramId]);

  return (
    <div className='relative w-full'>
      <div ref={containerRef} className='mermaid-container w-full overflow-x-auto py-4' />
      {error && <div className='mt-2 text-sm text-red-500'>{error}</div>}
    </div>
  );
}
