import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../services/storage';
import { formatDate } from '../utils/dateUtils';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  confirmedGuests: number;
  totalInvited: number;
}

function Dashboard() {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    const userEvents = storage.getEventsByHost(currentUser.id);
    setEvents(userEvents);

    // Set up an interval to refresh events every 5 seconds
    const interval = setInterval(() => {
      const refreshedEvents = storage.getEventsByHost(currentUser.id);
      setEvents(refreshedEvents);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentUser]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
        <Link
          to="/create-event"
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          Create New Event
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Link
            key={event.id}
            to={`/event/${event.id}`}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-4">{event.title}</h2>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="w-5 h-5 mr-2" />
                <span>{event.confirmedGuests} / {event.totalInvited} confirmed</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-2" />
                <span>{event.location}</span>
              </div>
            </div>
          </Link>
        ))}

        {events.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-md">
            <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
            <p className="text-gray-500">Create your first event to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;