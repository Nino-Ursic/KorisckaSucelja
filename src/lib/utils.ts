import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

export function calculateNights(checkIn: Date | string, checkOut: Date | string): number {
  const start = typeof checkIn === 'string' ? new Date(checkIn) : checkIn;
  const end = typeof checkOut === 'string' ? new Date(checkOut) : checkOut;
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateTotalPrice(pricePerNight: number, nights: number): number {
  return pricePerNight * nights;
}

export function isUpcoming(checkIn: Date | string): boolean {
  const checkInDate = typeof checkIn === 'string' ? new Date(checkIn) : checkIn;
  return checkInDate > new Date();
}

export function getPlaceholderImage(seed: string): string {
  return `/api/placeholder?seed=${encodeURIComponent(seed)}`;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
