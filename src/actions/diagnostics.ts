'use server';

import { auth } from '@clerk/nextjs/server';

/**
 * Diagnostic function to check system health and configuration
 */
export async function runDiagnostics() {
  try {
    console.log('🔧 Running system diagnostics...');
    
    // Check authentication
    auth.protect();
    const { userId } = await auth();
    
    const diagnostics = {
      timestamp: new Date().toISOString(),
      userId: userId || 'Not authenticated',
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasOpenAIKey: !!process.env.OPENAI_API_KEY,
        hasPineconeKey: !!process.env.PINECONE_API_KEY,
        hasFirebaseKey: !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
        hasClerkKey: !!process.env.CLERK_SECRET_KEY,
      },
      network: {
        userAgent: 'DocuBot/1.0',
        timestamp: Date.now(),
      },
    };

    console.log('✅ Diagnostics completed:', diagnostics);
    return diagnostics;
  } catch (error) {
    console.error('❌ Diagnostics failed:', error);
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Test OpenAI API connectivity
 */
export async function testOpenAIConnection() {
  try {
    console.log('🔧 Testing OpenAI API connection...');
    
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    // Simple test request to OpenAI
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`OpenAI API responded with status: ${response.status}`);
    }

    console.log('✅ OpenAI API connection successful');
    return { success: true, status: response.status };
  } catch (error) {
    console.error('❌ OpenAI API connection failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Test Pinecone API connectivity
 */
export async function testPineconeConnection() {
  try {
    console.log('🔧 Testing Pinecone API connection...');
    
    if (!process.env.PINECONE_API_KEY) {
      throw new Error('Pinecone API key not configured');
    }

    // Import Pinecone client
    const { Pinecone } = await import('@pinecone-database/pinecone');
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    // Test connection by listing indexes
    const indexes = await pinecone.listIndexes();
    
    console.log('✅ Pinecone API connection successful');
    return { 
      success: true, 
      indexCount: indexes.indexes?.length || 0,
      indexes: indexes.indexes?.map(idx => idx.name) || []
    };
  } catch (error) {
    console.error('❌ Pinecone API connection failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Comprehensive system health check
 */
export async function healthCheck() {
  try {
    console.log('🔧 Running comprehensive health check...');
    
    const [diagnostics, openaiTest, pineconeTest] = await Promise.all([
      runDiagnostics(),
      testOpenAIConnection(),
      testPineconeConnection(),
    ]);

    const healthStatus = {
      overall: 'healthy',
      timestamp: new Date().toISOString(),
      diagnostics,
      services: {
        openai: openaiTest,
        pinecone: pineconeTest,
      },
    };

    // Determine overall health
    if (!openaiTest.success || !pineconeTest.success) {
      healthStatus.overall = 'degraded';
    }

    if (!diagnostics.environment?.hasOpenAIKey || !diagnostics.environment?.hasPineconeKey) {
      healthStatus.overall = 'unhealthy';
    }

    console.log('✅ Health check completed:', healthStatus.overall);
    return healthStatus;
  } catch (error) {
    console.error('❌ Health check failed:', error);
    return {
      overall: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
