import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { storage } from '../services/storage';
import { toast } from 'react-hot-toast';
import { Calendar, MapPin, Mail, Users } from 'lucide-react';
import { parseEmailList } from '../utils/emailUtils';
import { isValidDate } from '../utils/dateUtils';

function CreateEvent() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    guestEmails: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidDate(formData.date)) {
      toast.error('Please enter a valid date');
      return;
    }

    try {
      const guestList = parseEmailList(formData.guestEmails);
      
      if (guestList.length === 0) {
        toast.error('Please enter at least one valid email address');
        return;
      }

      const eventData = {
        ...formData,
        hostId: currentUser?.id,
        createdAt: new Date().toISOString(),
        confirmedGuests: 0,
        totalInvited: guestList.length,
        guests: guestList.map((email) => ({
          email,
          status: 'pending',
        })),
      };

      const newEvent = storage.createEvent(eventData);
      toast.success('Event created successfully!');
      navigate(`/event/${newEvent.id}`);
    } catch (error) {
      toast.error('Failed to create event. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Event</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Event Title
          </label>
          <div className="mt-1 relative">
            {/* <Calendar className="absolute top-3 left-3 h-5 w-5 text-gray-400" /> */}
            <input
              style={{padding:"10px"}}
              type="text"
              name="title"
              id="title"
              required
              className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date and Time
          </label>
          <input
            style={{padding:"10px"}}
            type="datetime-local"
            name="date"
            id="date"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <div className="mt-1 relative">
            {/* <MapPin className="absolute top-3 left-3 h-5 w-5 text-gray-400" /> */}
            <input
              style={{padding:"10px"}}
              type="text"
              name="location"
              id="location"
              required
              className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="guestEmails" className="block text-sm font-medium text-gray-700">
            Guest Emails (comma-separated)
          </label>
          <div className="mt-1 relative">
            <Users className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
            <textarea
              name="guestEmails"
              id="guestEmails"
              required
              rows={3}
              className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="email1@example.com, email2@example.com"
              value={formData.guestEmails}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateEvent;