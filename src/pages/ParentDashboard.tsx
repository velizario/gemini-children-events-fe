// src/pages/ParentDashboard.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';
import { format } from 'date-fns';
// Assuming you have types defined centrally, adjust path if needed
import { Registration, BaseEvent } from '../types/entities';
import { CalendarDaysIcon, MapPinIcon, TicketIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// Define the expected structure of the API response item
interface MyRegistration extends Registration {
    event: Pick<BaseEvent, 'id' | 'title' | 'date' | 'location'>; // Expect nested event details
}

const ParentDashboard: React.FC = () => {

    // Fetch the user's registrations
    const { data: registrations, error, isLoading } = useQuery<MyRegistration[], Error>({
        queryKey: ['myRegistrations'], // Unique query key
        queryFn: async () => {
            // Replace with your actual backend endpoint
            const { data } = await apiClient.get('/events/my-registrations');
            return data;
        },
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });

    return (
        <div className="max-w-4xl mx-auto"> {/* Constrain width */}
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                My Registered Events
            </h1>

            {/* Loading State */}
            {isLoading && (
                 <div className="text-center p-10">
                    <p className="text-gray-500">Loading your registrations...</p>
                    {/* Add a spinner component here later */}
                 </div>
            )}

            {/* Error State */}
            {error && (
                <div className="text-center p-10 bg-red-100 text-red-700 rounded-lg shadow">
                     <ExclamationTriangleIcon className="h-12 w-12 mx-auto text-red-500 mb-4" />
                    <p className="font-semibold">Could not load registrations.</p>
                    <p className="text-sm">{error.message}</p>
                </div>
            )}

            {/* Success State - Display Registrations */}
            {!isLoading && !error && registrations && (
                registrations.length === 0 ? (
                    // No Registrations Found
                     <div className="text-center p-10 bg-white rounded-lg shadow border border-gray-200">
                        <TicketIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500 mb-4">You haven't registered for any events yet.</p>
                        <Link
                            to="/events"
                            className="inline-flex items-center justify-center px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-md transition duration-150 ease-in-out shadow-sm hover:shadow-md"
                        >
                            Browse Events
                        </Link>
                    </div>
                ) : (
                    // List of Registrations
                    <div className="space-y-4">
                        {registrations.map((reg) => (
                            <div key={reg.id} className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-lg transition-shadow duration-200">
                                <div className="flex-grow">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-indigo-600">
                                        {reg.event.title}
                                    </h2>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <p className="flex items-center gap-2">
                                            <CalendarDaysIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                            <span>{format(new Date(reg.event.date), 'eee, MMM d, yyyy \'at\' h:mm a')}</span>
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <MapPinIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                            <span className="truncate">{reg.event.location}</span>
                                        </p>
                                        {/* Optional: Display registration date */}
                                        {/* <p className="text-xs text-gray-400 pt-1">Registered on: {format(new Date(reg.registeredAt), 'MMM d, yyyy')}</p> */}
                                    </div>
                                </div>
                                <div className="flex-shrink-0 mt-3 sm:mt-0">
                                    <Link
                                        to={`/events/${reg.event.id}`}
                                        className="inline-flex items-center justify-center px-4 py-1.5 border border-indigo-300 text-sm font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                                    >
                                        View Event
                                    </Link>
                                    {/* Optional: Add an "Unregister" button later */}
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
};

export default ParentDashboard;
