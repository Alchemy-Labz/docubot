# Exporting Chats and Results from DocuBot

DocuBot allows you to export your document conversations and AI-generated insights in various formats. This guide explains how to save and share the valuable information extracted from your documents.

## Why Export Your Chats

Exporting chats from DocuBot is useful for:

- Creating permanent records of your AI conversations
- Sharing insights with colleagues or team members
- Including document analysis in reports or presentations
- Keeping records of document Q&A sessions
- Backing up important document interactions

## Supported Export Formats

DocuBot supports exporting your chats in several formats:

### PDF Format

- Most professional presentation
- Maintains formatting and structure
- Includes document information and timestamps
- Ideal for sharing with others or for archiving

### CSV Format

- Spreadsheet-friendly format
- Each message as a separate row with metadata
- Useful for data analysis or integration with other tools
- Easy to import into Excel, Google Sheets, or other applications

### JSON Format

- Complete data preservation
- Includes all message metadata
- Best for programmatic use or data analysis
- Useful for developers or for integration with other systems

## How to Export Your Chats

### Exporting from the Chat Interface

1. Open the document you want to export chats from
2. Look for the export button (typically in the top-right corner of the chat interface)
3. Click the button to open export options
4. Select your preferred export format (PDF, CSV, or JSON)
5. Confirm your selection
6. The file will be generated and downloaded to your device

### Exporting from the Dashboard (Coming Soon)

1. Navigate to your Documents dashboard
2. Find the document with the chat you want to export
3. Click the "Options" or "More" button
4. Select "Export Chat" from the menu
5. Choose your preferred format
6. Download the exported file

## Export Contents

When you export a chat, the following information is included:

- **Document Information**: Name, type, and upload date
- **All Messages**: Both your questions and DocuBot's answers
- **Timestamps**: When each message was sent
- **Message Sequence**: The order of the conversation
- **Metadata**: Additional information about the chat session

## Privacy Considerations

When exporting and sharing chats:

- Exported files contain the text from your document interactions
- Consider the sensitivity of your document content before sharing
- No login credentials are included in export files
- DocuBot does not track how you use exported files

## Export Limitations

Be aware of these limitations when exporting:

- **Free Plan**: Basic export functionality
- **Professional Plan**: All export formats available
- **Export Size**: Very long conversations may be truncated in certain formats
- **Formatting**: Some complex formatting may be simplified in exports
- **Images**: Document images are not included in exports

## Best Practices for Chat Exports

For the most effective use of exported chats:

1. **Export After Completion**: Wait until your Q&A session is complete
2. **Use Descriptive Filenames**: When saving exports locally
3. **Consider Format Purpose**: Choose PDF for sharing, JSON for data preservation
4. **Organize Exports**: Create a system for categorizing your exports
5. **Include Context**: When sharing exports, provide context about the document

## Batch Exporting (Coming Soon)

In future updates, DocuBot plans to implement:

- Exporting multiple chat sessions at once
- Scheduled automated exports
- Export customization options
- Additional export formats

## Troubleshooting Export Issues

If you encounter problems with exports:

- **Download Fails**: Check your browser's download settings
- **File Corruption**: Try exporting again or in a different format
- **Missing Content**: Ensure the chat loaded completely before exporting
- **Format Issues**: If one format doesn't work, try another

## Export Examples

Here's what to expect in different export formats:

### PDF Example

```
DocuBot Chat Export
Document: quarterly-report-2024.pdf
Date: May 20, 2025

User (10:15 AM):
What were the total sales for Q1?

DocuBot (10:15 AM):
According to the document, total sales for Q1 2024 were $3.45 million,
representing a 12% increase over the same period last year.
```

### CSV Example

```
timestamp,role,message
2025-05-20T10:15:00,user,"What were the total sales for Q1?"
2025-05-20T10:15:12,assistant,"According to the document, total sales for Q1 2024 were $3.45 million, representing a 12% increase over the same period last year."
```

### JSON Example

```json
{
  "document": {
    "name": "quarterly-report-2024.pdf",
    "id": "d0c5a7b9",
    "created_at": "2025-05-15T08:30:00Z"
  },
  "messages": [
    {
      "id": "msg1",
      "timestamp": "2025-05-20T10:15:00Z",
      "role": "user",
      "content": "What were the total sales for Q1?"
    },
    {
      "id": "msg2",
      "timestamp": "2025-05-20T10:15:12Z",
      "role": "assistant",
      "content": "According to the document, total sales for Q1 2024 were $3.45 million, representing a 12% increase over the same period last year."
    }
  ]
}
```

For additional help with exports, contact our support team at support@docubot.app.
