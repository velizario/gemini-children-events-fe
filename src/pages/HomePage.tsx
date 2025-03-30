// src/pages/HomePage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Using Heroicons - update imports for card details
import {
    MagnifyingGlassIcon,
    CalendarDaysIcon,
    MapPinIcon,       // For Location
    UserGroupIcon,    // For Age Group
    CurrencyDollarIcon, // For Price
    SparklesIcon,
    PlusCircleIcon,
    UsersIcon,
    CogIcon,
    QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

// --- Mock Data (Updated with description, ensured ageGroup) ---
const mockUpcomingEvents = [
     {
        id: 101,
        title: "Family Fun Night",
        description: "Unleash creativity with painting, drawing, and crafts for the whole family.", // Added description
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        location: "Community Art Center",
        price: "$20 per family",
        category: "Arts & Crafts",
        ageGroup: "6-9 years", // Added 'years'
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        organizer: { id: 2, firstName: "Alice", lastName: "Artisan", organizerInfo: { orgName: "Creative Kids Hub" } },
        imageUrl: "https://placehold.co/300x160/fecaca/991b1b?text=Art+Night" // Adjusted size slightly
    },
    {
        id: 102,
        title: "Kids Coding Class",
        description: "A fun introduction to programming concepts through engaging games and activities.", // Added description
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        location: "Tech Hub Library",
        price: "$25 per child",
        category: "Education",
        ageGroup: "8-12 years", // Added 'years'
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        organizer: { id: 3, firstName: "Bob", lastName: "Binary", organizerInfo: { orgName: "Code Wizards" } },
        imageUrl: "https://placehold.co/300x160/c7d2fe/4338ca?text=Coding"
    },
    {
        id: 103,
        title: "Outdoor Adventure Camp",
        description: "Explore local trails, learn about plants, enjoy nature games and crafts.", // Added description
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        timeInfo: "Mon-Fri, 9:00 AM",
        location: "Green Valley Park",
        price: "$150 per child",
        category: "Outdoors",
        ageGroup: "All Ages", // Kept as is
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        organizer: { id: 4, firstName: "Carol", lastName: "Canopy", organizerInfo: { orgName: "Park Rangers Assoc." } },
        imageUrl: "https://placehold.co/300x160/d1fae5/047857?text=Camp"
    },
     {
        id: 104,
        title: "Art Workshop",
        description: "Explore different art mediums like clay, watercolor, and collage.", // Added description
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
        location: "Studio 42",
        price: "$30 per child",
        category: "Arts & Crafts",
        ageGroup: "7+ years", // Added 'years'
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        organizer: { id: 2, firstName: "Alice", lastName: "Artisan", organizerInfo: { orgName: "Creative Kids Hub" } },
        imageUrl: "https://placehold.co/300x160/fef3c7/b45309?text=Art+Workshop"
    },
];

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

    // Note: Add 'Be Vietnam Pro' font family to your tailwind.config.js
    // e.g., theme: { extend: { fontFamily: { sans: ['Be Vietnam Pro', 'system-ui', ...] } } }

    return (
        <div className="bg-gray-50 min-h-screen">
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">

                {/* 1. Hero Section */}
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

                {/* 2. Upcoming Events Section */}
                <section className="mb-12 md:mb-16">
                    <h2 className="text-gray-900 text-2xl font-bold leading-7 mb-5">
                        Upcoming Events
                    </h2>
                    {/* Grid for event cards - adjusted gap */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> {/* Increased gap for larger cards */}
                        {mockUpcomingEvents.map((event) => (
                            // Outer Link container
                             <Link key={event.id} to={`/events/${event.id}`} className="group">
                                {/* Card Structure using Divs - Mimicking example */}
                                <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[420px] transition-shadow duration-300 hover:shadow-xl"> {/* Approx height */}

                                    {/* Image Container */}
                                    <div className="relative h-40 overflow-hidden">
                                        <img
                                            src={event.imageUrl || `https://placehold.co/300x160`}
                                            alt={event.title}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        {/* Category Badge */}
                                        {event.category && (
                                            <span className="absolute top-2 right-2 inline-flex items-center rounded-full bg-white/80 backdrop-blur-sm px-2.5 py-0.5 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-500/10">
                                                {event.category}
                                            </span>
                                        )}
                                    </div>

                                    {/* Header Area (Title, Description) */}
                                    <div className="p-4 pb-2">
                                        <h3 className="text-lg font-bold leading-tight text-gray-900 line-clamp-1 group-hover:text-indigo-600">
                                            {event.title}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                                            {event.description}
                                        </p>
                                    </div>

                                    {/* Content Area (Details) */}
                                    <div className="p-4 pt-2 flex-grow">
                                        <dl className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <dt className="sr-only">Date</dt>
                                                <dd className="flex items-center gap-2 text-gray-600">
                                                    <CalendarDaysIcon className="h-4 w-4 text-gray-400" />
                                                    <span>{format(new Date(event.date), 'eee, MMM d')}{event.timeInfo ? `, ${event.timeInfo}` : ''}</span>
                                                </dd>
                                            </div>
                                             <div className="flex items-center gap-2">
                                                <dt className="sr-only">Location</dt>
                                                <dd className="flex items-center gap-2 text-gray-600">
                                                    <MapPinIcon className="h-4 w-4 text-gray-400" />
                                                    <span className="truncate">{event.location}</span>
                                                </dd>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                 <dt className="sr-only">Age Group</dt>
                                                 <dd className="flex items-center gap-2 text-gray-600">
                                                    <UserGroupIcon className="h-4 w-4 text-gray-400" />
                                                    <span>{event.ageGroup}</span>
                                                </dd>
                                            </div>
                                             <div className="flex items-center gap-2">
                                                 <dt className="sr-only">Price</dt>
                                                 <dd className="flex items-center gap-2 text-gray-600">
                                                    <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                                                    <span>{event.price}</span>
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>

                                    {/* Footer Area (Visual Cue) */}
                                    <div className="p-4 pt-0 mt-auto">
                                        <div className="text-right text-sm font-medium text-indigo-600 group-hover:text-indigo-800">
                                            View Details &rarr;
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                     {/* See More Button */}
                     <div className="mt-8 flex justify-center"> {/* Centered button */}
                        <Link
                            to="/events"
                            className="inline-flex items-center justify-center px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-bold rounded-full transition duration-150 ease-in-out shadow-sm hover:shadow-md"
                        >
                            See more events
                        </Link>
                    </div>
                </section>

                 {/* 3. For Organizers Section */}
                <section>
                    <h2 className="text-gray-900 text-2xl font-bold leading-7 mb-5">
                        For Organizers
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {/* Cards remain the same */}
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
