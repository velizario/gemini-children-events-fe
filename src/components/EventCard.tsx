// src/components/EventCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
// Import necessary icons
import {
    CalendarDaysIcon,
    MapPinIcon,
    UserGroupIcon,
    CurrencyDollarIcon
} from '@heroicons/react/24/outline';
// Import a base type for the event prop - adjust path if needed
import { BaseEvent, BaseOrganizer } from '../types/entities';

// Define the props the EventCard component expects
// It needs fields commonly available in event lists/summaries
interface EventCardProps {
    // Use a subset of fields, maybe from BaseEvent or EventListItem
    event: {
        id: number;
        title: string;
        description?: string | null; // Make description optional for flexibility
        date: string; // ISO Date string
        location: string;
        price?: number | null; // Make price optional
        category?: string | null;
        ageGroup?: string | null;
        imageUrl?: string | null;
        timeInfo?: string | null; // Optional extra time info
        // Include basic organizer info if needed, but often omitted in cards
        // organizer?: Pick<BaseOrganizer, 'firstName' | 'lastName'> & { organizerInfo?: { orgName?: string | null } | null };
    };
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    // Fallback image if imageUrl is not provided
    const fallbackImageUrl = `https://placehold.co/300x160/${event.category === 'Arts & Crafts' ? 'fecaca/991b1b' : event.category === 'Education' ? 'c7d2fe/4338ca' : 'd1fae5/047857'}?text=${encodeURIComponent(event.category || 'Event')}`;

    return (
        // Outer Link container pointing to the event details page
        <Link to={`/events/${event.id}`} className="group block h-full"> {/* Ensure link takes full height */}
            {/* Card Structure using Divs */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full transition-shadow duration-300 hover:shadow-xl"> {/* Use h-full */}

                {/* Image Container */}
                <div className="relative h-40 overflow-hidden flex-shrink-0"> {/* Fixed height for image */}
                    <img
                        src={event.imageUrl || fallbackImageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        // Add error handling for broken images
                        onError={(e) => (e.currentTarget.src = fallbackImageUrl)}
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
                    {/* Conditionally render description if available */}
                    {event.description && (
                         <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {event.description}
                        </p>
                    )}
                </div>

                {/* Content Area (Details) */}
                <div className="p-4 pt-2 flex-grow"> {/* flex-grow allows this section to expand */}
                    <dl className="space-y-2 text-sm">
                        {/* Date */}
                        <div className="flex items-center gap-2">
                            <dt className="sr-only">Date</dt>
                            <dd className="flex items-center gap-2 text-gray-600">
                                <CalendarDaysIcon className="h-4 w-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
                                {/* Format date simply, include timeInfo if present */}
                                <span>{format(new Date(event.date), 'eee, MMM d')}{event.timeInfo ? `, ${event.timeInfo}` : ''}</span>
                            </dd>
                        </div>
                         {/* Location */}
                         <div className="flex items-center gap-2">
                            <dt className="sr-only">Location</dt>
                            <dd className="flex items-center gap-2 text-gray-600">
                                <MapPinIcon className="h-4 w-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
                                <span className="truncate">{event.location}</span>
                            </dd>
                        </div>
                        {/* Age Group (Conditional) */}
                        {event.ageGroup && (
                            <div className="flex items-center gap-2">
                                 <dt className="sr-only">Age Group</dt>
                                 <dd className="flex items-center gap-2 text-gray-600">
                                    <UserGroupIcon className="h-4 w-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
                                    <span>{event.ageGroup}</span>
                                </dd>
                            </div>
                        )}
                         {/* Price (Conditional) */}
                         {event.price && (
                             <div className="flex items-center gap-2">
                                 <dt className="sr-only">Price</dt>
                                 <dd className="flex items-center gap-2 text-gray-600">
                                    <CurrencyDollarIcon className="h-4 w-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
                                    <span>{event.price}</span>
                                </dd>
                            </div>
                         )}
                    </dl>
                </div>

                {/* Footer Area (Visual Cue) */}
                <div className="p-4 pt-0 mt-auto flex-shrink-0"> {/* Use mt-auto to push to bottom */}
                    <div className="text-right text-sm font-medium text-indigo-600 group-hover:text-indigo-800">
                        View Details &rarr;
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default EventCard;

