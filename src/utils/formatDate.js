export function formatDateTime(date, locale) {
  if (!date) return '';
  const localeCode = locale === 'uk' ? 'uk-UA' : 'en-US';
  const options = {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  const formatter = new Intl.DateTimeFormat(localeCode, options);
  const parts = formatter.formatToParts(date);

  const dayName = parts.find(part => part.type === 'weekday')?.value || '';
  const day = parts.find(part => part.type === 'day')?.value || '';
  const month = parts.find(part => part.type === 'month')?.value || '';
  const hour = parts.find(part => part.type === 'hour')?.value || '';
  const minute = parts.find(part => part.type === 'minute')?.value || '';

  return localeCode === 'uk-UA'
    ? `${dayName}, ${day} ${month} ${hour}:${minute}`
    : `${dayName}, ${month} ${day}, ${hour}:${minute}`;
}