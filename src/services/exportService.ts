import { jsPDF } from 'jspdf';
import Papa from 'papaparse';
import { createEvents } from 'ics';
import { Event, Guest } from '../types';
import { formatDate } from '../utils/dateUtils';

export const exportToCSV = (event: Event): string => {
  const guestData = event.guests.map(guest => ({
    Email: guest.email,
    Status: guest.status,
    'RSVP Date': guest.rsvpDate || ''
  }));

  const csv = Papa.unparse(guestData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  return URL.createObjectURL(blob);
};

export const exportToPDF = (event: Event): string => {
  const doc = new jsPDF();
  
  // Add event details
  doc.setFontSize(20);
  doc.text(event.title, 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Date: ${formatDate(event.date)}`, 20, 35);
  doc.text(`Location: ${event.location}`, 20, 45);
  doc.text(`Description: ${event.description}`, 20, 55);
  
  // Add guest list
  doc.text('Guest List:', 20, 75);
  event.guests.forEach((guest, index) => {
    doc.text(
      `${guest.email} - ${guest.status}`,
      20,
      85 + (index * 10)
    );
  });
  
  // Generate stats
  const confirmed = event.guests.filter(g => g.status === 'confirmed').length;
  const declined = event.guests.filter(g => g.status === 'declined').length;
  const pending = event.guests.filter(g => g.status === 'pending').length;
  
  doc.text('Statistics:', 20, 85 + (event.guests.length * 10) + 20);
  doc.text(`Confirmed: ${confirmed}`, 20, 85 + (event.guests.length * 10) + 30);
  doc.text(`Declined: ${declined}`, 20, 85 + (event.guests.length * 10) + 40);
  doc.text(`Pending: ${pending}`, 20, 85 + (event.guests.length * 10) + 50);
  
  return URL.createObjectURL(doc.output('blob'));
};

export const generateICSFile = (event: Event): Promise<string> => {
  return new Promise((resolve, reject) => {
    const startDate = new Date(event.date);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours duration

    createEvents([{
      start: [
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        startDate.getDate(),
        startDate.getHours(),
        startDate.getMinutes()
      ],
      end: [
        endDate.getFullYear(),
        endDate.getMonth() + 1,
        endDate.getDate(),
        endDate.getHours(),
        endDate.getMinutes()
      ],
      title: event.title,
      description: event.description,
      location: event.location,
      url: `${window.location.origin}/event/${event.id}`
    }], (error, value) => {
      if (error) {
        reject(error);
      }
      const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
      resolve(URL.createObjectURL(blob));
    });
  });
};