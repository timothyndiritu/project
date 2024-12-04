export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const parseEmailList = (emails: string): string[] => {
  return emails
    .split(',')
    .map((email) => email.trim())
    .filter((email) => validateEmail(email));
};