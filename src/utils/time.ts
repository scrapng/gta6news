import { formatDistanceToNow, format, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

export const formatTime = (date: string | Date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatDate = (date: string | Date, formatStr = 'MMM d, yyyy') => {
  return format(new Date(date), formatStr);
};

export const getTimeUntilStart = (startDate: string) => {
  const now = new Date();
  const start = new Date(startDate);

  const days = differenceInDays(start, now);
  const hours = differenceInHours(start, now) % 24;
  const minutes = differenceInMinutes(start, now) % 60;

  return { days, hours, minutes };
};

export const formatSteps = (steps: number): string => {
  if (steps >= 1000000) {
    return `${(steps / 1000000).toFixed(1)}M`;
  }
  if (steps >= 1000) {
    return `${(steps / 1000).toFixed(1)}k`;
  }
  return steps.toString();
};

export const getProgressPercentage = (current: number, target: number): number => {
  if (target === 0) return 0;
  return Math.min((current / target) * 100, 100);
};
