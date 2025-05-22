// src/app/api/docs/[filename]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

// Define the available documentation filenames
const availableDocs = [
  'introduction.md',
  'getting-started.md',
  'uploading-documents.md',
  'chatting-with-documents.md',
  'document-management.md',
  'code-repository-analysis.md',
  'exporting-chats.md',
  'subscription-plans.md',
  'privacy-security.md',
  'troubleshooting.md',
];

// Correct parameter typing for Next.js App Router
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // Security check: Only allow specific filenames to prevent path traversal
    if (!availableDocs.includes(filename)) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Construct the file path
    const filePath = path.join(process.cwd(), 'docs', filename);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Read file content
    const fileContent = await fs.readFile(filePath, 'utf8');

    // Return the file content
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error fetching documentation:', error);
    return NextResponse.json({ error: 'Failed to load documentation' }, { status: 500 });
  }
}
