
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
      if (authResult.user) {
        authResult.user.getIdToken().then((idToken: string) => {
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
