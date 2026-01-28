import React, { useEffect, useState } from 'react';

function Toast({ id, message, type, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300); // Allow fade-out animation before removal
    }, 5000); // Toast disappears after 5 seconds

    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div className={`toast toast-${type} ${isVisible ? 'toast-enter' : 'toast-exit'}`}>
      <p>{message}</p>
      <button onClick={() => {
        setIsVisible(false);
        setTimeout(() => onClose(id), 300);
      }}>X</button>
    </div>
  );
}

export default Toast;
