
import { EmailAuthProvider } from 'firebase/auth';

const uiConfig = {
  signInFlow: 'popup',
  // Redirect to / after sign in is successful.
  signInSuccessUrl: '/',
  signInOptions: [
    {
      provider: EmailAuthProvider.PROVIDER_ID,
      signInMethod: EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,
      // We don't need user creation via the login form, so we disable it.
      disableSignUp: {
        status: true
      }
    },
  ],
  callbacks: {
    // This callback function is triggered when a user successfully signs in.
    signInSuccessWithAuthResult: function (authResult: any) {
      if (authResult.user) {
        // Get the user's ID token.
        authResult.user.getIdToken().then((idToken: string) => {
          // Send the token to our backend to create a session cookie.
          return fetch('/api/auth', {
            method: 'POST',
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

    
