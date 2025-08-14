
import { EmailAuthProvider } from 'firebase/auth';

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    {
      provider: EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: false,
    },
  ],
  callbacks: {
    // This function is called when a user successfully signs in.
    signInSuccessWithAuthResult: function (authResult: any) {
      if (authResult.user) {
        // Get the user's ID token.
        authResult.user.getIdToken().then((idToken: string) => {
          // POST the token to the backend.
          return fetch('/api/auth', {
            method: 'POST',
            body: idToken,
          });
        });
      }
      // Return true to redirect to the sign-in success URL.
      return true;
    },
  },
};

export default uiConfig;
