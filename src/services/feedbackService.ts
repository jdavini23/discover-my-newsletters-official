import { 
  addDoc, 
  collection, 
  getFirestore, 
  serverTimestamp 
} from 'firebase/firestore';
import { Feedback, FeedbackType } from '../types/Feedback';
import { db } from '../firebaseConfig';
import { logEvent } from 'firebase/analytics';
import { getAnalytics } from 'firebase/analytics';

export const feedbackService = {
  async submitFeedback(
    userId: string, 
    feedbackData: {
      type: FeedbackType;
      message: string;
      email?: string;
      category?: string;
    }
  ): Promise<string> {
    try {
      const feedback: Feedback = {
        ...feedbackData,
        userId,
        timestamp: new Date(),
        resolved: false
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'feedback'), feedback);

      // Log analytics event
      const analytics = getAnalytics();
      logEvent(analytics, 'submit_feedback', {
        feedback_type: feedbackData.type,
        user_id: userId
      });

      return docRef.id;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  }
};
