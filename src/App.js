import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { ToastProvider } from './components/ToastContainer'; // Import ToastProvider
import Navbar from './Navbar';
import OAuth from './OAuth';
import Callback from './Callback';
import AdForm from './AdForm';

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <Navbar />
          <div className="app-container-wrapper">
            <div className="App">
              <Routes>
                <Route path="/" element={<OAuth />} />
                <Route path="/callback" element={<Callback />} />
                <Route path="/ad-form" element={<AdForm />} />
              </Routes>
            </div>
            {/* Decorative background elements */}
            <div className="decorative-element" style={{ top: '10%', left: '5%', width: '70px', height: '70px', animationDelay: '0s', background: 'rgba(231, 60, 126, 0.15)' }}></div>
            <div className="decorative-element" style={{ top: '60%', right: '8%', width: '110px', height: '110px', animationDelay: '5s', background: 'rgba(35, 166, 213, 0.15)' }}></div>
            <div className="decorative-element" style={{ bottom: '5%', left: '25%', width: '50px', height: '50px', animationDelay: '10s', background: 'rgba(238, 119, 82, 0.15)', borderRadius: '20%' }}></div>
            <div className="decorative-element" style={{ top: '20%', right: '15%', width: '90px', height: '90px', animationDelay: '3s', background: 'rgba(35, 213, 171, 0.15)', borderRadius: '30%' }}></div>
            <div className="decorative-element" style={{ bottom: '15%', left: '50%', width: '60px', height: '60px', animationDelay: '7s', background: 'rgba(231, 60, 126, 0.15)', transform: 'rotate(45deg)' }}></div>
            <div className="decorative-element" style={{ top: '40%', left: '15%', width: '130px', height: '130px', animationDelay: '12s', background: 'rgba(238, 119, 82, 0.15)', borderRadius: '60%' }}></div>
            <div className="decorative-element" style={{ bottom: '30%', right: '20%', width: '85px', height: '85px', animationDelay: '2s', background: 'rgba(35, 166, 213, 0.15)' }}></div>

            {/* New Animated Cube Elements */}
            <div className="animated-cube" style={{ top: '15%', left: '10%', animationDelay: '0s' }}></div>
            <div className="animated-cube" style={{ top: '70%', right: '15%', animationDelay: '8s' }}></div>
            <div className="animated-cube" style={{ bottom: '10%', left: '30%', animationDelay: '16s' }}></div>
          </div>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
