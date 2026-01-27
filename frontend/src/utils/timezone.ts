/**
 * ASEAN + Timor-Leste Country Timezone Utility
 * Maps ASEAN countries and Timor-Leste to their IANA timezone identifiers
 */

// Country to Timezone mapping for ASEAN + Timor-Leste
export const COUNTRY_TIMEZONES: Record<string, string> = {
  // ASEAN Countries
  'Brunei': 'Asia/Brunei',
  'Cambodia': 'Asia/Phnom_Penh',
  'Indonesia': 'Asia/Jakarta', // Using WIB (Western Indonesian Time) as default
  'Laos': 'Asia/Vientiane',
  'Malaysia': 'Asia/Kuala_Lumpur',
  'Myanmar': 'Asia/Yangon',
  'Philippines': 'Asia/Manila',
  'Singapore': 'Asia/Singapore',
  'Thailand': 'Asia/Bangkok',
  'Vietnam': 'Asia/Ho_Chi_Minh',
  // Timor-Leste (non-ASEAN)
  'Timor-Leste': 'Asia/Dili',
  // Fallback
  'default': 'UTC'
};

// Get timezone abbreviation for display
export const TIMEZONE_ABBREVIATIONS: Record<string, string> = {
  'Asia/Brunei': 'BNT',
  'Asia/Phnom_Penh': 'ICT',
  'Asia/Jakarta': 'WIB',
  'Asia/Vientiane': 'ICT',
  'Asia/Kuala_Lumpur': 'MYT',
  'Asia/Yangon': 'MMT',
  'Asia/Manila': 'PHT',
  'Asia/Singapore': 'SGT',
  'Asia/Bangkok': 'ICT',
  'Asia/Ho_Chi_Minh': 'ICT',
  'Asia/Dili': 'TLT',
  'UTC': 'UTC'
};

/**
 * Get the IANA timezone for a given country
 */
export function getTimezoneForCountry(country: string): string {
  return COUNTRY_TIMEZONES[country] || COUNTRY_TIMEZONES['default'];
}

/**
 * Get the timezone abbreviation for a given country
 */
export function getTimezoneAbbreviation(country: string): string {
  const timezone = getTimezoneForCountry(country);
  return TIMEZONE_ABBREVIATIONS[timezone] || 'UTC';
}

/**
 * Get current time in a specific country's timezone
 */
export function getCurrentTimeInTimezone(country: string): Date {
  const timezone = getTimezoneForCountry(country);
  
  // Create a date string in the target timezone
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  
  const formatter = new Intl.DateTimeFormat('en-CA', options);
  const parts = formatter.formatToParts(new Date());
  
  const dateParts: Record<string, string> = {};
  parts.forEach(part => {
    dateParts[part.type] = part.value;
  });
  
  // Construct date in the target timezone
  const dateStr = `${dateParts.year}-${dateParts.month}-${dateParts.day}T${dateParts.hour}:${dateParts.minute}:${dateParts.second}`;
  return new Date(dateStr);
}

/**
 * Format a date according to a specific timezone
 */
export function formatInTimezone(
  date: Date, 
  country: string, 
  options?: Intl.DateTimeFormatOptions
): string {
  const timezone = getTimezoneForCountry(country);
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    ...options
  };
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
}

/**
 * Get formatted time string (HH:mm:ss) for a country
 */
export function getTimeString(country: string): string {
  const timezone = getTimezoneForCountry(country);
  
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(new Date());
}

/**
 * Get formatted date string for a country
 */
export function getDateString(country: string): string {
  const timezone = getTimezoneForCountry(country);
  
  return new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());
}

/**
 * Get hour of day in a specific timezone (0-23)
 */
export function getHourInTimezone(country: string): number {
  const timezone = getTimezoneForCountry(country);
  
  const hourStr = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    hour12: false
  }).format(new Date());
  
  return parseInt(hourStr, 10);
}

/**
 * Get short date string for a country (e.g., "Mon, Jan 27")
 */
export function getShortDateString(country: string): string {
  const timezone = getTimezoneForCountry(country);
  
  return new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(new Date());
}
