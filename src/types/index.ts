export interface User {
  id: string;
  email: string;
  password?: string;
}

export interface Guest {
  email: string;
  status: 'pending' | 'confirmed' | 'declined';
  rsvpDate?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  hostId: string;
  createdAt: string;
  confirmedGuests: number;
  totalInvited: number;
  guests: Guest[];
  lastModified?: string;
}