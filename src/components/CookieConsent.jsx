import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import "./../styles/styles.css";

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = Cookies.get('cookieConsent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    Cookies.set('cookieConsent', 'accepted', { expires: 365 });
    setShowConsent(false);
  };

  const handleDecline = () => {
    Cookies.set('cookieConsent', 'declined', { expires: 365 });
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="cookie-consent">
      <p>This website uses cookies to enhance your experience.</p>
      <div className="cookie-buttons">
        <button onClick={handleAccept}>Accept</button>
        <button onClick={handleDecline}>Decline</button>
      </div>
    </div>
  );
};

export default CookieConsent;
