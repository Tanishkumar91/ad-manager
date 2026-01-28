const MOCK_ACCESS_TOKEN = "mock_tiktok_access_token";

const MOCK_API_ERRORS = {
  INVALID_CLIENT: { status: 400, code: 10001, message: "Invalid client ID or secret." },
  MISSING_PERMISSION: { status: 403, code: 10002, message: "Missing required Ads permission scope." },
  EXPIRED_TOKEN: { status: 401, code: 10003, message: "Expired or revoked access token." },
  GEO_RESTRICTION: { status: 403, code: 10004, message: "Geo-restricted access to the API." },
  INVALID_MUSIC_ID: { status: 400, code: 20001, message: "Invalid Music ID provided." },
  GENERIC_ERROR: { status: 500, code: 99999, message: "An unexpected API error occurred." },
};

/**
 * Simulates the TikTok OAuth process.
 * @param {string} code - The authorization code received from TikTok.
 * @returns {Promise<{access_token: string}>} - Resolves with a mock access token.
 */
export const exchangeCodeForToken = async (code) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (code === 'mock_invalid_client') {
        return reject(MOCK_API_ERRORS.INVALID_CLIENT);
      }
      if (code === 'mock_missing_permission') {
        return reject(MOCK_API_ERRORS.MISSING_PERMISSION);
      }
      if (code === 'mock_expired_token') {
        return reject(MOCK_API_ERRORS.EXPIRED_TOKEN);
      }
      if (code === 'mock_geo_restriction') {
        return reject(MOCK_API_ERRORS.GEO_RESTRICTION);
      }
      if (code) {
        resolve({ access_token: MOCK_ACCESS_TOKEN });
      } else {
        reject(MOCK_API_ERRORS.GENERIC_ERROR);
      }
    }, 1000);
  });
};

/**
 * Simulates validation of a Music ID.
 * @param {string} musicId - The ID of the music to validate.
 * @param {string} accessToken - The user's access token.
 * @returns {Promise<{valid: boolean}>} - Resolves with validation status.
 */
export const validateMusicId = async (musicId, accessToken) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!accessToken || accessToken !== MOCK_ACCESS_TOKEN) {
        return reject(MOCK_API_ERRORS.EXPIRED_TOKEN);
      }
      if (musicId === 'invalid_music') {
        return reject(MOCK_API_ERRORS.INVALID_MUSIC_ID);
      }
      if (musicId === 'valid_music') {
        resolve({ valid: true });
      } else {
        resolve({ valid: false }); // Default for unknown music IDs
      }
    }, 500);
  });
};

/**
 * Simulates uploading custom music and generating an ID.
 * @param {string} accessToken - The user's access token.
 * @returns {Promise<{musicId: string}>} - Resolves with a mock music ID.
 */
export const uploadCustomMusic = async (accessToken) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!accessToken || accessToken !== MOCK_ACCESS_TOKEN) {
        return reject(MOCK_API_ERRORS.EXPIRED_TOKEN);
      }
      // Simulate some uploads failing
      if (Math.random() > 0.8) { // 20% chance of failure
        return reject(MOCK_API_ERRORS.INVALID_MUSIC_ID); // Simulate upload validation failure
      }
      resolve({ musicId: `mock_music_${Date.now()}` });
    }, 1500);
  });
};

/**
 * Simulates submitting an ad creative to TikTok Ads API.
 * @param {object} adData - The ad creative data.
 * @param {string} accessToken - The user's access token.
 * @returns {Promise<{success: boolean, adId?: string}>} - Resolves with submission status.
 */
export const submitAd = async (adData, accessToken) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!accessToken || accessToken !== MOCK_ACCESS_TOKEN) {
        return reject(MOCK_API_ERRORS.EXPIRED_TOKEN);
      }
      if (adData.campaignName === 'fail_geo') {
        return reject(MOCK_API_ERRORS.GEO_RESTRICTION);
      }
      if (adData.campaignName === 'fail_permission') {
        return reject(MOCK_API_ERRORS.MISSING_PERMISSION);
      }
      if (adData.musicId === 'invalid_music') {
        return reject(MOCK_API_ERRORS.INVALID_MUSIC_ID);
      }

      // Simulate successful submission
      resolve({ success: true, adId: `ad_${Date.now()}` });
    }, 1000);
  });
};


export const TIKTOK_OAUTH_CONFIG = {
  CLIENT_ID: 'YOUR_TIKTOK_CLIENT_ID',
  REDIRECT_URI: window.location.origin + '/callback',
  SCOPE: 'aweme.share,user.info.basic,ads_management.basic',
  AUTH_URL: 'https://open-api.tiktok.com/platform/oauth/connect/',
};

export const MOCK_TIKTOK_OAUTH_URL = window.location.origin + '/callback?code=mock_auth_code';
