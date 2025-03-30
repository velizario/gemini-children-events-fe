// src/pages/OrganizerDashboard.tsx
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/api';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { PencilIcon, TrashIcon, UsersIcon, PlusIcon } from '@heroicons/react/24/outline';

// Define type for organizer's events (might include registration count)
interface MyEvent {
    id: number;
    title: string;
    date: string;
    location: string;
    createdAt: string;
    _count?: { // Optional count from Prisma include
        registrations?: number;
    };
}

const OrganizerDashboard: React.FC = () => {
    const queryClient = useQueryClient();

    // Fetch events created by the current organizer
    const { data: myEvents, error, isLoading } = useQuery<MyEvent[], Error>({
        queryKey: ['myEvents'], // Query key for organizer-specific events
        queryFn: async () => {
            const { data } = await apiClient.get('/events/my-events');
            return data;
        },
         staleTime: 1000 * 60, // Cache for 1 minute
    });

     // Mutation for deleting an event
     const deleteMutation = useMutation<any, Error, number>({ // API returns success message or error
        mutationFn: (eventId) => apiClient.delete(`/events/${eventId}`),
        onSuccess: (data, eventId) => {
            console.log(data.message);
            alert(data.message || 'Event deleted successfully!');
            // Invalidate 'myEvents' query to refresh the list
            queryClient.invalidateQueries({ queryKey: ['myEvents'] });
            // Also invalidate the general 'events' query if it might be stale
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
        onError: (error: any) => {
             console.error('Deletion failed:', error);
             alert(`Deletion failed: ${error.response?.data?.message || error.message}`);
        },
    });


    const handleDelete = (eventId: number, eventTitle: string) => {
         if (window.confirm(`Are you sure you want to delete the event "${eventTitle}"? This action cannot be undone.`)) {
            deleteMutation.mutate(eventId);
         }
    };


    if (isLoading) return <div className='text-center p-10'>Loading your events...</div>;
    if (error) return <div className='text-center p-10 bg-red-100 text-red-700 rounded'>Error loading dashboard: {error.message}</div>;

    return (
        <div>
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">My Events Dashboard</h1>
                 <Link to="/create-event" className="btn btn-primary inline-flex items-center">
                     <PlusIcon className="h-5 w-5 mr-2" />
                     Create New Event
                 </Link>
            </div>

            {myEvents && myEvents.length === 0 && !isLoading && (
                <div className="text-center p-10 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">You haven't created any events yet.</p>
                     <Link to="/create-event" className="mt-4 btn btn-primary">
                         Create Your First Event
                     </Link>
                </div>
            )}

            {myEvents && myEvents.length > 0 && (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul role="list" className="divide-y divide-gray-200">
                        {myEvents.map((event) => (
                            <li key={event.id}>
                                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <Link to={`/events/${event.id}`} className="text-lg font-medium text-indigo-600 hover:text-indigo-800 truncate block">
                                            {event.title}
                                        </Link>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Date: {format(new Date(event.date), 'Pp')} {/* Short date and time */}
                                        </p>
                                         <p className="text-sm text-gray-500">Location: {event.location}</p>
                                         <p className="text-sm text-gray-500">
                                             Registrations: {event._count?.registrations ?? 0}
                                          </p>
                                    </div>
                                    <div className="flex items-center space-x-3 flex-shrink-0">
                                          {/* Add View Participants Link/Button Later */}
                                          <button
                                               title='View Participants'
                                               onClick={() => alert('View Participants functionality coming soon!')} // Placeholder
                                               className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full"
                                               >
                                               <UsersIcon className="h-5 w-5" />
                                           </button>
                                         <Link
                                               to={`/edit-event/${event.id}`} // Define this route/page later
                                               title='Edit Event'
                                               className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-100 rounded-full"
                                               >
                                               <PencilIcon className="h-5 w-5" />
                                          </Link>
                                          <button
                                              onClick={() => handleDelete(event.id, event.title)}
                                              disabled={deleteMutation.isPending && deleteMutation.variables === event.id}
                                              title='Delete Event'
                                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full disabled:opacity-50"
                                          >
                                               <TrashIcon className="h-5 w-5" />
                                           </button>

                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default OrganizerDashboard;