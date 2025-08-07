export function getISODate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getTime(date: string) {
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(date: string) {
  const convertedDate = new Date(date);

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  return convertedDate.toLocaleDateString('en-GB', options);
}

export function getDay(date: string, format = 'short') {
  const convertedDate = new Date(date);

  if (format === 'numeric') {
    return convertedDate.getDate();
  }

  if (format === 'short') {
    return convertedDate.toLocaleDateString('en-US', { weekday: 'short' });
  }
}

export function getMonth(date: string, format = 'short') {
  const convertedDate = new Date(date);

  if (format === 'numeric') {
    return convertedDate.getMonth() + 1;
  }

  if (format === 'short') {
    return convertedDate.toLocaleDateString('en-US', { month: 'short' });
  }
}

export function normalizeDate(date: Date) {
  const dateValue = new Date(date);
  dateValue.setHours(0, 0, 0, 0);

  return dateValue;
}

export const now = new Date();
export const nowLaterMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
