import * as React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { feedbackService } from '../services/feedbackService';
import { FeedbackType } from '../types/Feedback';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const [feedbackType, setFeedbackType] = React.useState<FeedbackType>('suggestion');
  const [message, setMessage] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  const feedbackTypes: FeedbackType[] = [
    'suggestion', 'bug', 'improvement', 'other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;

    try {
      setSubmitting(true);
      await feedbackService.submitFeedback(currentUser.uid, {
        type: feedbackType,
        message,
        email: email || currentUser.email || undefined
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        onClose();
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Feedback submission error:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Share Your Feedback
        </h2>

        {submitSuccess ? (
          <div className="text-center text-green-600">
            Thank you for your feedback!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">
                Feedback Type
              </label>
              <div className="flex flex-wrap gap-2">
                {feedbackTypes.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFeedbackType(type)}
                    className={`
                      px-3 py-1 rounded-full text-sm 
                      ${feedbackType === type 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-200 text-gray-800'}
                    `}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block mb-2 font-medium">
                Your Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={4}
                placeholder="Tell us about your experience..."
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 font-medium">
                Contact Email (Optional)
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your email (optional)"
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
