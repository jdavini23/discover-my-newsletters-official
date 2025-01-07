import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/lib/react-hot-toast';

import { Newsletter, RecommendationContext, RecommendationScore, UserPreference } from '@/types';
import { useRecommendationStore } from '@/stores/recommendationStore';
import { useAuthStore } from '@/stores/authStore';
import { useNewsletterStore } from '@/stores/newsletterStore';

import {
  UserIcon,
  MagnifyingGlassIcon as SearchIcon,
  FunnelIcon,
  UsersIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ChatBubbleOvalLeftIcon,
  DocumentTextIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
  FireIcon,
  LightBulbIcon,
  XMarkIcon,
} from '@/lib/heroicons/react/24/outline';

import { doc, getDoc } from '@/lib/firebase/firestore';
import { db } from '@/services/firebaseConfig';
import { recommendationService } from '@/services/recommendationService';
import { trackEvent } from '@/utils/analytics';

// Import images
import techNewsletterImage from '@/assets/images/tech-newsletter.jpg';
import healthNewsletterImage from '@/assets/images/health-newsletter.jpg';
import businessNewsletterImage from '@/assets/images/business-newsletter.jpg';

// Type Definitions
interface EventData {
  source?: string;
  message?: string;
  severity?: 'info' | 'warning' | 'error';
  error?: string;
}

interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface EnhancedRecommendation {
  newsletterId: string;
  newsletter: Newsletter;
  score: number;
}

interface RecommendationModalProps {
  recommendations: EnhancedRecommendation[];
  onClose: () => void;
}

// Feature Icons
const PersonalizedIcon = UserIcon;
const FilteredIcon = FunnelIcon;
const CommunityIcon = UsersIcon;
const ManageIcon = Cog6ToothIcon;
const AnalyticsIcon = ChartBarIcon;
const DiscussionIcon = ChatBubbleOvalLeftIcon;
const ContentIcon = DocumentTextIcon;

// SVG Illustrations
const WaveDivider = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 1440 320'
    className='w-full fill-current text-gray-100 -mt-1'
  >
    <path
      fillOpacity='1'
      d='M0,160L48,176C96,192,192,224,288,229.3C384,235,480,213,576,192C672,171,768,149,864,160C960,171,1056,213,1152,224C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'
    ></path>
  </svg>
);

interface FeatureIllustrationProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [recommendations, setRecommendations] = useState<EnhancedRecommendation[]>([]);

  const { user } = useAuthStore();
  const { newsletters } = useNewsletterStore();
  const { recommendations: storeRecommendations } = useRecommendationStore();

  const fetchUserData = useCallback(async () => {
    if (!user) return;

    try {
      // Fetch user-specific data or recommendations
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Process user data if needed
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load user data');
    }
  }, [user]);

  useEffect(() => {
    fetchUserData();
  }, [user, fetchUserData]);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      navigate(`/discovery?query=${encodeURIComponent(query)}`);
    },
    [navigate]
  );

  const handleEmailSubscription = useCallback(async () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    setIsSubscribing(true);
    try {
      // Implement newsletter signup logic
      toast.success('Successfully subscribed!');
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to subscribe');
    } finally {
      setIsSubscribing(false);
    }
  }, [email]);

  const RecommendationModal: React.FC<RecommendationModalProps> = ({
    recommendations,
    onClose,
  }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
    >
      <div className='bg-white rounded-lg p-8 max-w-md w-full'>
        <h2 className='text-2xl font-bold mb-4'>Personalized Recommendations</h2>
        {recommendations.map(({ newsletter, score }) => (
          <div key={newsletter.id} className='mb-4'>
            <h3>{newsletter.title}</h3>
            <p>Recommendation Score: {score.toFixed(2)}</p>
          </div>
        ))}
        <button onClick={onClose} className='mt-4 bg-primary-500 text-white px-4 py-2 rounded'>
          Close
        </button>
      </div>
    </motion.div>
  );

  const features: Feature[] = [
    {
      title: 'Discover Newsletters',
      description: 'Find the best newsletters tailored to your interests',
      icon: SparklesIcon,
    },
    {
      title: 'Personalized Recommendations',
      description: 'Get curated newsletter suggestions based on your preferences',
      icon: LightBulbIcon,
    },
    // Add more features as needed
  ];

  return (
    <div className='bg-gray-50 min-h-screen overflow-x-hidden relative'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative'>
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='py-20 text-center'
        >
          <h1 className='text-5xl font-bold mb-6'>Discover Your Perfect Newsletter</h1>
          <div className='max-w-xl mx-auto flex items-center'>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search newsletters...'
              className='w-full px-4 py-2 border rounded-l-lg'
            />
            <button
              onClick={() => handleSearch(searchQuery)}
              className='bg-primary-500 text-white px-4 py-2 rounded-r-lg'
            >
              Search
            </button>
          </div>
        </motion.section>

        {/* Features Section */}
        <section className='py-16'>
          <div className='grid md:grid-cols-2 gap-8'>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className='bg-white p-6 rounded-lg shadow-md'
              >
                <feature.icon className='h-12 w-12 text-primary-500 mb-4' />
                <h3 className='text-xl font-semibold mb-2'>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recommendations Section */}
        {user && recommendations.length > 0 && (
          <RecommendationModal
            recommendations={recommendations}
            onClose={() => setRecommendations([])}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
