import React, { useState, useEffect } from 'react';

function ReservationTimer({ onExpire, initialSeconds = 300 }) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) {
      if (onExpire) onExpire();
      return;
    }

    const timer = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, onExpire]);

  const mins = Math.floor(seconds / 60);
  const secs = String(seconds % 60).padStart(2, '0');

  return (
    <div className="text-red-600 font-bold text-xl my-4">
      Your items are reserved for {mins}:{secs}
    </div>
  );
}

export default ReservationTimer;
