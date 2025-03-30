// src/pages/EventDetailsPage.tsx
import React from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'; // Import Link and useLocation
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/api';
import { useIsAuthenticated, useCurrentUser, useUserRole } from '../stores/authStore';
import { format } from 'date-fns';
import { MapPinIcon, CalendarDaysIcon, UserGroupIcon, TagIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
// --- Import the refined types ---
import { EventDetails, RegistrationResponse } from '../types/entities'; // Adjust path if needed

const EventDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const eventId = Number(id);
    const navigate = useNavigate();
    const location = useLocation(); // Get current location for login redirect state
    const queryClient = useQueryClient();

    const isAuthenticated = useIsAuthenticated();
    const userRole = useUserRole();

    // Fetch event details - Use the imported EventDetails type
    const { data: event, error, isLoading } = useQuery<EventDetails, Error>({
        queryKey: ['event', eventId],
        queryFn: async () => {
            if (!eventId) throw new Error("Event ID is missing");
            // Ensure API returns data matching the EventDetails type
            const { data } = await apiClient.get(`/events/${eventId}`);
            return data;
        },
        enabled: !!eventId,
        staleTime: 1000 * 60 * 10,
    });

     // Mutation for event registration - Use imported RegistrationResponse type
     const registrationMutation = useMutation<RegistrationResponse, Error, void>({
        mutationFn: () => apiClient.post(`/events/${eventId}/register`).then(res => res.data),
        onSuccess: (data) => {
            console.log('Registration successful', data);
            alert(`Successfully registered for ${data.event.title}!`);
            // Consider more sophisticated feedback than alert later
            queryClient.invalidateQueries({ queryKey: ['event', eventId] }); // Optional: refetch event if status changes
        },
        onError: (error: any) => {
             console.error('Registration failed:', error);
             alert(`Registration failed: ${error.response?.data?.message || error.message}`);
        },
    });


    const handleRegister = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: location } });
            return;
        }
         if (userRole === 'PARENT') {
             registrationMutation.mutate();
         } else {
             alert('Only parents can register for events.');
         }
    };

    // --- Render Logic ---

    if (isLoading) return <div className='text-center p-10'>Loading event details...</div>;
    // Improve error display
    if (error) return <div className='text-center p-10 bg-red-100 text-red-700 rounded'>Error loading event: {error.message}</div>;
    if (!event) return <div className='text-center p-10'>Event not found.</div>;

    const canRegister = isAuthenticated && userRole === 'PARENT';
    const isRegistering = registrationMutation.isPending;

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
            {/* Optional Header Image */}
            {/* <img src="https://via.placeholder.com/800x300" alt={event.title} className="w-full h-64 object-cover"/> */}

            <div className="p-6 md:p-8">
                 <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600 mb-6 border-b pb-4">
                    {/* Date */}
                    <div className="flex items-center">
                         <CalendarDaysIcon className="h-5 w-5 mr-2 text-indigo-500" />
                         {/* Use try-catch or check validity if date string might be invalid */}
                         <span>{format(new Date(event.date), 'PPPPp')}</span>
                    </div>
                    {/* Location */}
                     <div className="flex items-center">
                         <MapPinIcon className="h-5 w-5 mr-2 text-indigo-500" />
                         <span>{event.location}</span>
                     </div>
                     {/* Category (Conditionally Render) */}
                    {event.category && ( // <--- Check if category exists
                         <div className="flex items-center">
                             <TagIcon className="h-5 w-5 mr-2 text-indigo-500" />
                             <span>{event.category}</span>
                         </div>
                     )}
                     {/* Age Group (Conditionally Render) */}
                      {event.ageGroup && ( // <--- Check if ageGroup exists
                         <div className="flex items-center">
                             <UserGroupIcon className="h-5 w-5 mr-2 text-indigo-500" />
                             <span>{event.ageGroup}</span>
                         </div>
                     )}
                </div>

                <div className="prose max-w-none mb-6">
                    <h2 className='text-xl font-semibold mb-2'>Description</h2>
                     <p>{event.description}</p>
                </div>

                 {/* Organizer Info - Safely access optional fields */}
                <div className='bg-gray-50 p-4 rounded-lg mb-6'>
                    <h3 className='text-lg font-semibold mb-2'>Organized by</h3>
                    <p className='font-medium text-gray-800'>
                        {/* Use optional chaining ?. and nullish coalescing ?? */}
                        {event.organizer?.organizerInfo?.orgName ?? `${event.organizer?.firstName ?? ''} ${event.organizer?.lastName ?? ''}`}
                    </p>
                    {event.organizer?.organizerInfo?.description && ( // <--- Check existence before rendering
                        <p className='text-sm text-gray-600 mt-1'>{event.organizer.organizerInfo.description}</p>
                    )}
                     {event.organizer?.email && ( // <--- Check existence
                         <p className='text-sm text-gray-600 mt-1'>Contact: {event.organizer.email}</p>
                     )}
                      {/* Add website, phone etc. similarly */}
                       {event.organizer?.organizerInfo?.website && (
                          <p className='text-sm text-gray-600 mt-1'>Website: <a href={event.organizer.organizerInfo.website} target="_blank" rel="noopener noreferrer" className='text-indigo-600 hover:underline'>{event.organizer.organizerInfo.website}</a></p>
                       )}
                </div>

                <div className="mt-8 text-center">
                    {canRegister ? (
                         <button
                            onClick={handleRegister}
                            disabled={isRegistering}
                            className="btn btn-primary btn-lg px-8 py-3 disabled:opacity-60"
                         >
                            {isRegistering ? 'Registering...' : 'Register for this Event'}
                         </button>
                     ) : (
                         !isAuthenticated ? (
                             <p className="text-gray-600 bg-yellow-100 p-3 rounded-md inline-flex items-center">
                                 <InformationCircleIcon className='h-5 w-5 mr-2 text-yellow-700'/>
                                 <Link to="/login" state={{ from: location }} className="font-medium text-indigo-600 hover:text-indigo-500">Log in</Link>
                                 &nbsp;as a Parent to register.
                             </p>
                         ) : (
                            // Show message if logged in but not a parent
                            userRole !== 'PARENT' && (
                                 <p className="text-gray-600 bg-blue-100 p-3 rounded-md inline-flex items-center">
                                     <InformationCircleIcon className='h-5 w-5 mr-2 text-blue-700'/>
                                     Registration is available for Parent accounts.
                                 </p>
                            )
                         )
                    )}
                     {/* Display mutation feedback */}
                     {registrationMutation.isError && (
                         <p className="text-red-600 mt-2">Error: {registrationMutation.error instanceof Error ? registrationMutation.error.message : 'An unknown error occurred'}</p>
                     )}
                      {registrationMutation.isSuccess && (
                         <p className="text-green-600 mt-2 font-medium">Successfully registered!</p>
                      )}
                </div>
            </div>
        </div>
    );
};

export default EventDetailsPage;