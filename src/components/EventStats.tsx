import React from 'react';
import { Event } from '../types';
import { PieChart, Download, Calendar } from 'lucide-react';
import { exportToCSV, exportToPDF, generateICSFile } from '../services/exportService';
import { toast } from 'react-hot-toast';

interface EventStatsProps {
  event: Event;
}

function EventStats({ event }: EventStatsProps) {
  const confirmed = event.guests.filter(g => g.status === 'confirmed').length;
  const declined = event.guests.filter(g => g.status === 'declined').length;
  const pending = event.guests.filter(g => g.status === 'pending').length;
  const total = event.guests.length;

  const handleExport = async (type: 'csv' | 'pdf' | 'ics') => {
    try {
      let url;
      let filename;

      switch (type) {
        case 'csv':
          url = exportToCSV(event);
          filename = `${event.title}-guests.csv`;
          break;
        case 'pdf':
          url = exportToPDF(event);
          filename = `${event.title}-report.pdf`;
          break;
        case 'ics':
          url = await generateICSFile(event);
          filename = `${event.title}.ics`;
          break;
      }

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`${type.toUpperCase()} exported successfully!`);
    } catch (error) {
      toast.error(`Failed to export ${type.toUpperCase()}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Event Statistics</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => handleExport('csv')}
            className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
            title="Export to CSV"
          >
            <Download className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
            title="Export to PDF"
          >
            <PieChart className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleExport('ics')}
            className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
            title="Add to Calendar"
          >
            <Calendar className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{total}</div>
          <div className="text-sm text-gray-600">Total Invited</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{confirmed}</div>
          <div className="text-sm text-gray-600">Confirmed</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{declined}</div>
          <div className="text-sm text-gray-600">Declined</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500"
            style={{ width: `${(confirmed / total) * 100}%` }}
          />
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {Math.round((confirmed / total) * 100)}% Confirmation Rate
        </div>
      </div>
    </div>
  );
}

export default EventStats;