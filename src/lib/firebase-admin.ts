
import admin from 'firebase-admin';
import serviceAccount from '../../asset-tracker-w0bxu-firebase-adminsdk-fbsvc-51589e9d3d.json';

const projectId = 'asset-tracker-w0bxu';

export function getAdminApp(): admin.app.App {
  if (admin.apps.length > 0) {
    const existingApp = admin.apps.find(app => app?.name === projectId);
    if(existingApp) {
        return existingApp;
    }
  }

  try {
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as any),
      projectId: projectId,
    }, projectId);
  } catch (err: any) {
    console.error('Failed to initialize Firebase Admin App:', err.stack);
    throw err;
  }
}
