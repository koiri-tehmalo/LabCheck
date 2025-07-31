
'use client';
import { useEffect, useRef, useState } from 'react';
import { Auth, onAuthStateChanged } from 'firebase/auth';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

interface Props {
  // The Firebase UI Web UI Config object.
  // See: https://github.com/firebase/firebaseui-web#configuration
  uiConfig: firebaseui.auth.Config;
  // The Firebase App auth instance to use.
  firebaseAuth: Auth;
  className?: string;
}

const StyledFirebaseAuth = ({ uiConfig, firebaseAuth, className }: Props) => {
  const [userSignedIn, setUserSignedIn] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    // Get or Create a firebaseUI instance.
    const firebaseUiWidget = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebaseAuth);
    if (uiConfig.signInFlow === 'popup') {
      firebaseUiWidget.reset();
    }

    // We track the auth state to reset firebaseUi if the user signs out.
    const unregisterAuthObserver = onAuthStateChanged(firebaseAuth, (user) => {
      if (!user && userSignedIn) {
        firebaseUiWidget.reset();
      }
      setUserSignedIn(!!user);
    });

    // Trigger the sign-in widget.
    if (elementRef.current) {
        firebaseUiWidget.start(elementRef.current, uiConfig);
    }
    

    return () => {
      unregisterAuthObserver();
      firebaseUiWidget.reset();
    };
  }, [firebaseUiWidget, uiConfig]);

  return <div className={className} ref={elementRef} />;
};

export default StyledFirebaseAuth;
