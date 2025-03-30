// src/types/entities.ts

// --- User/Organizer Types ---
export interface BaseUser {
    id: number;
    firstName: string | null;
    lastName: string | null;
    email: string; // Assuming email is generally available
}

export interface OrganizerProfileInfo {
    orgName?: string | null;
    description?: string | null;
    contactPhone?: string | null;
    website?: string | null;
    // Add other profile fields if needed
}

// Used when fetching detailed organizer info (e.g., in EventDetails)
export interface DetailedOrganizer extends BaseUser {
    organizerInfo?: OrganizerProfileInfo | null;
}

// Used when organizer info is summarized (e.g., in EventList)
export interface BaseOrganizer extends BaseUser {
     organizerInfo?: Pick<OrganizerProfileInfo, 'orgName'> | null; // Only include orgName for lists
}


// --- Event Types ---

// Fields common to both list view and detail view
export interface BaseEvent {
    id: number;
    title: string;
    description: string;
    date: string; // ISO Date string from backend
    location: string;
    category?: string | null; // Optional field
    ageGroup?: string | null; // Optional field
    createdAt: string; // Assuming these are returned
    updatedAt: string;
}

// Type for the data returned by GET /events (List View)
export interface EventListItem extends BaseEvent {
   organizer: BaseOrganizer; // Use BaseOrganizer for lists
   _count?: { // Optional registration count if included
        registrations?: number;
   };
}

// Type for the data returned by GET /events/:id (Detail View)
export interface EventDetails extends BaseEvent {
    organizer: DetailedOrganizer; // Use DetailedOrganizer for details
    // Add any other fields specific to the detailed view if applicable
    // e.g., registrations?: Registration[]; (if participants are included directly)
}


// --- Registration Types ---
export interface Registration {
    id: number;
    eventId: number;
    userId: number;
    registeredAt: string;
    // Optional child info if added
    childName?: string | null;
    childAge?: number | null;
     // Include related data if needed
     user?: BaseUser;
     event?: Pick<BaseEvent, 'id' | 'title' | 'date'>; // Only pick necessary fields
}

// Type for the response from POST /events/:id/register
export interface RegistrationResponse extends Registration {
    event: Pick<BaseEvent, 'id' | 'title' | 'date'>; // Ensure event subset is present
}

export interface CreateEventResponse extends BaseEvent { // Includes fields from BaseEvent
    organizer: Pick<BaseOrganizer, 'id' | 'firstName' | 'lastName'>; // Includes the specific selection
    organizerId: number; // The foreign key is also typically returned
}