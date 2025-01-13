import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc, getDocs } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseConfig } from '../src/firebaseConfig';
// Seed Data
const newsletterSeedData = [
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
    // Add other newsletters from previous seed script
];
const userPreferencesSeedData = [
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
    // Add other user preferences from previous seed script
];
async function seedDatabase() {
    try {
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const auth = getAuth(app);
        // Seed Newsletters
        const newsletterBatch = writeBatch(db);
        const newslettersRef = collection(db, 'newsletters');
        newsletterSeedData.forEach(newsletter => {
            const docRef = doc(newslettersRef);
            newsletterBatch.set(docRef, newsletter);
        });
        await newsletterBatch.commit();
        console.log('Successfully seeded newsletters!');
        // Seed User Preferences and Interactions
        const userBatch = writeBatch(db);
        const userPreferencesRef = collection(db, 'userPreferences');
        const userInteractionsRef = collection(db, 'userInteractions');
        const newslettersSnapshot = await getDocs(newslettersRef);
        const newsletters = newslettersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        for (const userData of userPreferencesSeedData) {
            // Create user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
            const userId = userCredential.user.uid;
            // Create user preferences document
            const preferencesDocRef = doc(userPreferencesRef, userId);
            userBatch.set(preferencesDocRef, {
                userId,
                ...userData.preferences
            });
            // Generate user interactions
            const selectedNewsletters = newsletters
                .sort(() => 0.5 - Math.random())
                .slice(0, Math.floor(Math.random() * 10) + 1);
            selectedNewsletters.forEach(newsletter => {
                const interactionDocRef = doc(userInteractionsRef);
                const interaction = {
                    newsletterId: newsletter.id,
                    userId: userId,
                    interactionType: ['view', 'subscribe', 'unsubscribe', 'read'][Math.floor(Math.random() * 4)],
                    timestamp: new Date(2024 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28))
                };
                userBatch.set(interactionDocRef, interaction);
            });
        }
        await userBatch.commit();
        console.log('Successfully seeded user preferences and interactions!');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}
seedDatabase();
