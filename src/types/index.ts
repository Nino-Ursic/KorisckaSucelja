export type UserRole = 'guest' | 'host';

export type VacationType = 'relax' | 'adventure' | 'city_break' | 'family';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: Date;
}

export interface Accommodation {
  id: string;
  hostId: string;
  name: string;
  location: string;
  description: string;
  vacationType: VacationType;
  pricePerNight: number;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  accommodationId: string;
  guestId: string;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  status: 'confirmed' | 'cancelled';
  createdAt: Date;
}

export interface BookingWithAccommodation extends Booking {
  accommodation: Accommodation;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SiteContent {
  appName: string;
  heroTitle: string;
  heroSubtitle: string;
  navLinks: NavLink[];
}

export interface SignUpFormData {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AccommodationFormData {
  name: string;
  location: string;
  description: string;
  vacationType: VacationType;
  pricePerNight: number;
  imageUrl?: string;
}

export interface BookingFormData {
  accommodationId: string;
  checkIn: string;
  checkOut: string;
}

export const VACATION_TYPE_LABELS: Record<VacationType, string> = {
  relax: 'Relax & Wellness',
  adventure: 'Adventure',
  city_break: 'City Break',
  family: 'Family Vacation',
};

export const VACATION_TYPE_ICONS: Record<VacationType, string> = {
  relax: '',
  adventure: '',
  city_break: '',
  family: '',
};
