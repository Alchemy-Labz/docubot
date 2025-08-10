# Uploading Documents to DocuBot

This guide will walk you through the process of uploading and processing different types of documents in DocuBot.

## Supported Document Types

DocuBot currently supports the following file formats:

| Format           | Extensions | Description                         |
| ---------------- | ---------- | ----------------------------------- |
| PDF              | .pdf       | Portable Document Format files      |
| Plain Text       | .txt       | Simple text documents               |
| Markdown         | .md        | Formatted text with Markdown syntax |
| Rich Text Format | .rtf       | Formatted text with styling         |
| Word Documents   | .docx      | Microsoft Word documents            |

## File Size Limitations

- **Maximum file size**: Varies by plan
  - **Starter plan**: 25MB per document
  - **Pro plan**: 50MB per document
  - **Team plan**: 100MB per document
- **Free plan**: Up to 5 documents total
- **Professional plan**: Up to 12 documents total
- **Developer plan**: Up to 50 documents (coming soon)

## How to Upload Documents

### Method 1: From the Dashboard

1. Log in to your DocuBot account
2. Navigate to your dashboard
3. Click the "Upload Document" button (or the "+ Doc" icon in the navigation)
4. Select a file from your device or drag and drop it into the upload area
5. Wait for the upload and processing to complete

### Method 2: From the Documents Page

1. Go to the "My Documents" section of your dashboard
2. Look for the placeholder card with a "+" icon
3. Click on this card to open the uploader
4. Choose a file from your device
5. The document will begin uploading and processing automatically

## Upload Process Indicators

When uploading a document, you'll see several status indicators:

1. **Authenticating**: Verifying your account credentials
2. **Uploading**: Transferring the file to DocuBot (with percentage indicator)
3. **Uploaded**: File transfer complete
4. **Saving**: Recording document information in the database
5. **Generating AI Embeddings**: Processing document for AI interaction (this may take longer for larger documents)

## Document Processing Details

When DocuBot processes your document, it performs several operations:

1. **Text Extraction**: Converts the document into machine-readable text
2. **Chunking**: Breaks the text into manageable sections
3. **Vector Embeddings**: Creates AI-readable representations of the text
4. **Storage**: Saves both the original document and its processed form

## Best Practices for Document Uploads

For optimal results with DocuBot:

- **Clean Documents**: Use documents with clear, readable text
- **Searchable PDFs**: Upload PDFs that are text-based, not scanned images
- **Structured Content**: Documents with clear headings and organization work best
- **Recent Versions**: Use current file formats when possible
- **Split Large Documents**: For very large documents, consider splitting them into smaller files

## Troubleshooting Upload Issues

If you encounter problems while uploading:

- **File Too Large**: Compress the PDF or split it into smaller documents
- **Unsupported Format**: Convert your document to a supported format
- **Upload Stuck**: Try refreshing the page and uploading again
- **Processing Errors**: Ensure your document isn't password-protected or corrupted

If uploads consistently fail, check that:

- You have a stable internet connection
- Your browser is up to date
- You haven't reached your plan's document limit

## Converting Unsupported Formats

If you have documents in formats DocuBot doesn't support:

1. **Spreadsheets**: Export as PDF or convert to text
2. **Presentations**: Save as PDF
3. **Image-only Documents**: Use OCR software to convert to searchable PDF
4. **E-books**: Convert to PDF or text format

## After Uploading

Once your document is successfully uploaded:

1. It will appear in your documents list
2. Click on the document to open it
3. You can now view the document and start chatting with it
4. The document will remain available until you delete it (Professional plan) or reach your document limit

For further assistance with document uploads, please contact our support team at support@docubot.app.
