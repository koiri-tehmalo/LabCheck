
import { EmailAuthProvider } from 'firebase/auth';

const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  signInOptions: [
    {
      provider: EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: false, // Don't ask for name on sign up
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
      return true;
    },
  },
};

export default uiConfig;
