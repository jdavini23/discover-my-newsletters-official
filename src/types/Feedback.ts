export type FeedbackType = 
  | 'bug'
  | 'suggestion'
  | 'improvement'
  | 'other';

export interface Feedback {
  id?: string;
  userId: string;
  type: FeedbackType;
  message: string;
  email?: string;
  timestamp: Date;
  resolved?: boolean;
  category?: string;
}
