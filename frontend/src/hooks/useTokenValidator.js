import { useEffect, useRef } from "react";
import useAuthStore from "../hooks/useAuthStore";

const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
const COUNTDOWN_INTERVAL = 60 * 1000; // 1 minute in milliseconds

export function useTokenValidator() {
  const checkSession = useAuthStore((state) => state.checkSession);
  const tokenExpiration = useAuthStore((state) => state.tokenExpiration);
  const status = useAuthStore((state) => state.status);
  const remainingTimeRef = useRef(CHECK_INTERVAL);

  useEffect(() => {
    if (status !== 'authenticated') {
      // If no active session, do not start intervals
      return;
    }

    // Check immediately on mount
    checkSession();

    // Countdown timer for CHECK_INTERVAL every minute
    const countdownInterval = setInterval(() => {
      remainingTimeRef.current -= COUNTDOWN_INTERVAL;
      const minutesLeft = Math.max(remainingTimeRef.current / 60000, 0);
      const currentTime = Date.now();
      const tokenValid = tokenExpiration && currentTime < tokenExpiration;
      console.log(`Token validation check in: ${minutesLeft} minutes. Token is ${tokenValid ? 'valid' : 'expired'}.`);
      if (remainingTimeRef.current <= 0) {
        remainingTimeRef.current = CHECK_INTERVAL;
      }
    }, COUNTDOWN_INTERVAL);

    // Set interval to check token validity every 5 minutes
    const intervalId = setInterval(() => {
      checkSession();
      remainingTimeRef.current = CHECK_INTERVAL;
    }, CHECK_INTERVAL);

    // Cleanup interval on unmount
    return () => {
      clearInterval(intervalId);
      clearInterval(countdownInterval);
    };
  }, [checkSession, tokenExpiration, status]);
}
