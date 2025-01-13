import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  writeBatch, 
  doc 
} from 'firebase/firestore';
import { 
  getAuth, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { firebaseConfig } from '../src/firebaseConfig';
import { 
  UserPreferences, 
  NewsletterCategory, 
  ReadingFrequency 
} from '../src/types/newsletter';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Predefined user personas with preferences
const userPreferencesSeedData: Array<{
  email: string;
  password: string;
  preferences: Omit<UserPreferences, 'id' | 'userId'>;
}> = [
  {
    email: 'tech_enthusiast@example.com',
    password: 'TechLover2024!',
    preferences: {
      preferredCategories: [
        'Technology', 
        'Startup', 
        'Programming', 
        'Science'
      ],
      readingFrequency: 'Daily',
      excludedNewsletters: []
    }
  },
  {
    email: 'creative_professional@example.com',
    password: 'CreativeMind2024!',
    preferences: {
      preferredCategories: [
        'Design', 
        'Art', 
        'Writing', 
        'Personal Development'
      ],
      readingFrequency: 'Weekly',
      excludedNewsletters: []
    }
  },
  {
    email: 'business_leader@example.com',
    password: 'BusinessPro2024!',
    preferences: {
      preferredCategories: [
        'Entrepreneurship', 
        'Finance', 
        'Marketing'
      ],
      readingFrequency: 'Daily',
      excludedNewsletters: []
    }
  },
  {
    email: 'sustainability_advocate@example.com',
    password: 'EcoWarrior2024!',
    preferences: {
      preferredCategories: [
        'Environment', 
        'Science', 
        'Technology', 
        'Personal Development'
      ],
      readingFrequency: 'Weekly',
      excludedNewsletters: []
    }
  },
  {
    email: 'lifelong_learner@example.com',
    password: 'CuriousMind2024!',
    preferences: {
      preferredCategories: [
        'Personal Development', 
        'Science', 
        'Technology', 
        'Writing'
      ],
      readingFrequency: 'Bi-Weekly',
      excludedNewsletters: []
    }
  }
];

async function seedUserPreferences() {
  try {
    const batch = writeBatch(db);
    const userPreferencesRef = collection(db, 'userPreferences');

    for (const userData of userPreferencesSeedData) {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      const userId = userCredential.user.uid;

      // Create user preferences document
      const preferencesDocRef = doc(userPreferencesRef, userId);
      batch.set(preferencesDocRef, {
        userId,
        ...userData.preferences
      });
    }

    // Commit the batch
    await batch.commit();
    console.log('Successfully seeded user preferences!');
  } catch (error) {
    console.error('Error seeding user preferences:', error);
  }
}

// Uncomment to run seeding
seedUserPreferences();
