import { NextRequest, NextResponse } from 'next/server';
import { UnRTF } from 'node-unrtf';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';
import { ERROR_MESSAGES } from '@/lib/constants/appConstants';

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: ERROR_MESSAGES.NO_FILE_PROVIDED }, { status: 400 });
    }

    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'rtf-'));
    const filePath = path.join(tempDir, 'temp.rtf');

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const unRtf = new UnRTF();
    const result = await unRtf.convert(filePath, { outputHtml: true });

    await fs.rm(tempDir, { recursive: true, force: true });

    return NextResponse.json({ html: result });
  } catch (error) {
    console.error('RTF conversion error:', error);
    return NextResponse.json({ error: 'Failed to convert RTF file' }, { status: 500 });
  }
};
