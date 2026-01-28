import React from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import './Navbar.css'; // We'll create this next

function Navbar() {
  const { accessToken, clearAccessToken } = useAuth();
  const navigate = useNavigate();

  const handleDisconnect = () => {
    clearAccessToken();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">TikTok Ads Manager</div>
      {accessToken && (
        <button onClick={handleDisconnect} className="navbar-disconnect-button">
          Disconnect TikTok Account
        </button>
      )}
    </nav>
  );
}

export default Navbar;
