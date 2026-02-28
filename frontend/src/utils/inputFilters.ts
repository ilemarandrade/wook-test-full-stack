export const filterNumbers = (value: string): string => {
  if (typeof value !== 'string') return '';
  return value.replace(/\D+/g, '');
};

export const filterLetters = (value: string): string => {
  if (typeof value !== 'string') return '';

  // Keep all Unicode letters and whitespace (spaces, tabs, etc.)
  return value.replace(/[^\p{L}\s]+/gu, '');
};
