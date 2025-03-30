// src/pages/HomePage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Import React Query hook
import { useQuery } from '@tanstack/react-query';
// Import API client
import apiClient from '../services/api';
// Import necessary icons
import {
    MagnifyingGlassIcon,
    CalendarDaysIcon,
    SparklesIcon,
    PlusCircleIcon,
    UsersIcon,
    CogIcon,
    QuestionMarkCircleIcon,
    ArrowRightIcon, // Needed for View All link
    ExclamationTriangleIcon // For error state
} from '@heroicons/react/24/outline';
// --- Import the reusable EventCard component ---
import EventCard from '../components/EventCard'; // Adjust path if needed
// --- Import type for fetched events ---
import { EventListItem } from '../types/entities'; // Use the appropriate type

// --- Component ---

const HomePage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
        } else {
             navigate('/events');
        }
    };

    // --- Fetch Upcoming/Featured Events ---
    const fetchUpcomingEvents = async () => {
        // Adjust endpoint and params as needed for your backend
        // Fetching 4 upcoming events as an example
        const { data } = await apiClient.get('/events', {
            params: {
                limit: 4,
                // You might need other params like sort=date:asc or upcoming=true
                // depending on your API design
            }
        });
        // Assume API returns data matching EventListItem structure
        return data as EventListItem[];
    };

    const {
        data: upcomingEvents,
        isLoading: isLoadingEvents,
        error: eventsError
    } = useQuery<EventListItem[], Error>({
        queryKey: ['upcomingEvents'], // Unique key for this query
        queryFn: fetchUpcomingEvents,
        staleTime: 1000 * 60 * 15, // Cache for 15 minutes
    });


    // Note: Add 'Be Vietnam Pro' font family to your tailwind.config.js if desired

    return (
        <div className="bg-gray-50 min-h-screen">
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">

                {/* 1. Hero Section (remains the same) */}
                <section className="mb-12 md:mb-16">
                    <div className="relative h-[480px] w-full rounded-lg overflow-hidden">
                        <img
                            src="https://placehold.co/928x480/617AFA/FFFFFF?text=KidVenture+Hero"
                            alt="Find fun activities for kids"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 opacity-70"></div>
                        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-4">
                             <h1 className="text-white text-4xl md:text-5xl font-black leading-tight drop-shadow-md mb-8">
                                Find fun and educational activities for your kids
                            </h1>
                            <form onSubmit={handleSearch} className="w-full max-w-lg flex bg-white rounded-full border border-gray-300 overflow-hidden shadow-md">
                                <div className="pl-4 pr-2 flex items-center">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search events, activities, and more"
                                    className="flex-grow border-none focus:ring-0 focus:outline-none px-2 py-3 text-gray-700 placeholder-gray-500 text-base"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="px-5 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition duration-150 ease-in-out text-base cursor-pointer"
                                >
                                    Search
                                </button>
                            </form>
                        </div>
                    </div>
                </section>

                {/* 2. Upcoming Events Section - UPDATED to use fetched data */}
                <section className="mb-12 md:mb-16">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-gray-900 text-2xl font-bold leading-7">
                            Upcoming Events
                        </h2>
                         <Link to="/events" className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center text-sm">
                            View All Events <ArrowRightIcon className="h-4 w-4 ml-1" />
                        </Link>
                    </div>

                    {/* Loading State */}
                    {isLoadingEvents && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Placeholder Skeletons */}
                            {[...Array(4)].map((_, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-md h-[420px] animate-pulse">
                                    <div className="h-40 bg-gray-200 rounded-t-lg"></div>
                                    <div className="p-4 space-y-3">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Error State */}
                    {eventsError && (
                        <div className="text-center p-6 bg-red-50 text-red-700 rounded-lg border border-red-200">
                            <ExclamationTriangleIcon className="h-6 w-6 mx-auto text-red-400 mb-2"/>
                            <p>Could not load upcoming events.</p>
                            <p className="text-xs mt-1">{eventsError.message}</p>
                        </div>
                    )}

                    {/* Success State - Render Event Cards */}
                    {!isLoadingEvents && !eventsError && upcomingEvents && (
                         upcomingEvents.length === 0 ? (
                             <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                                <p className="text-gray-500">No upcoming events found right now. Check back soon!</p>
                            </div>
                         ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Use the EventCard component with fetched data */}
                                {upcomingEvents.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </div>
                         )
                    )}

                     {/* See More Button (Optional - could be removed if only showing limited featured items) */}
                     {!isLoadingEvents && !eventsError && upcomingEvents && upcomingEvents.length > 0 && (
                        <div className="mt-8 flex justify-center">
                            <Link
                                to="/events"
                                className="inline-flex items-center justify-center px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-bold rounded-full transition duration-150 ease-in-out shadow-sm hover:shadow-md"
                            >
                                See more events
                            </Link>
                        </div>
                     )}
                </section>

                 {/* 3. For Organizers Section (remains the same) */}
                <section>
                   <h2 className="text-gray-900 text-2xl font-bold leading-7 mb-5">
                        For Organizers
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {/* Cards ... */}
                        <div className="bg-white p-4 rounded-lg border border-gray-300 flex flex-col gap-3 transition-shadow duration-300 hover:shadow-md">
                            <PlusCircleIcon className="h-6 w-6 text-gray-800"/>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-gray-900 text-base font-bold leading-5">Create Event</h3>
                                <p className="text-gray-600 text-sm leading-5">Host an event for kids</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-300 flex flex-col gap-3 transition-shadow duration-300 hover:shadow-md">
                            <UsersIcon className="h-6 w-6 text-gray-800"/>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-gray-900 text-base font-bold leading-5">Manage Participants</h3>
                                <p className="text-gray-600 text-sm leading-5">View and manage participants</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-300 flex flex-col gap-3 transition-shadow duration-300 hover:shadow-md">
                            <CogIcon className="h-6 w-6 text-gray-800"/>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-gray-900 text-base font-bold leading-5">Manage Events</h3>
                                <p className="text-gray-600 text-sm leading-5">View and manage events</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-300 flex flex-col gap-3 transition-shadow duration-300 hover:shadow-md">
                            <QuestionMarkCircleIcon className="h-6 w-6 text-gray-800"/>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-gray-900 text-base font-bold leading-5">Explore More</h3>
                                <p className="text-gray-600 text-sm leading-5">Browse more organizer tools</p>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
};

export default HomePage;
