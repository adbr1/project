import { useState, useEffect, useCallback } from 'react';

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
  isFinished: boolean;
  totalSeconds: number;
}

export function useCountdown(targetTime: string): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isFinished: false,
    totalSeconds: 0
  });

  const calculateTimeLeft = useCallback(() => {
    const now = new Date();
    const [hours, minutes] = targetTime.split(':').map(Number);
    const target = new Date();
    target.setHours(hours, minutes, 0, 0);

    if (target.getTime() < now.getTime()) {
      return {
        hours: 0,
        minutes: 0,
        seconds: 0,
        isFinished: true,
        totalSeconds: 0
      };
    }

    const difference = target.getTime() - now.getTime();
    const totalSeconds = Math.floor(difference / 1000);
    
    return {
      hours: Math.floor(totalSeconds / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
      isFinished: false,
      totalSeconds
    };
  }, [targetTime]);

  useEffect(() => {
    const updateTimer = () => {
      setTimeLeft(calculateTimeLeft());
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return timeLeft;
}