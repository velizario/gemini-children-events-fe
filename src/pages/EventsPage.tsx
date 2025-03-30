// src/pages/EventsPage.tsx
import React, { useState, useEffect } from 'react'; // Import useEffect
import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/api';
// Import useSearchParams to read URL query parameters
import { Link, useSearchParams } from 'react-router-dom';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import EventCard from '../components/EventCard'; // Adjust path if needed
import { EventListItem } from '../types/entities'; // Use the appropriate type

// Mock Filter Options (keep as is or fetch dynamically)
const categories = ["All", "Sports", "Arts & Crafts", "Music", "Education", " Outdoors"];
const ageGroups = ["All", "Toddlers (1-3)", "Preschool (3-5)", "Kids (6-9)", "Tweens (10-12)", "Teens (13+)"];

const EventsPage: React.FC = () => {
    // --- FIX: Read initial search term from URL ---
    const [searchParams] = useSearchParams();
    const initialSearchTerm = searchParams.get('search') || '';
    // --- END FIX ---

    // Initialize state with URL values or defaults
    const [selectedCategory, setSelectedCategory] = useState(categories[0]); // Default to "All"
    const [selectedAgeGroup, setSelectedAgeGroup] = useState(ageGroups[0]); // Default to "All"
    // Initialize searchTerm state with value from URL
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

    // --- FIX: Optional - Update state if URL changes externally (e.g., browser back/forward) ---
    // This ensures the local search input reflects the URL parameter if it changes
    // after the initial load. You might not need this depending on desired UX.
    useEffect(() => {
        setSearchTerm(searchParams.get('search') || '');
    }, [searchParams]);
    // --- END FIX ---


    // Function to fetch events based on filters from queryKey
    const fetchEvents = async ({ queryKey }: any) => {
        // Destructure filters from the query key
        const [_key, { category, ageGroup, search }] = queryKey;
        const params = new URLSearchParams();
        // Append parameters only if they have a value and are not 'All'
        if (category && category !== 'All') params.append('category', category);
        if (ageGroup && ageGroup !== 'All') params.append('ageGroup', ageGroup);
        if (search) params.append('searchTerm', search); // Use 'searchTerm' to match backend DTO

        const { data } = await apiClient.get('/events', { params });
        return data as EventListItem[];
    };

    // React Query hook - Query key now includes state variables which are initialized from URL params
    const { data: events, error, isLoading, isFetching } = useQuery<EventListItem[], Error>({
        // The query key correctly uses the state variables
        queryKey: ['events', { category: selectedCategory, ageGroup: selectedAgeGroup, search: searchTerm }],
        queryFn: fetchEvents,
        staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    });

    // Handler for the local search input changes
    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        // Note: This only updates the state. The query refetches because
        // searchTerm is in its queryKey. It doesn't update the URL bar itself.
        // To update the URL bar as the user types, you'd need to use `setSearchParams`.
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
                            className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm input"
                            placeholder="Keywords..."
                            value={searchTerm} // Value bound to state
                            onChange={handleSearchInputChange} // Updates state, triggering query refetch
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
                 {/* Age Group Filter */}
                <Listbox value={selectedAgeGroup} onChange={setSelectedAgeGroup}>
                    <div className="relative">
                        <Listbox.Label className="block text-sm font-medium text-gray-700 mb-1">Age Group</Listbox.Label>
                        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm input">
                            <span className="block truncate">{selectedAgeGroup}</span>
                             <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                             </span>
                        </Listbox.Button>
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

            {/* Loading and Error States */}
            {(isLoading || isFetching) && (
                 <div className="text-center p-10"> <p>Loading events...</p> </div>
            )}
            {error && (
                <div className="text-center p-10 bg-red-100 text-red-700 rounded"> <p>Error fetching events: {error.message}</p> </div>
            )}

            {/* Event List */}
            {!isLoading && !error && events && (
                 events.length === 0 ? (
                     <div className="text-center p-10 text-gray-500"> <p>No events found matching your criteria.</p> </div>
                 ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                 )
            )}
        </div>
    );
};

export default EventsPage;

