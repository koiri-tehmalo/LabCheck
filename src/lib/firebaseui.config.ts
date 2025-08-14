
import { EmailAuthProvider } from 'firebase/auth';

const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  signInOptions: [
    {
      provider: EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: true, // This can be true for sign up, but for sign in flow it's better to keep it simple. Let's make it false.
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
              // The session cookie is set. Let FirebaseUI handle the redirect.
              return true;
            }
            // Handle error case if session creation fails
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
