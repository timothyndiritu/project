interface User {
  id: string;
  email: string;
  password: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  hostId: string;
  createdAt: string;
  confirmedGuests: number;
  totalInvited: number;
  guests: {
    email: string;
    status: 'pending' | 'confirmed' | 'declined';
  }[];
}

class StorageService {
  private getItem<T>(key: string): T[] {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : [];
  }

  private setItem<T>(key: string, value: T[]): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // User methods
  getUsers(): User[] {
    return this.getItem<User>('users');
  }

  createUser(email: string, password: string): User {
    const users = this.getUsers();
    const newUser = { id: crypto.randomUUID(), email, password };
    users.push(newUser);
    this.setItem('users', users);
    return newUser;
  }

  findUser(email: string, password: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.email === email && user.password === password) || null;
  }

  // Event methods
  getEvents(): Event[] {
    return this.getItem<Event>('events');
  }

  getEventsByHost(hostId: string): Event[] {
    return this.getEvents().filter(event => event.hostId === hostId);
  }

  getEventById(id: string): Event | null {
    return this.getEvents().find(event => event.id === id) || null;
  }

  createEvent(eventData: Omit<Event, 'id'>): Event {
    const events = this.getEvents();
    const newEvent = { ...eventData, id: crypto.randomUUID() };
    events.push(newEvent);
    this.setItem('events', events);
    return newEvent;
  }

  updateEvent(id: string, eventData: Partial<Event>): Event | null {
    const events = this.getEvents();
    const index = events.findIndex(event => event.id === id);
    if (index === -1) return null;

    const updatedEvent = { ...events[index], ...eventData };
    events[index] = updatedEvent;
    this.setItem('events', events);
    return updatedEvent;
  }
}

export const storage = new StorageService();