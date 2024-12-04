import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { storage } from '../services/storage';
import { toast } from 'react-hot-toast';
import { Calendar, MapPin, Users, Mail, Check, X } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

interface Guest {
  email: string;
  status: 'pending' | 'confirmed' | 'declined';
}

interface EventData {
  title: string;
  date: string;
  location: string;
  description: string;
  guests: Guest[];
  confirmedGuests: number;
  totalInvited: number;
}

function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadEvent = () => {
      const eventData = storage.getEventById(id);
      setEvent(eventData);
      setLoading(false);
    };

    loadEvent();

    // Set up polling to check for updates
    const interval = setInterval(loadEvent, 5000);

    return () => clearInterval(interval);
  }, [id]);

  const handleRSVP = async (email: string, status: 'confirmed' | 'declined') => {
    if (!id || !event) return;

    try {
      const updatedGuests = event.guests.map((guest) =>
        guest.email === email ? { ...guest, status } : guest
      );

      const confirmedCount = updatedGuests.filter(
        (guest) => guest.status === 'confirmed'
      ).length;

      const updatedEvent = storage.updateEvent(id, {
        guests: updatedGuests,
        confirmedGuests: confirmedCount,
      });

      if (updatedEvent) {
        setEvent(updatedEvent);
        toast.success(`RSVP ${status} successfully!`);
      }
    } catch (error) {
      toast.error('Failed to update RSVP status.');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!event) {
    return <div className="min-h-screen flex items-center justify-center">Event not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{event.title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="h-5 w-5 mr-2" />
              <span>
                {event.confirmedGuests} confirmed of {event.totalInvited} invited
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{event.description}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Guest List</h3>
          <div className="space-y-3">
            {event.guests.map((guest) => (
              <div
                key={guest.email}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-md"
              >
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-gray-400" />
                  <span>{guest.email}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleRSVP(guest.email, 'confirmed')}
                    className={`p-2 rounded-md ${
                      guest.status === 'confirmed'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600'
                    }`}
                  >
                    <Check className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleRSVP(guest.email, 'declined')}
                    className={`p-2 rounded-md ${
                      guest.status === 'declined'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                    }`}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;