import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  writeBatch, 
  doc 
} from 'firebase/firestore';
import { firebaseConfig } from '../src/firebaseConfig';
import { 
  Newsletter, 
  NewsletterCategory 
} from '../src/types/newsletter';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const newsletterSeedData: Omit<Newsletter, 'id'>[] = [
  {
    title: 'The Hustle',
    description: 'Daily tech and business newsletter',
    author: 'Sam Parr',
    websiteUrl: 'https://thehustle.co',
    subscribeUrl: 'https://thehustle.co/subscribe',
    categories: ['Technology', 'Startup', 'Entrepreneurship'],
    tags: ['tech', 'business', 'startup'],
    averageReadTime: 5,
    subscriberCount: 1500000,
    coverImageUrl: 'https://example.com/hustle-cover.jpg'
  },
  {
    title: 'Dense Discovery',
    description: 'Curated links exploring design, technology, and culture',
    author: 'Kai Brach',
    websiteUrl: 'https://densediscovery.com',
    subscribeUrl: 'https://densediscovery.com/subscribe',
    categories: ['Design', 'Technology', 'Personal Development'],
    tags: ['design', 'creativity', 'technology'],
    averageReadTime: 7,
    subscriberCount: 50000,
    coverImageUrl: 'https://example.com/dense-discovery-cover.jpg'
  },
  {
    title: 'Stratechery',
    description: 'Technology strategy analysis and insights',
    author: 'Ben Thompson',
    websiteUrl: 'https://stratechery.com',
    subscribeUrl: 'https://stratechery.com/subscribe',
    categories: ['Technology', 'Finance', 'Entrepreneurship'],
    tags: ['tech', 'strategy', 'analysis'],
    averageReadTime: 10,
    subscriberCount: 75000,
    coverImageUrl: 'https://example.com/stratechery-cover.jpg'
  },
  {
    title: 'Morning Brew',
    description: 'Business news and insights delivered daily',
    author: 'Alex Lieberman',
    websiteUrl: 'https://morningbrew.com',
    subscribeUrl: 'https://morningbrew.com/subscribe',
    categories: ['Finance', 'Marketing', 'Entrepreneurship'],
    tags: ['business', 'finance', 'news'],
    averageReadTime: 5,
    subscriberCount: 2500000,
    coverImageUrl: 'https://example.com/morning-brew-cover.jpg'
  },
  {
    title: 'Austin Kleon\'s Newsletter',
    description: 'Weekly newsletter about creativity and art',
    author: 'Austin Kleon',
    websiteUrl: 'https://austinkleon.com',
    subscribeUrl: 'https://austinkleon.com/subscribe',
    categories: ['Art', 'Writing', 'Personal Development'],
    tags: ['creativity', 'art', 'writing'],
    averageReadTime: 6,
    subscriberCount: 25000,
    coverImageUrl: 'https://example.com/austin-kleon-cover.jpg'
  },
  {
    title: 'Exponential View',
    description: 'Deep dive into technology, society, and the future',
    author: 'Azeem Azhar',
    websiteUrl: 'https://exponentialview.com',
    subscribeUrl: 'https://exponentialview.com/subscribe',
    categories: ['Technology', 'Science', 'Personal Development'],
    tags: ['future', 'tech', 'society'],
    averageReadTime: 12,
    subscriberCount: 100000,
    coverImageUrl: 'https://example.com/exponential-view-cover.jpg'
  },
  {
    title: 'Not Boring',
    description: 'Business and strategy newsletter with a fun twist',
    author: 'Packy McCormick',
    websiteUrl: 'https://notboring.co',
    subscribeUrl: 'https://notboring.co/subscribe',
    categories: ['Finance', 'Startup', 'Technology'],
    tags: ['startup', 'business', 'analysis'],
    averageReadTime: 8,
    subscriberCount: 150000,
    coverImageUrl: 'https://example.com/not-boring-cover.jpg'
  },
  {
    title: 'The Profile',
    description: 'Fascinating stories about people and companies',
    author: 'Polina Marinova Pompliano',
    websiteUrl: 'https://theprofile.substack.com',
    subscribeUrl: 'https://theprofile.substack.com/subscribe',
    categories: ['Personal Development', 'Finance', 'Entrepreneurship'],
    tags: ['profiles', 'stories', 'inspiration'],
    averageReadTime: 7,
    subscriberCount: 80000,
    coverImageUrl: 'https://example.com/the-profile-cover.jpg'
  },
  {
    title: 'Cybernetic Forests',
    description: 'Exploring technology, environment, and ecology',
    author: 'Winnie Lim',
    websiteUrl: 'https://cybernetic.substack.com',
    subscribeUrl: 'https://cybernetic.substack.com/subscribe',
    categories: ['Environment', 'Technology', 'Science'],
    tags: ['ecology', 'tech', 'sustainability'],
    averageReadTime: 9,
    subscriberCount: 15000,
    coverImageUrl: 'https://example.com/cybernetic-forests-cover.jpg'
  },
  {
    title: 'Maker Mind',
    description: 'Newsletter about creativity, technology, and personal growth',
    author: 'Anne-Laure Le Cunff',
    websiteUrl: 'https://nesslabs.com',
    subscribeUrl: 'https://nesslabs.com/newsletter',
    categories: ['Personal Development', 'Technology', 'Writing'],
    tags: ['creativity', 'learning', 'technology'],
    averageReadTime: 6,
    subscriberCount: 40000,
    coverImageUrl: 'https://example.com/maker-mind-cover.jpg'
  }
];

async function seedNewsletters() {
  try {
    const batch = writeBatch(db);
    const newslettersRef = collection(db, 'newsletters');

    newsletterSeedData.forEach(newsletter => {
      const docRef = doc(newslettersRef);
      batch.set(docRef, newsletter);
    });

    await batch.commit();
    console.log('Successfully seeded newsletters!');
  } catch (error) {
    console.error('Error seeding newsletters:', error);
  }
}

// Uncomment and run to seed
seedNewsletters();
