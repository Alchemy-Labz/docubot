// src/components/SEO/StructuredData.tsx
import Script from 'next/script';

interface StructuredDataProps {
  type?: 'website' | 'product' | 'organization';
}

export default function StructuredData({ type = 'website' }: StructuredDataProps) {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DocuBot',
    description: 'AI-powered document analysis and chat platform',
    url: 'https://docubot.ai',
    logo: 'https://docubot.ai/logo.png',
    sameAs: [
      'https://twitter.com/docubot',
      'https://linkedin.com/company/docubot',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'support@docubot.ai',
    },
  };

  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DocuBot',
    description: 'Transform your PDFs into interactive conversations with AI-powered document analysis',
    url: 'https://docubot.ai',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://docubot.ai/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const productData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'DocuBot',
    description: 'AI-powered document analysis and chat platform that transforms PDFs into interactive conversations',
    url: 'https://docubot.ai',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      description: 'Free plan available with premium features',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      'AI-powered document analysis',
      'Natural language chat interface',
      'RAG (Retrieval-Augmented Generation) technology',
      'Multi-document support',
      'Secure document storage',
      'Real-time insights extraction',
    ],
  };

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://docubot.ai',
      },
    ],
  };

  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is DocuBot?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'DocuBot is an AI-powered platform that transforms your PDF documents into interactive conversations. You can upload documents and ask questions in natural language to get instant insights.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does DocuBot work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'DocuBot uses advanced AI technology including RAG (Retrieval-Augmented Generation) and vector embeddings to analyze your documents. When you ask a question, it finds the most relevant information and provides accurate, context-aware answers.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is DocuBot free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, DocuBot offers a free plan that allows you to get started with document analysis. We also offer premium plans with additional features and higher usage limits.',
        },
      },
      {
        '@type': 'Question',
        name: 'What file formats does DocuBot support?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'DocuBot primarily supports PDF documents, with plans to expand to additional formats like Word documents, PowerPoint presentations, and text files.',
        },
      },
    ],
  };

  const getStructuredData = () => {
    switch (type) {
      case 'product':
        return [organizationData, websiteData, productData, breadcrumbData, faqData];
      case 'organization':
        return [organizationData, websiteData, breadcrumbData];
      default:
        return [organizationData, websiteData, productData, breadcrumbData, faqData];
    }
  };

  return (
    <>
      {getStructuredData().map((data, index) => (
        <Script
          key={index}
          id={`structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data),
          }}
        />
      ))}
    </>
  );
}
