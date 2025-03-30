// src/types/entities.ts

// --- User/Organizer Types ---
export interface BaseUser {
    id: number;
    firstName: string | null;
    lastName: string | null;
    email: string;
}

export interface OrganizerProfileInfo {
    orgName?: string | null;
    description?: string | null;
    contactPhone?: string | null;
    website?: string | null;
}

export interface DetailedOrganizer extends BaseUser {
    organizerInfo?: OrganizerProfileInfo | null;
}

export interface BaseOrganizer extends BaseUser {
     organizerInfo?: Pick<OrganizerProfileInfo, 'orgName'> | null;
}


// --- Event Types ---

export interface BaseEvent {
    id: number;
    title: string;
    description: string;
    date: string; // ISO Date string from backend
    location: string;
    category?: string | null;
    ageGroup?: string | null;
    price?: number | null; // Optional number for price
    createdAt: string;
    updatedAt: string;
}

export interface EventListItem extends BaseEvent {
   organizer: BaseOrganizer;
   _count?: {
        registrations?: number;
   };
   price?: number | null; // Ensure price is here if needed for list card
}

export interface EventDetails extends BaseEvent {
    organizer: DetailedOrganizer;
    price?: number | null;
}


// --- Registration Types ---

// Base Registration type, used for lists like ParentDashboard
export interface Registration {
    id: number;
    eventId: number;
    userId: number;
    registeredAt: string;
    childName?: string | null;
    childAge?: number | null;
    user?: BaseUser;
    // Event details needed for display (e.g., in ParentDashboard using EventCard)
    // Make optional if sometimes it's not included in a query
    event?: Pick<BaseEvent, 'id' | 'title' | 'date' | 'location' | 'description' | 'category' | 'ageGroup' | 'price'> & { imageUrl?: string | null, timeInfo?: string | null }; // Add other fields EventCard might need
}

// --- FIX: Define RegistrationResponse independently ---
// Type specifically for the response from POST /events/:id/register endpoint
export interface RegistrationResponse {
    // Include fields returned by the registration endpoint
    id: number;
    eventId: number;
    userId: number;
    registeredAt: string;
    // Optional child info if returned
    childName?: string | null;
    childAge?: number | null;
    // Define the specific event subset returned by this endpoint
    event: Pick<BaseEvent, 'id' | 'title' | 'date'>;
}
// --- END FIX ---


// Type for the response from POST /events (Create Event)
export interface CreateEventResponse extends BaseEvent {
    organizer: Pick<BaseOrganizer, 'id' | 'firstName' | 'lastName'>;
    organizerId: number;
    price?: number | null;
}

