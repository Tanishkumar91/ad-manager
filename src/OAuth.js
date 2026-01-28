import React, { useState } from 'react';
import { TIKTOK_OAUTH_CONFIG, MOCK_TIKTOK_OAUTH_URL } from './api';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from './hooks/useToast';

function OAuth() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const [isGeoRestricted, setIsGeoRestricted] = useState(false);
  const addToast = useToast();

  const toggleGeoRestriction = () => {
    setIsGeoRestricted(prev => !prev);
  };

  if (accessToken) {
    navigate('/ad-form');
    return null;
  }

  const connectTikTok = () => {
    if (isGeoRestricted) {
      addToast('Cannot connect: TikTok Ads API is geo-restricted in your region.', 'error');
      return;
    }
    window.location.href = MOCK_TIKTOK_OAUTH_URL;
  };

  return (
    <>
      <div className="oauth-header-greeting">
        <p className="greeting-message"><span className="waving-hand">👋</span> Hello there!</p>
        <p className="greeting-subtitle">Connect your TikTok Ads account to get started.</p>
      </div>
      <h1>Connect TikTok Ads Account</h1>
      <div className="pointing-arrow-container">
        <div className="pointing-arrow">👇</div>
        <p className="click-prompt">Click here</p>
      </div>
      {isGeoRestricted && (
        <div className="geo-restriction-message">
          <p><strong>Heads Up!</strong> It appears you might be in a region where TikTok Ads API access is restricted (e.g., India). 
          This might prevent you from connecting your account or creating ads. 
          This is a simulated message for demonstration purposes.</p>
        </div>
      )}
      <div>
        <button onClick={connectTikTok} disabled={isGeoRestricted}>
          Connect TikTok Ads Account
        </button>
      </div>
      <div>
        <button onClick={toggleGeoRestriction} className="geo-toggle-button">
          Toggle Geo-Restriction (Demo)
        </button>
      </div>
    </>
  );
}

export default OAuth;
