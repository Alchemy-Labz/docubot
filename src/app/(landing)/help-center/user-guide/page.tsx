import MarkdownRenderer from '@/components/Dashboard/Markdown';
import React from 'react';

const markdown = `
# Table of Contents

<details>
<summary>1. Introduction</summary>

   - [Introduction](#introduction) <br />
    - [Overview of the Application](#overview-of-the-application)  
    - [Key Features](#key-features)  
    - [Who Should Use This Application?](#who-should-use-this-application)

</details>

<details>
<summary>2. Getting Started</summary>

   - [Getting Started](#getting-started) <br />
    - [System Requirements](#system-requirements)  
    - [Installation Guide](#installation-guide)  
    - [Account Setup and Login](#account-setup-and-login)

</details>

<details>
<summary>3. Uploading a PDF</summary>

   - [Uploading a PDF](#uploading-a-pdf) <br />
    - [Step-by-Step Guide to Uploading a PDF](#step-by-step-guide-to-uploading-a-pdf)  
    - [Supported File Formats and Sizes](#supported-file-formats-and-sizes)  
    - [Troubleshooting Upload Issues](#troubleshooting-upload-issues)

</details>

<details>
<summary>4. Understanding Vector Embeddings and Searches</summary>

   - [Understanding Vector Embeddings and Searches](#understanding-vector-embeddings-and-searches) <br />
    - [What are Vector Embeddings?](#what-are-vector-embeddings)  
    - [How Vector Searches Work](#how-vector-searches-work)  
    - [Why This Technology is Important](#why-this-technology-is-important)

</details>

<details>
<summary>5. Chatting with Your PDF</summary>

   - [Chatting with Your PDF](#chatting-with-your-pdf) <br />
    - [How to Initiate a Chat](#how-to-initiate-a-chat)  
    - [Asking Questions About Your PDF](#asking-questions-about-your-pdf)  
    - [Understanding the Responses](#understanding-the-responses)  
    - [Use Cases for Chatting with PDFs](#use-cases-for-chatting-with-pdfs)

</details>

<details>
<summary>6. Advanced Features</summary>

   - [Advanced Features](#advanced-features) <br />
    - [Customizing the Chat Experience](#customizing-the-chat-experience)  
    - [Managing Multiple PDFs](#managing-multiple-pdfs)  
    - [Exporting and Sharing Chat Transcripts](#exporting-and-sharing-chat-transcripts)  
    - [Integrating with Other Tools and Applications](#integrating-with-other-tools-and-applications)

</details>

<details>
<summary>7. Common Issues and Troubleshooting</summary>

   - [Common Issues and Troubleshooting](#common-issues-and-troubleshooting) <br />
    - [Unable to Upload a PDF](#unable-to-upload-a-pdf)  
    - [Incorrect or Unexpected Chat Responses](#incorrect-or-unexpected-chat-responses)  
    - [Performance and Speed Issues](#performance-and-speed-issues)  
    - [Contacting Support](#contacting-support)

</details>

<details>
<summary>8. Best Practices and Tips</summary>

   - [Best Practices and Tips](#best-practices-and-tips) <br />
    - [How to Phrase Questions for Better Results](#how-to-phrase-questions-for-better-results)  
    - [Organizing Your PDF Library](#organizing-your-pdf-library)  
    - [Maximizing the Use of Vector Searches](#maximizing-the-use-of-vector-searches)

</details>

<details>
<summary>9. Security and Privacy</summary>

   - [Security and Privacy](#security-and-privacy) <br />
    - [How Your Data is Handled](#how-your-data-is-handled)  
    - [Tips for Keeping Your Information Secure](#tips-for-keeping-your-information-secure)  
    - [Compliance with Data Protection Regulations](#compliance-with-data-protection-regulations)

</details>

<details>
<summary>10. FAQs</summary>

   - [FAQs](#faqs) <br />
    - [Frequently Asked Questions](#frequently-asked-questions)  
    - [Quick Tips for New Users](#quick-tips-for-new-users)

</details>

<details>
<summary>11. Get More Help</summary>

   - [Get More Help](#get-more-help) <br />
    - [Summary of Key Points](#summary-of-key-points)  
    - [Where to Go for More Help](#where-to-go-for-more-help)

</details>

<br />

---

# Introduction

## Overview of the Application

Welcome to [Application Name], an innovative AI-powered tool designed to revolutionize how you interact with PDF documents. Our application leverages advanced vector embeddings and vector searches to enable users to chat with their PDFs, making it easier to find, understand, and utilize the information contained within your documents.

Whether you’re a researcher, student, or professional, [Application Name] simplifies the process of extracting insights from large PDF files by allowing you to ask questions and receive relevant answers directly from the document.

## Key Features

- **AI-Powered Chat**: Interact with your PDFs as if they were a knowledgeable assistant.
- **Vector Embeddings**: Leverage cutting-edge technology to understand the context of your questions.
- **Multiple PDF Management**: Upload, organize, and chat with multiple documents simultaneously.
- **Export Options**: Save and share chat transcripts for future reference.
- **User-Friendly Interface**: Designed for users of all technical levels, including those new to AI.

## Who Should Use This Application?

This application is ideal for anyone who regularly works with PDF documents and wants to streamline their workflow. It’s particularly useful for:

- Researchers and Academics
- Students and Educators
- Legal Professionals
- Business Analysts
- Content Creators

# Getting Started

## System Requirements

Before you begin, ensure your system meets the following requirements:

- **Operating System**: Windows 10 or later, macOS 10.14 or later, or a modern Linux distribution.
- **Internet Connection**: A stable connection is required for the chat functionality.
- **Browser**: Latest versions of Chrome, Firefox, Safari, or Edge.

## Installation Guide

1. **Download**: Visit the official website to download the installer for your operating system.
2. **Run the Installer**: Follow the on-screen instructions to complete the installation.
3. **Launch the Application**: Open the application from your desktop or start menu.

## Account Setup and Login

1. **Create an Account**: On the login screen, click “Sign Up” and fill in the required details.
2. **Verify Your Email**: Check your email for a verification link and click it to activate your account.
3. **Login**: Enter your credentials and click “Login” to access the application.

# Uploading a PDF

## Step-by-Step Guide to Uploading a PDF

1. **Open the Application**: Launch [Application Name] on your device.
2. **Navigate to the Upload Section**: Click on the “Upload PDF” button in the main dashboard.
3. **Select Your PDF**: Use the file browser to select the PDF you want to upload.
4. **Confirm Upload**: Click “Open” to upload the file. The application will process the document and prepare it for chat.

## Supported File Formats and Sizes

- **Supported Formats**: PDF
- **Maximum File Size**: 50MB

## Troubleshooting Upload Issues

- **Slow Upload**: Ensure your internet connection is stable. Larger files may take longer to upload.
- **Unsupported Format**: Ensure the file is in PDF format. Other formats are not currently supported.
- **File Size Too Large**: Compress the PDF or split it into smaller parts before uploading.

# Understanding Vector Embeddings and Searches

## What are Vector Embeddings?

Vector embeddings are mathematical representations of text data that capture the context and meaning of words and phrases in a high-dimensional space. In simpler terms, it’s a way for the AI to understand the content of your PDF on a deeper level, allowing it to respond to questions in a meaningful and accurate way.

## How Vector Searches Work

When you ask a question, the application converts it into a vector and compares it to the vectors generated from your PDF. The AI then finds the closest match or matches, enabling it to deliver precise answers based on the content of your document.

## Why This Technology is Important

This technology is crucial because it allows for more accurate and context-aware interactions with your documents. Traditional keyword searches often miss the context or nuance of a query, but vector embeddings enable a deeper understanding, leading to more relevant and helpful responses.

# Chatting with Your PDF

## How to Initiate a Chat

1. **Upload Your PDF**: Ensure your document is uploaded and processed.
2. **Start a Chat Session**: Click on the “Chat” button next to the uploaded PDF.
3. **Ask a Question**: Type your question in the chat box and hit “Enter.”

## Asking Questions About Your PDF

You can ask a wide range of questions, such as:

- **Summarize Content**: “Can you summarize the key points of this document?”
- **Locate Information**: “Where does the document mention [specific topic]?”
- **Clarify Details**: “What does the author mean by [specific term]?”

## Understanding the Responses

The AI will provide answers based on the content of the PDF. It’s important to phrase your questions clearly to get the most accurate responses. If the answer is not what you expected, try rephrasing the question or providing more context.

## Use Cases for Chatting with PDFs

- **Research**: Quickly locate and understand key information within academic papers.
- **Legal Review**: Identify and clarify legal terms or clauses in contracts.
- **Content Creation**: Extract relevant data for articles or reports.

# Advanced Features

## Customizing the Chat Experience

- **Personalized Settings**: Adjust the AI’s response style or level of detail in the settings menu.
- **Keyword Highlights**: Enable highlighting of key terms in the chat responses.

## Managing Multiple PDFs

- **Multi-Document Chat**: You can chat with multiple PDFs simultaneously by switching between them in the chat interface.
- **Document Organization**: Use folders or tags to organize your PDFs for easier access.

## Exporting and Sharing Chat Transcripts

- **Export as PDF**: Save your chat history as a PDF for future reference.
- **Share via Email**: Send the chat transcript directly to colleagues or collaborators.

## Integrating with Other Tools and Applications

- **API Integration**: [Application Name] offers API support to integrate the chat functionality with other tools or custom workflows.

# Common Issues and Troubleshooting

## Unable to Upload a PDF

- **Check File Format**: Ensure the file is in PDF format.
- **File Size**: Verify that the file size does not exceed the maximum limit.
- **Re-upload**: Try uploading the file again after checking the above points.

## Incorrect or Unexpected Chat Responses

- **Rephrase the Question**: If the response isn’t accurate, try asking the question in a different way.
- **Check Document Content**: Ensure the PDF contains the information you're seeking.

## Performance and Speed Issues

- **Close Unnecessary Applications**: Free up system resources to improve performance.
- **Check Internet Connection**: A stable connection is crucial for optimal performance.

## Contacting Support

- **In-App Help**: Access the help section within the application for immediate assistance.
- **Email Support**: Contact our support team via email at [support email address].

# Best Practices and Tips

## How to Phrase Questions for Better Results

- **Be Specific**: Clearly state what you are looking for.
- **Context Matters**: Provide enough context to guide the AI to the right section of the PDF.

## Organizing Your PDF Library

- **Use Tags**: Apply tags to your PDFs for easy searching and filtering.
- **Create Folders**: Organize related documents into folders.

## Maximizing the Use of Vector Searches

- **Understand the Document’s Structure**: Knowing how your PDF is organized can help you ask more targeted questions.
- **Experiment with Queries**: Don’t hesitate to try different ways of asking questions to see what yields the best results.

# Security and Privacy

## How Your Data is Handled

- **Encryption**: All PDFs and chat data are encrypted both in transit and at rest.
- **Data Privacy**: We do not share your data with third parties without your explicit consent.

## Tips for Keeping Your Information Secure

- **Use Strong Passwords**: Ensure your account is protected with a strong, unique password.
- **Regular Updates**: Keep the application updated to benefit from the latest security patches.

## Compliance with Data Protection Regulations

[Application Name] complies with major data protection regulations such as GDPR and CCPA, ensuring your data is handled with the highest standards of privacy and security.

# FAQs

## Frequently Asked Questions

- **Can I upload multiple PDFs at once?**

  Yes, you can upload and manage multiple PDFs simultaneously.

- **What languages does the AI support?**

  The AI currently supports [list of languages].

- **How do I export a chat transcript?**

  Go to the chat settings and select “Export as PDF” to save the conversation.

## Quick Tips for New Users

- **Start Simple**: Begin with basic questions to get a feel for how the AI responds.
- **Explore Features**: Don’t hesitate to explore advanced settings and features to customize your experience.

# Get More Help

## Summary of Key Points

[Application Name] is a powerful tool designed to make interacting with PDF documents easier and more efficient. By leveraging AI and vector search technology, it allows you to extract meaningful information from your documents in a conversational manner.

## Where to Go for More Help

For additional assistance, visit our [help center/support page] or contact our support team. We are here to help you make the most out of [Application Name].

`;
function userGuide() {
  return (
    <div className='mx-auto w-full overflow-auto bg-gradient-to-br from-accent2/40 to-accent/40 px-4 py-12 dark:from-accent3/30 dark:to-accent4/30 sm:px-6 lg:px-8'>
      <h1 className='px-6 py-4 text-3xl font-bold text-dark-500 dark:text-light-300'>
        User Guide
      </h1>
      <div className='my-6 border border-b' />
      <div className='mx-auto my-12 w-full max-w-7xl overflow-auto rounded-lg bg-light-500/60 px-4 dark:bg-dark-900/60 sm:px-6 lg:px-8'>
        <MarkdownRenderer>{markdown}</MarkdownRenderer>
      </div>
    </div>
  );
}

export default userGuide;
