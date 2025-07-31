
import { auth, apps, initializeApp, App, cert } from 'firebase-admin';

let app: App;

export function getAdminApp(): App {
  if (apps.length > 0) {
    return apps[0] as App;
  }
  
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);
    app = initializeApp({
      credential: cert(serviceAccount),
    });
  } catch (err: any) {
    console.log('failed to initializeApp', err.stack);
  }
  return app;
}
