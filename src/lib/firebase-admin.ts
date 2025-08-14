
import { auth, apps, initializeApp, App, cert } from 'firebase-admin';
import serviceAccount from '../../asset-tracker-w0bxu-firebase-adminsdk-fbsvc-51589e9d3d.json';

let app: App;

export function getAdminApp(): App {
  if (apps.length > 0) {
    return apps[0] as App;
  }
  
  try {
    app = initializeApp({
      credential: cert(serviceAccount as any),
    });
  } catch (err: any) {
    console.log('failed to initializeApp', err.stack);
  }
  return app;
}
