import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Ensure Firebase Admin is initialized
if (admin.apps.length === 0) {
  admin.initializeApp();
}

// Cloud function to set admin claims
export const setAdminClaims = functions.https.onCall(async (data, context) => {
  // Ensure the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  // Verify admin secret (you should store this securely in Firebase config)
  const adminSecret = functions.config().admin?.secret;
  if (data.adminSecret !== adminSecret) {
    throw new functions.https.HttpsError('permission-denied', 'Invalid admin secret');
  }

  try {
    await admin.auth().setCustomUserClaims(context.auth.uid, {
      admin: true,
    });

    return { success: true };
  } catch (error) {
    console.error('Error setting admin claims', error);
    throw new functions.https.HttpsError('internal', 'Failed to set admin claims');
  }
});

// Cloud function to create initial admin user
export const createInitialAdminUser = functions.https.onCall(async (data, _context) => {
  const { email, password, adminSecret } = data;

  // Validate input
  if (!email || !password || !adminSecret) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
  }

  // Verify admin secret
  const storedAdminSecret = functions.config().admin?.secret;
  if (adminSecret !== storedAdminSecret) {
    throw new functions.https.HttpsError('permission-denied', 'Invalid admin secret');
  }

  try {
    // Create user
    const userRecord = await admin.auth().createUser({
      email,
      password,
      emailVerified: false,
    });

    // Set admin custom claims
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      admin: true,
    });

    // Optional: Store additional user info in Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      email,
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      message: 'Initial admin user created successfully',
      userId: userRecord.uid,
    };
  } catch (error) {
    console.error('Error creating initial admin user', error);
    throw new functions.https.HttpsError('internal', 'Failed to create admin user');
  }
});
