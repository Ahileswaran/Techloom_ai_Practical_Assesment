import React, { useEffect, useState } from 'react';

export default function ReservationTimer({ onExpire, initialSeconds = 300 }) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) {
      onExpire();
      return;
    }

    const intervalId = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [seconds, onExpire]);

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const formatted = `${m}:${s.toString().padStart(2, '0')}`;

  return <>{formatted}</>;
}
