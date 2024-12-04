import { Event } from '../types';

export const sendEventInvitation = async (event: Event, guestEmail: string) => {
  // In a real application, this would use a proper email service
  // For demo purposes, we'll simulate email sending
  console.log(`Sending invitation for ${event.title} to ${guestEmail}`);
  
  const inviteLink = `${window.location.origin}/event/${event.id}/rsvp/${btoa(guestEmail)}`;
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    inviteLink
  };
};

export const sendEventReminder = async (event: Event, guestEmail: string) => {
  console.log(`Sending reminder for ${event.title} to ${guestEmail}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true };
};