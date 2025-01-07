import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  where,
  query,
  getDocs,
  addDoc,
  deleteDoc,
  Timestamp,
  orderBy,
  limit,
  increment,
  Query,
  startAfter,
} from 'firebase/firestore';
import { auth } from '@/config/firebase';
import { User, Newsletter, NewsletterFilter } from '@/types/firestore';
import { UserProfile, UpdateProfileParams, UserActivity } from '@/types/profile';

const db = getFirestore();

// Fetch user profile
export const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error('User profile not found');
  }

  return {
    uid: userSnap.id,
    ...userSnap.data(),
  } as UserProfile;
};

// Update user newsletter preferences
export const updateNewsletterPreferences = async (
  userId: string,
  preferences: UserProfile['newsletterPreferences']
): Promise<UserProfile> => {
  const userRef = doc(db, 'users', userId);

  await updateDoc(userRef, { newsletterPreferences: preferences });

  return fetchUserProfile(userId);
};

// Fetch available newsletter topics
export const fetchAvailableTopics = async () => {
  const topicsRef = collection(db, 'topics');
  const topicsSnapshot = await getDocs(topicsRef);

  return topicsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Newsletter-related Firestore operations
export const addNewsletter = async (newsletter: Omit<Newsletter, 'id'>) => {
  if (!auth.currentUser) throw new Error('No authenticated user');

  const newsletterRef = collection(db, 'newsletters');
  const docRef = await addDoc(newsletterRef, {
    ...newsletter,
    userId: auth.currentUser.uid,
    createdAt: Timestamp.now(),
  });

  return docRef.id;
};

export const getUserNewsletters = async () => {
  if (!auth.currentUser) throw new Error('No authenticated user');

  const newsletterRef = collection(db, 'newsletters');
  const q = query(newsletterRef, where('userId', '==', auth.currentUser.uid));

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Newsletter
  );
};

// Newsletter Discovery Methods
export const fetchNewsletters = async (filters: NewsletterFilter = {}, page = 1, pageSize = 10) => {
  const { topics, sortBy = 'popularity', searchQuery } = filters;

  // Base query
  let newsletterQuery: Query = collection(db, 'newsletters');

  // Apply topic filters
  if (topics && topics.length > 0) {
    newsletterQuery = query(newsletterQuery, where('topics', 'array-contains-any', topics));
  }

  // Apply search query
  if (searchQuery) {
    // Note: Firestore doesn't support full-text search natively
    // This is a basic implementation and might need more sophisticated indexing
    newsletterQuery = query(
      newsletterQuery,
      where('title', '>=', searchQuery),
      where('title', '<=', searchQuery + '\uf8ff')
    );
  }

  // Apply sorting
  switch (sortBy) {
    case 'popularity':
      newsletterQuery = query(newsletterQuery, orderBy('popularity', 'desc'));
      break;
    case 'recent':
      newsletterQuery = query(newsletterQuery, orderBy('createdAt', 'desc'));
      break;
    case 'rating':
      newsletterQuery = query(newsletterQuery, orderBy('averageRating', 'desc'));
      break;
  }

  // Apply pagination
  const lastVisible = await getLastVisible(newsletterQuery, page, pageSize);
  if (lastVisible) {
    newsletterQuery = query(newsletterQuery, startAfter(lastVisible));
  }
  newsletterQuery = query(newsletterQuery, limit(pageSize));

  const newsletterSnapshot = await getDocs(newsletterQuery);

  return newsletterSnapshot.docs.map((doc) => {
    const data = doc.data();
    console.log('Raw newsletter data:', data);

    // Validate newsletter data
    const newsletter: Newsletter = {
      id: doc.id,
      title: data.title || '',
      description: data.description || '',
      url: data.url || '',
      topics: data.topics || [],
      author: data.author || '',
      coverImageUrl: data.coverImageUrl,
      subscriberCount: data.subscriberCount || 0,
      createdAt: data.createdAt,
      popularity: data.popularity || 0,
      averageRating: data.averageRating,
      recommendationMetadata: data.recommendationMetadata || {
        topicWeights: {},
        similarNewsletters: [],
        contentQualityScore: 0,
      },
    };

    return newsletter;
  });
};

async function getLastVisible(query: Query, page: number, pageSize: number) {
  if (page <= 1) return null;

  const lastPageQuery = query(limit(pageSize * (page - 1)));
  const lastPageSnapshot = await getDocs(lastPageQuery);
  if (lastPageSnapshot.empty) return null;

  return lastPageSnapshot.docs[lastPageSnapshot.docs.length - 1];
}

// Subscribe to a newsletter
export const subscribeToNewsletter = async (newsletterId: string) => {
  if (!auth.currentUser) throw new Error('No authenticated user');

  const subscriptionRef = collection(db, 'subscriptions');

  // Create subscription
  const subscriptionDoc = await addDoc(subscriptionRef, {
    userId: auth.currentUser.uid,
    newsletterId,
    subscribedAt: Timestamp.now(),
  });

  // Increment newsletter subscriber count
  const newsletterRef = doc(db, 'newsletters', newsletterId);
  await updateDoc(newsletterRef, {
    subscriberCount: increment(1),
  });

  return subscriptionDoc.id;
};

// Unsubscribe from a newsletter
export const unsubscribeFromNewsletter = async (newsletterId: string) => {
  if (!auth.currentUser) throw new Error('No authenticated user');

  // Find and delete the subscription
  const subscriptionsQuery = query(
    collection(db, 'subscriptions'),
    where('userId', '==', auth.currentUser.uid),
    where('newsletterId', '==', newsletterId)
  );

  const subscriptionSnapshot = await getDocs(subscriptionsQuery);

  if (!subscriptionSnapshot.empty) {
    const subscriptionDoc = subscriptionSnapshot.docs[0];
    await deleteDoc(doc(db, 'subscriptions', subscriptionDoc.id));

    // Decrement newsletter subscriber count
    const newsletterRef = doc(db, 'newsletters', newsletterId);
    await updateDoc(newsletterRef, {
      subscriberCount: increment(-1),
    });
  }
};

// Get user's subscribed newsletters
export const fetchUserSubscriptions = async () => {
  if (!auth.currentUser) throw new Error('No authenticated user');

  const subscriptionsQuery = query(
    collection(db, 'subscriptions'),
    where('userId', '==', auth.currentUser.uid)
  );

  const subscriptionSnapshot = await getDocs(subscriptionsQuery);

  // Get full newsletter details for each subscription
  const subscriptions = await Promise.all(
    subscriptionSnapshot.docs.map(async (subDoc) => {
      const newsletterId = subDoc.data().newsletterId;
      const newsletterDoc = await getDoc(doc(db, 'newsletters', newsletterId));

      return {
        id: newsletterId,
        ...newsletterDoc.data(),
        subscriptionId: subDoc.id,
      } as Newsletter & { subscriptionId: string };
    })
  );

  return subscriptions;
};

// Comprehensive user profile management functions
export const updateUserProfile = async (
  userId: string,
  updates: UpdateProfileParams
): Promise<UserProfile> => {
  const userRef = doc(db, 'users', userId);

  // Validate and sanitize updates
  const sanitizedUpdates: Partial<UserProfile> = {
    ...(updates.displayName && { displayName: updates.displayName }),
    ...(updates.bio && { bio: updates.bio }),
    ...(updates.photoURL && { photoURL: updates.photoURL }),
    ...(updates.interests && { interests: updates.interests }),
    ...(updates.newsletterPreferences && { newsletterPreferences: updates.newsletterPreferences }),
  };

  await updateDoc(userRef, sanitizedUpdates);

  return fetchUserProfile(userId);
};

export const createUserProfile = async (
  userId: string,
  initialData: Partial<UserProfile> | Partial<User>
): Promise<UserProfile> => {
  const userRef = doc(db, 'users', userId);

  // Handle both User and UserProfile types
  const defaultProfile: UserProfile = {
    uid: userId,
    email: initialData.email || '',
    displayName: initialData.displayName || '',
    photoURL: 'photoURL' in initialData ? initialData.photoURL : undefined,
    bio: '',
    interests: [],
    newsletterPreferences: {
      frequency: 'weekly',
      categories: [],
    },
    activityLog: [],
    accountCreatedAt: Timestamp.now(),
    lastLoginAt: Timestamp.now(),
  };

  await setDoc(userRef, defaultProfile, { merge: true });
  return defaultProfile;
};

export const addUserActivityLog = async (
  userId: string,
  activity: UserActivity
): Promise<UserProfile> => {
  const userRef = doc(db, 'users', userId);
  const userProfile = await fetchUserProfile(userId);

  const updatedActivityLog = [...(userProfile.activityLog || []), activity];

  await updateDoc(userRef, { activityLog: updatedActivityLog });

  return fetchUserProfile(userId);
};
