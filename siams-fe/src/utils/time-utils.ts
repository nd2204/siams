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

