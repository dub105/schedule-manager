import type { Period } from './types';

export const PERIODS: Period[] = [
  { period: 1, label: '1限', start: '08:30', end: '09:30' },
  { period: 2, label: '2限', start: '09:40', end: '10:40' },
  { period: 3, label: '3限', start: '10:50', end: '11:50' },
  { period: 4, label: '4限', start: '12:50', end: '13:50' },
  { period: 5, label: '5限', start: '14:00', end: '15:00' },
  { period: 6, label: '6限', start: '15:10', end: '16:10' },
];

export const COURSE_COLORS = [
  { value: 'blue',   cls: 'bg-blue-500',   light: 'bg-blue-100',   text: 'text-blue-800',   border: 'border-blue-300' },
  { value: 'green',  cls: 'bg-green-500',  light: 'bg-green-100',  text: 'text-green-800',  border: 'border-green-300' },
  { value: 'purple', cls: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
  { value: 'orange', cls: 'bg-orange-500', light: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
  { value: 'red',    cls: 'bg-red-500',    light: 'bg-red-100',    text: 'text-red-800',    border: 'border-red-300' },
  { value: 'pink',   cls: 'bg-pink-500',   light: 'bg-pink-100',   text: 'text-pink-800',   border: 'border-pink-300' },
] as const;
