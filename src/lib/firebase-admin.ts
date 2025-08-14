
import { auth, apps, initializeApp, App, cert } from 'firebase-admin';
import serviceAccount from '../../asset-tracker-w0bxu-firebase-adminsdk-fbsvc-51589e9d3d.json';

const projectId = 'asset-tracker-w0bxu';

// Helper function to initialize the app if it's not already initialized.
function initializeAdminApp(): App {
  const appName = `firebase-admin-app-${projectId}`;
  const existingApp = apps.find(app => app?.name === appName);
  
  if (existingApp) {
    return existingApp;
  }
  
  try {
    return initializeApp({
      credential: cert(serviceAccount as any),
      projectId: projectId,
    }, appName);
  } catch (err: any) {
    console.error('Failed to initialize Firebase Admin App:', err.stack);
    // Re-throw the error to ensure the calling function knows about the failure.
    throw err;
  }
}

// Export a single instance of the initialized app.
export function getAdminApp(): App {
  return initializeAdminApp();
}
