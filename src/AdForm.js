import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { validateMusicId, uploadCustomMusic, submitAd } from './api';
import { useToast } from './hooks/useToast';




function AdForm() {
  const { accessToken, clearAccessToken } = useAuth();
  const navigate = useNavigate();
  const addToast = useToast();

  const [campaignName, setCampaignName] = useState('');
  const [objective, setObjective] = useState('Traffic');
  const [adText, setAdText] = useState('');
  const [cta, setCta] = useState('Learn More');
  const [musicOption, setMusicOption] = useState('None'); // Existing, Upload, None
  const [musicId, setMusicId] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      navigate('/'); // Redirect to OAuth if no access token
    }
  }, [accessToken, navigate]);

  const validateForm = () => {
    const errors = {};
    if (!campaignName || campaignName.length < 3) {
      errors.campaignName = 'Campaign Name is required and must be at least 3 characters.';
    }
    if (!adText || adText.length > 100) {
      errors.adText = 'Ad Text is required and must be max 100 characters.';
    }
    if (!cta) {
      errors.cta = 'CTA is required.';
    }

    if (musicOption === 'Existing' && !musicId) {
      errors.musicId = 'Music ID is required for existing music.';
    }
    if (musicOption === 'None' && objective === 'Conversions') {
      errors.musicOption = 'No Music is not allowed for Conversions objective.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleMusicIdValidation = async () => {
    if (musicOption === 'Existing' && musicId) {
      setIsLoading(true);
      try {
        const response = await validateMusicId(musicId, accessToken);
        if (!response.valid) {
          setFormErrors(prev => ({ ...prev, musicId: 'Invalid Music ID. Please check and try again.' }));
          return false;
        }
      } catch (error) {
        console.error('Music ID validation error:', error);
        setFormErrors(prev => ({ ...prev, musicId: error.message || 'Failed to validate Music ID.' }));
        handleApiError(error);
        return false;
      } finally {
        setIsLoading(false); // Ensure loading state is cleared
      }
    }
    return true;
  };

  const handleUploadCustomMusic = async () => {
    if (musicOption === 'Upload') {
      setIsLoading(true);
      try {
        const response = await uploadCustomMusic(accessToken);
        setMusicId(response.musicId);
        addToast(`Custom music uploaded successfully with ID: ${response.musicId}`, 'success');
      } catch (error) {
        console.error('Custom music upload error:', error);
        // Provide a more specific error message for upload failures
        if (error.code === 20001) { // MOCK_API_ERRORS.INVALID_MUSIC_ID
          setFormErrors(prev => ({ ...prev, musicOption: 'Custom music upload failed during validation. Please try again.' }));
        } else {
          setFormErrors(prev => ({ ...prev, musicOption: error.message || 'Failed to upload custom music.' }));
        }
        handleApiError(error);
        return false;
      } finally {
        setIsLoading(false); // Ensure loading state is cleared
      }
    }
    return true;
  };

  const handleApiError = (error) => {
    let errorMessage = 'An unexpected error occurred.';
    if (error.message) {
      errorMessage = error.message;
    } else if (error.code) {
      switch (error.code) {
        case 10001: errorMessage = 'Invalid client ID or secret. Please check your TikTok App configuration.'; break;
        case 10002: errorMessage = 'Missing required Ads permission scope. Please grant necessary permissions.'; break;
        case 10003: errorMessage = 'Your TikTok session has expired or been revoked. Please reconnect.'; clearAccessToken(); navigate('/'); break;
        case 10004: errorMessage = 'TikTok Ads API is geo-restricted in your region. Access denied.'; break;
        case 20001: errorMessage = 'Invalid Music ID provided.'; break;
        default: errorMessage = 'An unexpected API error occurred.'; break;
      }
    }
    setGlobalError(errorMessage);
    addToast(errorMessage, 'error'); // Also show as a toast
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');
    setFormErrors({});

    if (!validateForm()) {
      setGlobalError('Please fix the errors in the form.');
      addToast('Please fix the errors in the form.', 'error');
      return;
    }

    if (!(await handleMusicIdValidation())) return;
    if (!(await handleUploadCustomMusic())) return;

    setIsLoading(true);
    try {
      const adData = {
        campaignName,
        objective,
        adText,
        cta,
        musicOption,
        musicId: musicOption === 'None' ? null : musicId,
      };
      const response = await submitAd(adData, accessToken);
      if (response.success) {
        addToast(`Ad created successfully with ID: ${response.adId}`, 'success');
        // Optionally clear form or redirect
        setCampaignName('');
        setAdText('');
        setMusicId('');
        setGlobalError('');
        setFormErrors({});
      } else {
        setGlobalError('Failed to create ad. Please try again.');
        addToast('Failed to create ad. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Ad submission error:', error);
      handleApiError(error);
    } finally {
      setIsLoading(false); // Ensure loading state is cleared
    }
  };

  return (
    <div>
      <h1>Create New Ad</h1>
      {globalError && <div className="global-error-banner">{globalError}</div>}
      {isLoading && <p>Loading...</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Campaign Name:</label>
          <input
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            disabled={isLoading}
          />
          {formErrors.campaignName && <p className="error-message">{formErrors.campaignName}</p>}
        </div>
        <div>
          <label>Objective:</label>
          <select value={objective} onChange={(e) => setObjective(e.target.value)} disabled={isLoading}>
            <option value="Traffic">Traffic</option>
            <option value="Conversions">Conversions</option>
          </select>
        </div>
        <div>
          <label>Ad Text:</label>
          <textarea
            value={adText}
            onChange={(e) => setAdText(e.target.value)}
            maxLength={100}
            disabled={isLoading}
          />
          {formErrors.adText && <p className="error-message">{formErrors.adText}</p>}
        </div>
        <div>
          <label>CTA:</label>
          <input
            type="text"
            value={cta}
            onChange={(e) => setCta(e.target.value)}
            disabled={isLoading}
          />
          {formErrors.cta && <p className="error-message">{formErrors.cta}</p>}
        </div>
        <div>
          <label>Music Option:</label>
          <select value={musicOption} onChange={(e) => {
            setMusicOption(e.target.value);
            setMusicId(''); // Clear music ID when option changes
          }} disabled={isLoading}>
            <option value="Existing">Existing Music ID</option>
            <option value="Upload">Upload / Custom Music</option>
            <option value="None">No Music</option>
          </select>
          {formErrors.musicOption && <p className="error-message">{formErrors.musicOption}</p>}
        </div>

        {musicOption === 'Existing' && (
          <div>
            <label>Music ID:</label>
            <input
              type="text"
              value={musicId}
              onChange={(e) => setMusicId(e.target.value)}
              disabled={isLoading}
            />
            {formErrors.musicId && <p className="error-message">{formErrors.musicId}</p>}
          </div>
        )}

        <button type="submit" disabled={isLoading}>Submit Ad</button>
      </form>
    </div>
  );
}

export default AdForm;
