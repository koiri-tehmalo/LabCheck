
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
    signInSuccessWithAuthResult: function (authResult: any) {
      const user = authResult.user;
      if (user) {
        user.getIdToken().then((idToken: string) => {
          //This is a crucial step, you’re passing the idToken to the server-side to create a session cookie.
          fetch('/api/auth', {
            method: 'POST',
            body: idToken,
          });
        });
      }
      return true;
    },
  },
};

export default uiConfig;
