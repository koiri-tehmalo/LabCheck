
import { auth, apps, initializeApp, App, cert } from 'firebase-admin';

export function getAdminApp(): App {
  if (apps.length > 0) {
    return apps[0] as App;
  }
  
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);

  return initializeApp({
    credential: cert(serviceAccount),
  });
}
