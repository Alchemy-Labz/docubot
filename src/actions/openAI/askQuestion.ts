// askQuestion.ts
/* eslint-disable import/prefer-default-export */
'use server';

import { adminDb } from '@/lib/firebase/firebaseAdmin';
// eslint-disable-next-line import/no-cycle
import { Message } from '@/components/Dashboard/ChatWindow';
import { auth } from '@clerk/nextjs/server';
import { generateLangChainCompletion } from '../langchain/langchain';
import { SUBSCRIPTION_LIMITS, ERROR_MESSAGES, OPENAI_CONFIG } from '@/lib/constants/appConstants';

export const maxDuration = async () => {
  return OPENAI_CONFIG.MAX_DURATION; // Replace this with actual async logic if needed
};

export async function askQuestion(id: string, question: string) {
  try {
    auth().protect();
    const { userId } = await auth();

    if (!userId) {
      console.error('🚀DEBUG askQuestion 1: User ID is null or undefined');
      return {
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED,
      };
    }

    const userRef = adminDb.collection('users').doc(userId);
    const chatRef = userRef.collection('files').doc(id).collection('chat');

    // Check user's subscription status
    const userDoc = await userRef.get();
    const hasActiveMembership = userDoc.data()?.hasActiveMembership ?? false;
    // console.log('🚀 ~ askQuestion ~ hasActiveMembership:', hasActiveMembership);

    // console.log('🚀DEBUG askQuestion 2: User subscription status:', hasActiveMembership);

    // Get user's messages for this document
    const chatSnapshot = await chatRef.get();
    const userMessages = chatSnapshot.docs.filter((doc) => doc.data().role === 'human');

    // console.log('🚀DEBUG askQuestion 3: Number of user messages:', userMessages.length);

    // Check if the user has reached their limit
    const limit = hasActiveMembership
      ? SUBSCRIPTION_LIMITS.PRO.MESSAGE_LIMIT
      : SUBSCRIPTION_LIMITS.FREE.MESSAGE_LIMIT;

    // console.log('🚀DEBUG askQuestion 4: User limit:', limit);

    if (userMessages.length >= limit) {
      // console.log(
      //   `🚀DEBUG askQuestion 5: User has reached the ${hasActiveMembership ? 'pro' : 'free'} limit`
      // );
      return {
        success: false,
        message: ERROR_MESSAGES.MESSAGE_LIMIT_REACHED(hasActiveMembership, limit),
      };
    }

    const userMessage: Message = {
      role: 'human',
      message: question,
      createdAt: new Date(),
    };

    await chatRef.add(userMessage);

    // console.log('🚀DEBUG askQuestion 6: User message added successfully');

    // Generate AI response
    const reply = await generateLangChainCompletion(id, question);

    // console.log('🚀DEBUG askQuestion 7: AI response generated');

    const aiMessage: Message = {
      role: 'ai',
      message: reply,
      createdAt: new Date(),
    };

    await chatRef.add(aiMessage);

    // console.log('🚀DEBUG askQuestion 8: AI message added successfully');

    return {
      success: true,
      message: null,
    };
  } catch (error) {
    // console.error('🚀DEBUG askQuestion 9: Error in askQuestion:', error);
    return {
      success: false,
      message: `An error occurred: ${error}`,
    };
  }
}
