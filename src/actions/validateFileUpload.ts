'use server';

import { auth } from '@clerk/nextjs/server';
import { adminDb } from '@/lib/firebase/firebaseAdmin';
import { FILE_UPLOAD, PLAN_TYPES } from '@/lib/constants/appConstants';

interface FileValidationResult {
  isValid: boolean;
  error?: string;
  maxFileSize?: number;
  planType?: string;
}

/**
 * Server-side file validation that checks file size against user's plan limits
 */
export async function validateFileUpload(
  fileName: string,
  fileSize: number,
  fileType: string
): Promise<FileValidationResult> {
  try {
    // Protect this action - require authentication
    auth.protect();
    const { userId } = await auth();
    
    if (!userId) {
      return {
        isValid: false,
        error: 'Authentication required',
      };
    }

    // Get user's plan type from Firestore
    const userDoc = await adminDb.collection('users').doc(userId).get();
    const userData = userDoc.data();
    const planType = userData?.planType || PLAN_TYPES.STARTER;

    // Get file size limit for user's plan
    const maxFileSize = FILE_UPLOAD.getMaxFileSizeForPlan(planType);

    // Validate file size
    if (fileSize > maxFileSize) {
      const maxSizeDisplay = FILE_UPLOAD.formatFileSize(maxFileSize);
      const fileSizeDisplay = FILE_UPLOAD.formatFileSize(fileSize);
      
      return {
        isValid: false,
        error: `File "${fileName}" (${fileSizeDisplay}) exceeds the maximum allowed size (${maxSizeDisplay}) for your ${planType} plan.`,
        maxFileSize,
        planType,
      };
    }

    // Validate file type
    const acceptedTypes = Object.keys(FILE_UPLOAD.ACCEPTED_FILE_TYPES);
    if (!acceptedTypes.includes(fileType)) {
      return {
        isValid: false,
        error: `File type "${fileType}" is not supported. Supported types: ${acceptedTypes.join(', ')}`,
        maxFileSize,
        planType,
      };
    }

    // Additional security checks
    if (fileSize <= 0) {
      return {
        isValid: false,
        error: 'Invalid file size',
        maxFileSize,
        planType,
      };
    }

    if (!fileName || fileName.trim().length === 0) {
      return {
        isValid: false,
        error: 'Invalid file name',
        maxFileSize,
        planType,
      };
    }

    // File is valid
    return {
      isValid: true,
      maxFileSize,
      planType,
    };

  } catch (error) {
    console.error('Error validating file upload:', error);
    return {
      isValid: false,
      error: 'Server error during file validation',
    };
  }
}

/**
 * Get user's current plan and file size limits
 */
export async function getUserFileLimits(): Promise<{
  planType: string;
  maxFileSize: number;
  maxFileSizeDisplay: string;
}> {
  try {
    auth.protect();
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Authentication required');
    }

    // Get user's plan type from Firestore
    const userDoc = await adminDb.collection('users').doc(userId).get();
    const userData = userDoc.data();
    const planType = userData?.planType || PLAN_TYPES.STARTER;

    // Get file size limit for user's plan
    const maxFileSize = FILE_UPLOAD.getMaxFileSizeForPlan(planType);
    const maxFileSizeDisplay = FILE_UPLOAD.formatFileSize(maxFileSize);

    return {
      planType,
      maxFileSize,
      maxFileSizeDisplay,
    };

  } catch (error) {
    console.error('Error getting user file limits:', error);
    throw new Error('Failed to get user file limits');
  }
}
