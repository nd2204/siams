export type TimeRange = '1h' | '6h' | '24h' | '7d';

export class TimeFilter {
  static lastHour: '1h'
  static last6h: '6h'
}

export function formatLastSeenTime(pastDate: Date) {
  const now = new Date();
  const secondsElapsed = Math.floor((now.getTime() - pastDate.getTime()) / 1000); // Difference in seconds

  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  // Define time intervals in seconds
  const minute = 60;
  const hour = 3600;
  const day = 86400;

  if (secondsElapsed < minute) {
    return formatter.format(-secondsElapsed, 'second');
  } else if (secondsElapsed < hour) {
    const minutes = Math.floor(secondsElapsed / minute);
    return formatter.format(-minutes, 'minute');
  } else if (secondsElapsed < day) {
    const hours = Math.floor(secondsElapsed / hour);
    return formatter.format(-hours, 'hour');
  } else {
    // For longer periods, you might want a specific date format
    return pastDate.toLocaleDateString();
  }
}

export function MilitaryTimeFromISO(iso: string, options?: Partial<Intl.DateTimeFormatOptions>): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;

  options = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // Force 24-hour format
    ...options // overwrite default
  };

  // Use 'en-GB' locale as it defaults to a 24-hour clock, 
  // ensuring consistency even if 'hour12: false' is ignored by some environments.
  return new Intl.DateTimeFormat('en-GB', options).format(d);
}

export function LocaleTimeStringFromISO(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString();
}

export function LocaleDateStringFromISO(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString();
}

export function FormatRelativeDayFromISO(iso: string): string {
  const now = Date.now();
  const isoDate = new Date(iso)
  const diffInMilliseconds = isoDate.getTime() - now;
  const diffInDays = Math.round(diffInMilliseconds / (1000 * 60 * 60 * 24)) + 1;

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (diffInDays !== 0 && diffInDays < -1) {
    return isoDate.toLocaleDateString()
  }
  return rtf.format(diffInDays, 'day');
};
