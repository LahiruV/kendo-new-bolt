export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const getMonths = (): string[] => {
  return [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
};

export const getCurrentMonthIndex = (): number => {
  return new Date().getMonth();
};

export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

export const generateYears = (startYear: number = getCurrentYear() - 2): number[] => {
  const currentYear = getCurrentYear();
  const years = [];
  
  for (let year = startYear; year <= currentYear + 1; year++) {
    years.push(year);
  }
  
  return years;
};