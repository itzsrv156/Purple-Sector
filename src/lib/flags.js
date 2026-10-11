// Real flag images (flagcdn.com) instead of emoji — emoji flags don't render on Windows.
const NATIONALITY = {
  British: 'gb', Dutch: 'nl', Monegasque: 'mc', Australian: 'au', Italian: 'it', French: 'fr', Spanish: 'es',
  German: 'de', Finnish: 'fi', Thai: 'th', Canadian: 'ca', Mexican: 'mx', Brazilian: 'br', 'New Zealander': 'nz',
  Argentine: 'ar', Japanese: 'jp', Chinese: 'cn', Danish: 'dk', American: 'us', Swedish: 'se', Austrian: 'at',
  Belgian: 'be', Polish: 'pl', Russian: 'ru', Swiss: 'ch', Indonesian: 'id', Venezuelan: 've', Hungarian: 'hu',
  'South African': 'za', Irish: 'ie', Colombian: 'co', Portuguese: 'pt', Malaysian: 'my', Estonian: 'ee',
};
const COUNTRY = {
  Australia: 'au', China: 'cn', Japan: 'jp', Bahrain: 'bh', 'Saudi Arabia': 'sa', USA: 'us', 'United States': 'us',
  Italy: 'it', Monaco: 'mc', Canada: 'ca', Spain: 'es', Austria: 'at', UK: 'gb', 'United Kingdom': 'gb',
  Hungary: 'hu', Belgium: 'be', Netherlands: 'nl', Azerbaijan: 'az', Singapore: 'sg', Mexico: 'mx', Brazil: 'br',
  UAE: 'ae', Qatar: 'qa', Malaysia: 'my', Germany: 'de', France: 'fr', Portugal: 'pt', Turkey: 'tr', Russia: 'ru',
};
export const isoFromNationality = n => NATIONALITY[n] || 'un';
export const isoFromCountry = c => COUNTRY[c] || 'un';
export const flagSrc = (iso, w = 40) => `https://flagcdn.com/w${w}/${iso}.png`;
