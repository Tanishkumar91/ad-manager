import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { exchangeCodeForToken } from './api';
import { useAuth } from './AuthContext';
import { useToast } from './hooks/useToast';

function Callback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { saveAccessToken, clearAccessToken } = useAuth();
  const addToast = useToast();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    const handleOAuthCallback = async () => {
      console.log('Callback component: handleOAuthCallback called.');
      if (code) {
        console.log('Callback component: Authorization code received:', code);
        try {
          const response = await exchangeCodeForToken(code);
          console.log('Callback component: Token exchange successful.', response);
          saveAccessToken(response.access_token);
          addToast('OAuth successful! Redirecting to ad form.', 'success');
          navigate('/ad-form');
        } catch (error) {
          console.error('Callback component: Error exchanging code for token:', error);
          clearAccessToken();
          let errorMessage = 'OAuth failed. Please try again.';
          if (error.message) {
            errorMessage = error.message;
          } else if (error.code) {
            switch (error.code) {
              case 10001: errorMessage = 'Invalid client ID or secret. Please check your TikTok App configuration.'; break;
              case 10002: errorMessage = 'Missing required Ads permission scope. Please grant necessary permissions.'; break;
              case 10003: errorMessage = 'Your TikTok session has expired or been revoked. Please reconnect.'; break;
              case 10004: errorMessage = 'TikTok Ads API is geo-restricted in your region. Access denied.'; break;
              default: errorMessage = 'An unexpected error occurred during OAuth. Please try again.'; break;
            }
          }
          addToast(errorMessage, 'error');
          navigate('/');
        }
      } else {
        console.error('Callback component: OAuth failed: No code received.');
        addToast('OAuth failed. No authorization code received. Please try again.', 'error');
        navigate('/');
      }
    };

    handleOAuthCallback();
  }, [location, navigate, saveAccessToken, clearAccessToken, addToast]);

  return (
    <div>
      <h1>Processing TikTok OAuth...</h1>
      <p>Please wait while we connect your account.</p>
    </div>
  );
}

export default Callback;
