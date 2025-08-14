
import { EmailAuthProvider } from 'firebase/auth';

const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  signInOptions: [
    {
      provider: EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: false
    },
  ],
  callbacks: {
    signInSuccessWithAuthResult: function (authResult: any, redirectUrl: string) {
      const user = authResult.user;
      if (user) {
        return user.getIdToken().then((idToken: string) => {
          return fetch('/api/auth', {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain',
            },
            body: idToken,
          }).then((response) => {
            if (response.ok) {
              window.location.assign('/');
              return false; // Prevent FirebaseUI from redirecting.
            }
            console.error('Failed to create session cookie.');
            return false;
          });
        });
      }
      return false;
    },
  },
};

export default uiConfig;
