import { useEffect, useState } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
}

export const useBiddingTime = (startAt?: Date, endAt?: Date): TimeLeft | undefined => {
  const [timeLeftMs, setTimeLeftMs] = useState<number>();
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  useEffect(() => {
    if (!startAt || !endAt) {
      return;
    }
    const intervalId = setInterval(() => {
      const now = new Date();
      setHasStarted(now >= startAt);
      const _timeLeftMs = endAt.getTime() - now.getTime();
      if(_timeLeftMs > 0) {
        setTimeLeftMs(_timeLeftMs);
      } else {
        clearInterval(intervalId);
      }
    }, 60000);
    return () => {
      clearInterval(intervalId);
    };
  }, [startAt, endAt]);

  return hasStarted && timeLeftMs ? convertTimeLeft(timeLeftMs) : undefined;
};

const convertTimeLeft = (totalMilliseconds: number): TimeLeft => {
  let totalMinutes = Math.floor(totalMilliseconds / 60000);

  const days = Math.floor(totalMinutes / (24 * 60));
  totalMinutes %= 24 * 60; // Remainder after days
  const hours = Math.floor(totalMinutes / 60);
  totalMinutes %= 60; // Remainder after hours
  const minutes = Math.floor(totalMinutes);

  return { days, hours, minutes };
};