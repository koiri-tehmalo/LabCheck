
import { EmailAuthProvider } from 'firebase/auth';

const uiConfig = {
  // We will display email as the single provider.
  signInOptions: [
    {
      provider: EmailAuthProvider.PROVIDER_ID,
      // We will require password based sign in.
      signInMethod: EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,
    }
  ],
  // We will use a popup flow for sign in.
  signInFlow: 'popup',
  // After a successful sign in, we will redirect to the home page.
  signInSuccessUrl: '/',
  callbacks: {
    // This callback is called after a successful sign in.
    // We use it to create a session cookie on our server.
    signInSuccessWithAuthResult: function (authResult: any) {
      if (authResult.user) {
        // Get the user's ID token.
        authResult.user.getIdToken().then((idToken: string) => {
          // Send the token to our backend to create a session cookie.
          // This will allow us to authenticate the user on subsequent requests.
          return fetch('/api/auth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: idToken,
          });
        });
      }
      // Return true to redirect to signInSuccessUrl.
      return true;
    },
  },
};

export default uiConfig;
