// src/pages/EventsPage.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/api';
import { Link } from 'react-router-dom';
import { Listbox, Transition } from '@headlessui/react'; // For dropdowns
import { CheckIcon, ChevronUpDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { format } from 'date-fns'; // For formatting dates

// Define Event type matching backend response (adjust as needed)
interface OrganizerInfo {
    orgName?: string | null; // From OrganizerProfile
}

interface Organizer {
    id: number;
    firstName: string | null;
    lastName: string | null;
    organizerInfo?: OrganizerInfo | null; // Make optional based on include
}
interface Event {
    id: number;
    title: string;
    description: string;
    date: string; // ISO Date string
    location: string;
    category?: string | null;
    ageGroup?: string | null;
    organizer: Organizer;
}

// --- Mock Filter Options (replace with dynamic data if needed) ---
const categories = ["All", "Sports", "Arts & Crafts", "Music", "Education", " Outdoors"];
const ageGroups = ["All", "Toddlers (1-3)", "Preschool (3-5)", "Kids (6-9)", "Tweens (10-12)", "Teens (13+)"];
// --- ---

const EventsPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [selectedAgeGroup, setSelectedAgeGroup] = useState(ageGroups[0]);
    const [searchTerm, setSearchTerm] = useState('');

    // Function to fetch events based on filters
    const fetchEvents = async ({ queryKey }: any) => {
        const [_key, { category, ageGroup, search }] = queryKey;
        const params = new URLSearchParams();
        if (category && category !== 'All') params.append('category', category);
        if (ageGroup && ageGroup !== 'All') params.append('ageGroup', ageGroup);
        if (search) params.append('searchTerm', search);
        // Add startDate filter later if needed: params.append('startDate', new Date().toISOString());

        const { data } = await apiClient.get('/events', { params });
        return data as Event[]; // Assert the type
    };

    // React Query hook
    const { data: events, error, isLoading, isFetching } = useQuery<Event[], Error>({ // Specify types
        queryKey: ['events', { category: selectedCategory, ageGroup: selectedAgeGroup, search: searchTerm }], // Query key includes filters
        queryFn: fetchEvents,
        staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    });

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Optional: Add debounce later if performance is an issue
        setSearchTerm(event.target.value);
    };


    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>

            {/* Filter Section */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-100 rounded-lg">
                {/* Search Input */}
                 <div className='relative'>
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                           <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            type="text"
                            name="search"
                            id="search"
                            className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm input" // Reuse input class
                            placeholder="Keywords (title, desc, location)"
                            value={searchTerm}
                            onChange={handleSearchChange}
                         />
                    </div>
                 </div>
                {/* Category Filter */}
                <Listbox value={selectedCategory} onChange={setSelectedCategory}>
                    <div className="relative">
                         <Listbox.Label className="block text-sm font-medium text-gray-700 mb-1">Category</Listbox.Label>
                        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm input">
                            <span className="block truncate">{selectedCategory}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </span>
                        </Listbox.Button>
                        <Transition as={React.Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                                {categories.map((category, index) => (
                                    <Listbox.Option
                                        key={index}
                                        className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'}`}
                                        value={category}
                                    >
                                        {({ selected }) => (
                                            <>
                                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{category}</span>
                                                {selected ? (
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </Listbox>

                 {/* Age Group Filter (Similar Listbox structure) */}
                <Listbox value={selectedAgeGroup} onChange={setSelectedAgeGroup}>
                    <div className="relative">
                        <Listbox.Label className="block text-sm font-medium text-gray-700 mb-1">Age Group</Listbox.Label>
                        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm input">
                            <span className="block truncate">{selectedAgeGroup}</span>
                             <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                             </span>
                        </Listbox.Button>
                         {/* ... Transition and Listbox.Options similar to Category ... */}
                         <Transition as={React.Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                                {ageGroups.map((age, index) => (
                                    <Listbox.Option
                                        key={index}
                                        className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'}`}
                                        value={age}
                                    >
                                        {({ selected }) => (
                                            <>
                                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{age}</span>
                                                {selected ? (
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                             </Listbox.Options>
                        </Transition>
                    </div>
                </Listbox>
            </div>
            {/* End Filter Section */}

            {/* Loading State */}
            {(isLoading || isFetching) && ( // Show loading indicator on initial load and subsequent fetches
                 <div className="text-center p-10">
                    <p>Loading events...</p>
                    {/* Add a spinner component here later */}
                 </div>
            )}

            {/* Error State */}
            {error && (
                <div className="text-center p-10 bg-red-100 text-red-700 rounded">
                    <p>Error fetching events: {error.message}</p>
                </div>
            )}

            {/* Event List */}
            {!isLoading && !error && events && (
                 events.length === 0 ? (
                     <div className="text-center p-10 text-gray-500">
                        <p>No events found matching your criteria.</p>
                    </div>
                 ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105">
                                {/* Add Image Placeholder Later */}
                                {/* <img src="https://via.placeholder.com/400x250" alt={event.title} className="w-full h-48 object-cover" /> */}
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold mb-2 truncate">{event.title}</h2>
                                    <p className="text-gray-500 text-sm mb-1">
                                        {/* Format date using date-fns */}
                                        {format(new Date(event.date), 'eee, MMM d, yyyy \'at\' h:mm a')}
                                    </p>
                                    <p className="text-gray-500 text-sm mb-2">{event.location}</p>
                                    <p className="text-gray-700 text-sm mb-3 line-clamp-3">{event.description}</p> {/* Limit description lines */}
                                    <div className='flex items-center justify-between text-xs text-gray-500 mb-3'>
                                         <span>By: {event.organizer.organizerInfo?.orgName || `${event.organizer.firstName} ${event.organizer.lastName}`}</span>
                                         <div className='flex space-x-2'>
                                            {event.category && <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{event.category}</span>}
                                            {event.ageGroup && <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full">{event.ageGroup}</span>}
                                        </div>
                                    </div>

                                    <Link
                                        to={`/events/${event.id}`}
                                        className="inline-block text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                                    >
                                        View Details &rarr;
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                 )
            )}
        </div>
    );
};

export default EventsPage;