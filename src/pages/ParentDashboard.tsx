// src/pages/ParentDashboard.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';
import { format } from 'date-fns';
// --- Import EventCard ---
import EventCard from '../components/EventCard'; // Adjust path if needed
// Assuming you have types defined centrally, adjust path if needed
import { Registration, BaseEvent } from '../types/entities';
import { TicketIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// Define the expected structure of the API response item
// *** ASSUMPTION: Backend now includes more event details ***
interface MyRegistration extends Registration {
    event: Pick<BaseEvent, 'id' | 'title' | 'date' | 'location' | 'description' | 'category' | 'ageGroup' > & {
        // Add other optional fields expected by EventCard if returned by backend
        price?: number | null;
        imageUrl?: string | null;
        timeInfo?: string | null;
    };
}

const ParentDashboard: React.FC = () => {

    // Fetch the user's registrations
    const { data: registrations, error, isLoading } = useQuery<MyRegistration[], Error>({
        queryKey: ['myRegistrations'],
        queryFn: async () => {
            const { data } = await apiClient.get('/events/registrations/my');
            // Assume data matches MyRegistration[] structure now
            return data;
        },
        staleTime: 1000 * 60 * 5,
    });

    return (
        // Use a slightly wider max-width if displaying cards
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                My Registered Events
            </h1>

            {/* Loading State (remains the same) */}
            {isLoading && (
                 <div className="text-center p-10"> <p className="text-gray-500">Loading your registrations...</p> </div>
            )}

            {/* Error State (remains the same) */}
            {error && (
                <div className="text-center p-10 bg-red-100 text-red-700 rounded-lg shadow">
                     <ExclamationTriangleIcon className="h-12 w-12 mx-auto text-red-500 mb-4" />
                    <p className="font-semibold">Could not load registrations.</p>
                    <p className="text-sm">{error.message}</p>
                </div>
            )}

            {/* Success State - UPDATED */}
            {!isLoading && !error && registrations && (
                registrations.length === 0 ? (
                    // No Registrations Found message (remains the same)
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
                    // Display Event Cards instead of list items
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                         {registrations.map((reg) => (
                            // Pass the nested event object to the EventCard
                            // Ensure reg.event contains all fields EventCard needs
                             <EventCard key={reg.id} event={reg.event} />
                         ))}
                    </div>
                )
            )}
        </div>
    );
};

export default ParentDashboard;
