
import { EmailAuthProvider } from 'firebase/auth';

const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  signInOptions: [
    {
      provider: EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: false,
    },
  ],
  callbacks: {
    signInSuccessWithAuthResult: function (authResult: any) {
      if (authResult.user) {
        authResult.user.getIdToken().then((idToken: string) => {
          fetch('/api/auth', {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain',
            },
            body: idToken,
          });
        });
      }
      // Return true to redirect to signInSuccessUrl
      return true;
    },
  },
};

export default uiConfig;
