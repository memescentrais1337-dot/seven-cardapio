import { HorariosHappyHour } from '../types/menu';

/**
 * Happy Hour schedule evaluation strictly adhering to America/Sao_Paulo timezone
 * and the registered schedule table (`horarios`).
 *
 * Convention: [start, end) interval in America/Sao_Paulo.
 * An instant at start (e.g., 17:00:00) is active.
 * An instant at end - 1s (e.g., 19:59:59) is active.
 * An instant at end (e.g., 20:00:00) is outside (inactive).
 */

export interface HappyHourStatus {
  isActive: boolean;
  statusLabel: string;
  scheduleDescription: string;
  timeInEstablishment: string;
  dayOfWeekName: string;
  activeTodaySchedule: string;
}

function parseTimeToSeconds(timeStr?: string): number | null {
  if (!timeStr) return null;
  const parts = timeStr.trim().split(':').map((p) => parseInt(p, 10));
  if (parts.length < 2 || parts.some(isNaN)) return null;
  const [h, m, s = 0] = parts;
  return h * 3600 + m * 60 + s;
}

function formatHHMM(timeStr?: string): string {
  if (!timeStr) return '';
  const parts = timeStr.trim().split(':');
  if (parts.length < 2) return timeStr;
  return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
}

function getDayScheduleKeys(weekdayLower: string): {
  startKey: keyof HorariosHappyHour;
  endKey: keyof HorariosHappyHour;
} {
  if (weekdayLower.includes('segunda')) {
    return { startKey: 'inicioSegunda', endKey: 'fimSegunda' };
  }
  if (weekdayLower.includes('terça') || weekdayLower.includes('terca')) {
    return { startKey: 'inicioTerca', endKey: 'fimTerca' };
  }
  if (weekdayLower.includes('quarta')) {
    return { startKey: 'inicioQuarta', endKey: 'fimQuarta' };
  }
  if (weekdayLower.includes('quinta')) {
    return { startKey: 'inicioQuinta', endKey: 'fimQuinta' };
  }
  if (weekdayLower.includes('sexta')) {
    return { startKey: 'inicioSexta', endKey: 'fimSexta' };
  }
  if (weekdayLower.includes('sábado') || weekdayLower.includes('sabado')) {
    return { startKey: 'inicioSabado', endKey: 'fimSabado' };
  }
  return { startKey: 'inicioDomingo', endKey: 'fimDomingo' };
}

export function checkHappyHourStatus(
  timezone: string = 'America/Sao_Paulo',
  horarios?: HorariosHappyHour | null,
  forcedDate?: Date
): HappyHourStatus {
  const now = forcedDate || new Date();

  // Extract day and time parts in establishment timezone
  let weekdayStr = '';
  let hour = 0;
  let minute = 0;
  let second = 0;

  try {
    const dtf = new Intl.DateTimeFormat('pt-BR', {
      timeZone: timezone,
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    });

    const parts = dtf.formatToParts(now);
    for (const part of parts) {
      if (part.type === 'weekday') weekdayStr = part.value.toLowerCase();
      if (part.type === 'hour') hour = parseInt(part.value, 10) % 24;
      if (part.type === 'minute') minute = parseInt(part.value, 10);
      if (part.type === 'second') second = parseInt(part.value, 10);
    }
  } catch {
    // Fallback to fixed BRT (UTC-3) if Intl timeZone is unavailable
    const brt = new Date(now.getTime() - 3 * 3600 * 1000);
    const days = [
      'domingo',
      'segunda-feira',
      'terça-feira',
      'quarta-feira',
      'quinta-feira',
      'sexta-feira',
      'sábado',
    ];
    weekdayStr = days[brt.getUTCDay()] ?? 'segunda-feira';
    hour = brt.getUTCHours();
    minute = brt.getUTCMinutes();
    second = brt.getUTCSeconds();
  }

  // Current time in seconds from midnight
  const currentSeconds = hour * 3600 + minute * 60 + second;

  const { startKey, endKey } = getDayScheduleKeys(weekdayStr);
  const rawStart = horarios?.[startKey] ?? '17:00:00';
  const rawEnd = horarios?.[endKey] ?? '20:00:00';

  const startSeconds = parseTimeToSeconds(rawStart);
  const endSeconds = parseTimeToSeconds(rawEnd);

  // Active check using inclusive start and exclusive end: [start, end)
  const isActive =
    startSeconds !== null &&
    endSeconds !== null &&
    currentSeconds >= startSeconds &&
    currentSeconds < endSeconds;

  const formattedStart = formatHHMM(rawStart);
  const formattedEnd = formatHHMM(rawEnd);
  const activeTodaySchedule =
    formattedStart && formattedEnd
      ? `Hoje: ${formattedStart} às ${formattedEnd}`
      : 'Sem Happy Hour hoje';

  const pad = (n: number) => String(n).padStart(2, '0');
  const timeInEstablishment = `${pad(hour)}:${pad(minute)}`;

  // Capitalize weekday
  const capitalizedWeekday =
    weekdayStr.charAt(0).toUpperCase() + weekdayStr.slice(1);

  return {
    isActive,
    statusLabel: isActive
      ? 'Happy Hour ativo'
      : 'Fora do horário do Happy Hour',
    scheduleDescription:
      formattedStart && formattedEnd
        ? `Todos os dias das ${formattedStart} às ${formattedEnd}`
        : 'Horário programado do Happy Hour',
    timeInEstablishment,
    dayOfWeekName: capitalizedWeekday,
    activeTodaySchedule,
  };
}
