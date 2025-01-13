import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  writeBatch, 
  doc, 
  getDocs 
} from 'firebase/firestore';
import { firebaseConfig } from '../src/firebaseConfig';
import { 
  UserInteraction, 
  Newsletter 
} from '../src/types/newsletter';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Utility function to generate a random date within a range
function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

// Interaction generation configuration
const INTERACTION_CONFIG = {
  usersToGenerate: 5,
  maxInteractionsPerUser: 10,
  interactionTypes: ['view', 'subscribe', 'read'] as const
};

async function seedUserInteractions() {
  try {
    // Fetch existing users and newsletters
    const usersRef = collection(db, 'userPreferences');
    const newslettersRef = collection(db, 'newsletters');
    
    const usersSnapshot = await getDocs(usersRef);
    const newslettersSnapshot = await getDocs(newslettersRef);
    
    const userIds = usersSnapshot.docs.map(doc => doc.id);
    const newsletters = newslettersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Newsletter[];

    // Prepare batch write
    const batch = writeBatch(db);
    const userInteractionsRef = collection(db, 'userInteractions');

    // Generate interactions for each user
    userIds.forEach(userId => {
      // Randomly select newsletters to interact with
      const selectedNewsletters = newsletters
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * INTERACTION_CONFIG.maxInteractionsPerUser) + 1);

      selectedNewsletters.forEach(newsletter => {
        // Randomize interaction type and timestamp
        const interactionType = INTERACTION_CONFIG.interactionTypes[
          Math.floor(Math.random() * INTERACTION_CONFIG.interactionTypes.length)
        ];
        
        const timestamp = randomDate(
          new Date(2024, 0, 1),  // Start of 2024
          new Date(2025, 0, 1)   // Start of 2025
        );

        const interaction: UserInteraction = {
          newsletterId: newsletter.id,
          userId: userId,
          interactionType: interactionType,
          timestamp: timestamp
        };

        // Create a new document reference with auto-generated ID
        const interactionDocRef = doc(userInteractionsRef);
        batch.set(interactionDocRef, interaction);
      });
    });

    // Commit the batch
    await batch.commit();
    console.log('Successfully seeded user interactions!');
  } catch (error) {
    console.error('Error seeding user interactions:', error);
  }
}

// Uncomment to run seeding
seedUserInteractions();
