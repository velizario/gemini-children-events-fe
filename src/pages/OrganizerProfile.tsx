// src/pages/OrganizerProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; // If fetching data later
import apiClient from '../services/api'; // If fetching data later
import { format } from 'date-fns';
// Import Heroicons
import {
    EnvelopeIcon,
    PhoneIcon,
    GlobeAltIcon,
    MapPinIcon,
    CalendarDaysIcon,
    StarIcon as StarIconSolid, // Solid star for filled
    ArrowLeftIcon
} from '@heroicons/react/24/solid'; // Using solid for filled star
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline'; // Outline for empty star

// --- Mock Data (Replace with API data fetching later) ---
// NOTE: Adjust this structure based on your actual API response later
const mockOrganizerData = {
  id: "1",
  name: "Community Arts Center",
  description:
    "A non-profit organization dedicated to providing arts education and experiences for children and adults in our community.",
  longDescription: `<p>The Community Arts Center was founded in 1985 with a mission to make arts education accessible to all members of our community. We believe that creative expression is essential for personal growth and development, especially in children.</p>
    <p>Our programs are designed to:</p>
    <ul class="list-disc list-inside space-y-1 my-2">
      <li>Inspire creativity and self-expression</li>
      <li>Build confidence and social skills</li>
      <li>Develop problem-solving abilities</li>
      <li>Foster appreciation for diverse art forms</li>
      <li>Create a sense of community through shared artistic experiences</li>
    </ul>
    <p>Our instructors are professional artists and educators with extensive experience working with children of all ages and abilities. We maintain small class sizes to ensure personalized attention for each participant.</p>`,
  contactEmail: "info@communityartscenter.org",
  contactPhone: "(555) 123-4567",
  website: "www.communityartscenter.org",
  address: "123 Main St, Anytown, CA 12345",
  imageUrl:
    "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=300&q=80", // Adjusted size
  rating: 4.8,
  reviewCount: 156,
  yearEstablished: 1985,
};

const mockEventsData = [
  {
    id: "1",
    title: "Summer Art Camp",
    date: "July 15-19, 2023", // Keep simple date string for mock
    imageUrl: "https://images.unsplash.com/photo-1551966775-a4ddc8df052b?w=200&q=80",
    category: "Arts & Crafts",
    ageGroup: "7-12 years",
    status: "upcoming",
  },
  { id: "2", title: "Painting for Kids", date: "Every Saturday", imageUrl: "https://images.unsplash.com/photo-1560421683-6856ea585c78?w=200&q=80", category: "Arts & Crafts", ageGroup: "5-8 years", status: "upcoming" },
  { id: "3", title: "Teen Art Studio", date: "Wednesdays", imageUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=200&q=80", category: "Arts & Crafts", ageGroup: "13-17 years", status: "upcoming" },
  { id: "4", title: "Spring Break Art Camp", date: "March 15-19, 2023", imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=200&q=80", category: "Arts & Crafts", ageGroup: "7-12 years", status: "past" },
];

const mockReviewsData = [
  { id: "1", userName: "Sarah J.", rating: 5, date: "2023-05-15", comment: "My daughter absolutely loved the Summer Art Camp! The instructors were amazing...", eventTitle: "Summer Art Camp" },
  { id: "2", userName: "Michael W.", rating: 5, date: "2023-04-22", comment: "The Painting for Kids class has been wonderful for my son. He looks forward to it every week...", eventTitle: "Painting for Kids" },
  { id: "3", userName: "Jennifer D.", rating: 4, date: "2023-03-10", comment: "Great organization with passionate instructors. My only suggestion would be...", eventTitle: "Teen Art Studio" },
];
// --- End Mock Data ---

// Helper to render stars
const renderStars = (rating: number) => {
    const totalStars = 5;
    const filledStars = Math.round(rating); // Or floor/ceil depending on preference
    return (
        <div className="flex items-center">
            {[...Array(totalStars)].map((_, i) =>
                i < filledStars ? (
                    <StarIconSolid key={i} className="h-4 w-4 text-yellow-500" />
                ) : (
                    <StarIconOutline key={i} className="h-4 w-4 text-gray-300" />
                )
            )}
        </div>
    );
};


const OrganizerProfilePage: React.FC = () => {
    const { organizerId } = useParams<{ organizerId: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"about" | "events" | "reviews">("about");

    // TODO: Replace mock data with actual data fetching using useQuery
    // Example:
    // const { data: organizerData, isLoading, error } = useQuery({
    //     queryKey: ['organizerProfile', organizerId],
    //     queryFn: async () => {
    //         if (!organizerId) return null;
    //         const { data } = await apiClient.get(`/organizers/${organizerId}`); // Adjust endpoint
    //         return data;
    //     },
    //     enabled: !!organizerId,
    // });
    // // Fetch events and reviews separately or include in organizer fetch if API supports it

    // Using mock data for now
    const isLoading = false; // Simulate loading finished
    const error = null; // Simulate no error
    const organizer = mockOrganizerData; // Use mock data
    const upcomingEvents = mockEventsData.filter(e => e.status === 'upcoming');
    const pastEvents = mockEventsData.filter(e => e.status === 'past');
    const reviews = mockReviewsData;

    if (isLoading) {
        return <div className="text-center p-10">Loading organizer profile...</div>;
    }

    if (error || !organizer) {
        return <div className="text-center p-10 bg-red-100 text-red-700 rounded">Error loading profile or organizer not found.</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-16"> {/* Match HomePage bg */}

            {/* Organizer Header */}
            <div className="relative h-[200px] md:h-[250px] w-full overflow-hidden bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 mb-4"> {/* Lighter gradient */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-start w-full">
                        {/* Organizer Image */}
                        <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border-4 border-white shadow-md bg-white -mt-8 md:-mt-10 z-10">
                            <img
                                src={organizer.imageUrl || 'https://placehold.co/128x128/E0E0E0/757575?text=Logo'}
                                alt={`${organizer.name} logo`}
                                className="w-full h-full object-cover"
                                onError={(e) => (e.currentTarget.src = 'https://placehold.co/128x128/E0E0E0/757575?text=Logo')}
                            />
                        </div>
                        {/* Organizer Info */}
                        <div className="mt-2 md:mt-0 text-center md:text-left">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                {organizer.name}
                            </h1>
                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-3 gap-y-1 mt-1 md:mt-2 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <StarIconSolid className="h-4 w-4 text-yellow-400" />
                                    <span className="ml-1 font-medium text-gray-700">
                                        {organizer.rating.toFixed(1)}
                                    </span>
                                    <span className="ml-1">({organizer.reviewCount} reviews)</span>
                                </div>
                                {organizer.yearEstablished && (
                                    <>
                                     <span className="hidden sm:inline">•</span>
                                     <span>Est. {organizer.yearEstablished}</span>
                                    </>
                                )}
                            </div>
                            <p className="mt-2 text-gray-600 text-sm max-w-2xl">
                                {organizer.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

             {/* Back Button & Main Content Wrapper */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 {/* Back Button */}
                 <div className="mb-4">
                     <button
                        onClick={() => navigate(-1)} // Go back one step in history
                        className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600"
                     >
                        <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back
                     </button>
                 </div>

                {/* Grid Layout for Content + Sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content (Tabs) */}
                    <div className="lg:col-span-2">
                        {/* Tab Buttons */}
                        <div className="mb-6 border-b border-gray-200">
                            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                                <button
                                    onClick={() => setActiveTab('about')}
                                    className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'about' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                >
                                    About
                                </button>
                                <button
                                    onClick={() => setActiveTab('events')}
                                    className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'events' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                >
                                    Events ({upcomingEvents.length + pastEvents.length}) {/* Show count */}
                                </button>
                                 <button
                                    onClick={() => setActiveTab('reviews')}
                                    className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'reviews' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                >
                                    Reviews ({reviews.length}) {/* Show count */}
                                </button>
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div>
                            {/* About Tab */}
                            {activeTab === 'about' && (
                                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                    {/* Use Tailwind Typography prose class if available */}
                                    <div
                                        className="prose prose-sm sm:prose-base max-w-none"
                                        dangerouslySetInnerHTML={{ __html: organizer.longDescription || '<p>No detailed description available.</p>' }}
                                    />
                                </div>
                            )}

                            {/* Events Tab */}
                            {activeTab === 'events' && (
                                <div className="space-y-6">
                                    {/* Upcoming Events Card */}
                                    <div className="bg-white rounded-lg shadow-md border border-gray-200">
                                        <div className="p-4 sm:p-6 border-b border-gray-200">
                                            <h3 className="text-lg font-semibold text-gray-800">Upcoming Events</h3>
                                            <p className="text-sm text-gray-500 mt-1">Events currently open for registration</p>
                                        </div>
                                        <div className="p-4 sm:p-6">
                                            {upcomingEvents.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {upcomingEvents.map((event) => (
                                                        <div key={event.id} className="flex border rounded-lg overflow-hidden group">
                                                            <div className="w-1/3 h-auto flex-shrink-0">
                                                                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover"/>
                                                            </div>
                                                            <div className="w-2/3 p-3 flex flex-col justify-between">
                                                                <div>
                                                                    <h4 className="font-medium text-sm text-gray-800 line-clamp-1 group-hover:text-indigo-600">{event.title}</h4>
                                                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                                                        <CalendarDaysIcon className="h-3 w-3 mr-1" />
                                                                        {event.date}
                                                                    </div>
                                                                    <div className="mt-1 flex items-center gap-1 flex-wrap">
                                                                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">{event.category}</span>
                                                                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/10">{event.ageGroup}</span>
                                                                    </div>
                                                                </div>
                                                                <Link to={`/events/${event.id}`} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 self-end mt-1">
                                                                    View Details &rarr;
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 text-sm text-center py-4">No upcoming events found.</p>
                                            )}
                                        </div>
                                    </div>
                                    {/* Past Events Card */}
                                    {pastEvents.length > 0 && (
                                        <div className="bg-white rounded-lg shadow-md border border-gray-200">
                                            <div className="p-4 sm:p-6 border-b border-gray-200">
                                                <h3 className="text-lg font-semibold text-gray-800">Past Events</h3>
                                                 <p className="text-sm text-gray-500 mt-1">Previously held events</p>
                                            </div>
                                            <div className="p-4 sm:p-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {pastEvents.map((event) => (
                                                         <div key={event.id} className="flex border rounded-lg overflow-hidden bg-gray-50 opacity-80 group">
                                                            <div className="w-1/3 h-auto flex-shrink-0">
                                                                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover"/>
                                                            </div>
                                                            <div className="w-2/3 p-3 flex flex-col justify-between">
                                                                <div>
                                                                    <h4 className="font-medium text-sm text-gray-700 line-clamp-1">{event.title}</h4>
                                                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                                                        <CalendarDaysIcon className="h-3 w-3 mr-1" />
                                                                        {event.date}
                                                                    </div>
                                                                     <div className="mt-1 flex items-center gap-1 flex-wrap">
                                                                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">{event.category}</span>
                                                                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">{event.ageGroup}</span>
                                                                    </div>
                                                                </div>
                                                                 <Link to={`/events/${event.id}`} className="text-xs font-medium text-gray-500 hover:text-indigo-600 self-end mt-1">
                                                                    View Details &rarr;
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Reviews Tab */}
                            {activeTab === 'reviews' && (
                                <div className="bg-white rounded-lg shadow-md border border-gray-200">
                                     <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
                                         <div>
                                            <h3 className="text-lg font-semibold text-gray-800">Reviews</h3>
                                            <p className="text-sm text-gray-500 mt-1">{reviews.length} reviews from parents</p>
                                         </div>
                                         <div className="flex items-center bg-indigo-50 px-3 py-1 rounded-full">
                                             <StarIconSolid className="h-4 w-4 text-yellow-400 mr-1" />
                                             <span className="font-medium text-indigo-700">{organizer.rating.toFixed(1)}</span>
                                             <span className="text-sm text-indigo-500 ml-1">/ 5</span>
                                         </div>
                                     </div>
                                     <div className="p-4 sm:p-6">
                                         <div className="space-y-4">
                                             {reviews.length > 0 ? (
                                                 reviews.map((review) => (
                                                     <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                                         <div className="flex justify-between items-start mb-1">
                                                             <div>
                                                                 <div className="font-medium text-sm text-gray-800">{review.userName}</div>
                                                                 <div className="text-xs text-gray-500">Reviewed: {review.eventTitle}</div>
                                                             </div>
                                                             <div className="flex items-center flex-shrink-0 ml-4">
                                                                 {renderStars(review.rating)}
                                                                 <span className="text-xs text-gray-400 ml-2">{format(new Date(review.date), 'MMM d, yyyy')}</span>
                                                             </div>
                                                         </div>
                                                         <p className="text-sm text-gray-600">{review.comment}</p>
                                                     </div>
                                                 ))
                                             ) : (
                                                 <p className="text-gray-500 text-sm text-center py-4">No reviews yet.</p>
                                             )}
                                         </div>
                                     </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div>
                        <div className="sticky top-20"> {/* Adjust top based on navbar height */}
                            {/* Contact Info Card */}
                            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4">
                                 <div className="flex items-start gap-3">
                                     <EnvelopeIcon className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                     <div>
                                         <p className="text-xs text-gray-500">Email</p>
                                         <a href={`mailto:${organizer.contactEmail}`} className="text-sm font-medium text-indigo-600 hover:underline break-all">
                                             {organizer.contactEmail}
                                         </a>
                                     </div>
                                 </div>
                                 <div className="flex items-start gap-3">
                                     <PhoneIcon className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                     <div>
                                         <p className="text-xs text-gray-500">Phone</p>
                                         <a href={`tel:${organizer.contactPhone}`} className="text-sm font-medium text-gray-700">
                                             {organizer.contactPhone}
                                         </a>
                                     </div>
                                 </div>
                                 {organizer.website && (
                                     <div className="flex items-start gap-3">
                                         <GlobeAltIcon className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                         <div>
                                             <p className="text-xs text-gray-500">Website</p>
                                             <a href={`https://${organizer.website.replace(/^https?:\/\//,'')}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-indigo-600 hover:underline break-all">
                                                 {organizer.website}
                                             </a>
                                         </div>
                                     </div>
                                 )}
                                  <div className="flex items-start gap-3">
                                     <MapPinIcon className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                     <div>
                                         <p className="text-xs text-gray-500">Address</p>
                                         <p className="text-sm font-medium text-gray-700">{organizer.address}</p>
                                     </div>
                                 </div>
                            </div>
                             {/* View All Events Button */}
                             <div className="mt-6">
                                 <Link
                                     to={`/events?organizer=${organizerId}`} // Link to filtered events page
                                     className="btn btn-primary w-full" // Use button styles
                                 >
                                     View All Events by {organizer.name}
                                 </Link>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizerProfilePage;
