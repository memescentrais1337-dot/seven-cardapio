import { useState, useEffect } from 'react';
import { checkHappyHourStatus, HappyHourStatus } from '../utils/happyHour';
import { HorariosHappyHour } from '../types/menu';

export function useHappyHour(
  timezone: string = 'America/Sao_Paulo',
  horarios?: HorariosHappyHour | null
): HappyHourStatus {
  const [status, setStatus] = useState<HappyHourStatus>(() =>
    checkHappyHourStatus(timezone, horarios)
  );

  useEffect(() => {
    let minuteInterval: ReturnType<typeof setInterval> | undefined;

    const update = () => {
      setStatus(checkHappyHourStatus(timezone, horarios));
    };

    // Update immediately when mounted or schedule changes
    update();

    // Align with the exact start of the next minute so boundaries like 17:00:00 / 20:00:00 trigger immediately
    const now = new Date();
    const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds() + 50;

    const boundaryTimeout = setTimeout(() => {
      update();
      minuteInterval = setInterval(update, 60000);
    }, Math.max(msUntilNextMinute, 250));

    // Also poll every 30s as a safety fallback against timer throttling
    const safetyInterval = setInterval(update, 30000);

    // Re-check immediately when returning to the tab or focusing the window
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        update();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('focus', update);
    window.addEventListener('pageshow', update);

    return () => {
      clearTimeout(boundaryTimeout);
      if (minuteInterval) clearInterval(minuteInterval);
      clearInterval(safetyInterval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('focus', update);
      window.removeEventListener('pageshow', update);
    };
  }, [timezone, horarios]);

  return status;
}
