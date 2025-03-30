// src/pages/CreateEventPage.tsx
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/api';
import { useNavigate } from 'react-router-dom';
// --- Import the response type ---
import { CreateEventResponse } from '../types/entities'; // Adjust path if needed

// Define validation schema (matches backend CreateEventDto structure closely)
// Keep refined date validation
const eventFormSchema = z.object({
    title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
    description: z.string().min(10, { message: 'Description is required (min 10 chars)' }),
    // Use refine for better date validation with datetime-local input
    date: z.string().refine(val => {
        try {
            // Check if it's a non-empty string and can be parsed into a valid date
            return val && !isNaN(new Date(val).getTime());
        } catch {
            return false;
        }
    }, { message: "Please select a valid date and time" }),
    location: z.string().min(3, { message: 'Location is required' }),
    // Keep optional fields consistent with schema (Zod infers optional from .optional())
    category: z.string().optional(),
    ageGroup: z.string().optional(),
});

// Infer type for form inputs from the schema
type EventFormInputs = z.infer<typeof eventFormSchema>;

const CreateEventPage: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError, // Use setError for displaying server-side errors
        reset, // Optional: reset form on success
    } = useForm<EventFormInputs>({
        resolver: zodResolver(eventFormSchema),
        // Optional: Set default values if needed
        // defaultValues: { title: '', description: '', ... }
    });

    // --- Apply explicit types to useMutation ---
    const mutation = useMutation<CreateEventResponse, Error, EventFormInputs>({
        mutationFn: async (formData) => {
            // Prepare payload: Convert local datetime string to ISO string for backend consistency
            // The backend's IsISO8601 validator expects this format.
            const payload = {
                ...formData,
                date: new Date(formData.date).toISOString(),
                // Ensure optional fields that are empty strings are sent as undefined or handled by backend
                category: formData.category || undefined,
                ageGroup: formData.ageGroup || undefined,
            };
            const { data } = await apiClient.post('/events', payload);
            return data; // Return data matching CreateEventResponse
         },
        onSuccess: (data) => {
            console.log('Event created:', data);
            alert(`Event "${data.title}" created successfully!`); // Simple feedback
            queryClient.invalidateQueries({ queryKey: ['myEvents'] }); // Refresh organizer's event list
            queryClient.invalidateQueries({ queryKey: ['events'] });   // Refresh general event list
            reset(); // Optional: Clear the form fields
            navigate('/dashboard'); // Redirect back to dashboard
        },
        onError: (error: any) => { // Use 'any' for error or define a more specific error type
            console.error('Event creation failed:', error);
            // Try to extract backend error message
            const message = error.response?.data?.message || error.message || 'An unexpected error occurred.';
             // If the message is an array (from class-validator), join it
             const displayMessage = Array.isArray(message) ? message.join(', ') : message;

            // Set error message to be displayed in the form
            setError('root.serverError', {
                type: String(error.response?.status || 'NetworkError'),
                message: displayMessage
            });
        },
    });

    // Type the onSubmit handler explicitly
    const onSubmit: SubmitHandler<EventFormInputs> = (data) => {
        // Clear previous server errors before submitting again
        setError('root.serverError', {});
        mutation.mutate(data);
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Event</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Display Server Error */}
                {errors.root?.serverError && (
                    <div role="alert" className="p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded">
                        <p className="font-medium">Error Creating Event:</p>
                        <p>{errors.root.serverError.message}</p>
                    </div>
                )}

                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
                    <input id="title" type="text" {...register('title')} className={`mt-1 block w-full input ${errors.title ? 'input-error' : 'input-bordered'}`} />
                    {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                </div>

                {/* Description */}
                 <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea id="description" rows={4} {...register('description')} className={`mt-1 block w-full input ${errors.description ? 'input-error' : 'input-bordered'}`} />
                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
                 </div>

                 {/* Date and Time */}
                 <div>
                     <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date and Time</label>
                     <input id="date" type="datetime-local" {...register('date')} className={`mt-1 block w-full input ${errors.date ? 'input-error' : 'input-bordered'}`} />
                     {/* Display Zod validation error */}
                     {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
                 </div>

                 {/* Location */}
                 <div>
                     <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                     <input id="location" type="text" {...register('location')} className={`mt-1 block w-full input ${errors.location ? 'input-error' : 'input-bordered'}`} />
                     {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
                 </div>

                 {/* Category & Age Group (Optional) */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                         <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category <span className='text-gray-400'>(Optional)</span></label>
                         {/* Register optional fields normally */}
                         <input id="category" type="text" placeholder='e.g., Sports, Arts' {...register('category')} className={`mt-1 block w-full input input-bordered`} />
                         {/* Optional fields might not have errors unless specific constraints are added */}
                         {/* {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>} */}
                     </div>
                     <div>
                         <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-700">Age Group <span className='text-gray-400'>(Optional)</span></label>
                         <input id="ageGroup" type="text" placeholder='e.g., 3-5, All Ages' {...register('ageGroup')} className={`mt-1 block w-full input input-bordered`} />
                         {/* {errors.ageGroup && <p className="mt-1 text-sm text-red-600">{errors.ageGroup.message}</p>} */}
                     </div>
                 </div>

                 <div className='flex justify-end space-x-3 pt-4'>
                      <button
                          type="button"
                          onClick={() => navigate('/dashboard')}
                          className="btn btn-ghost" // Use Tailwind/DaisyUI classes as needed
                       >
                          Cancel
                      </button>
                     <button
                        type="submit"
                        // Disable button while submitting mutation or RHF is submitting
                        disabled={isSubmitting || mutation.isPending}
                        className="btn btn-primary disabled:opacity-50" // Use Tailwind/DaisyUI classes
                    >
                         {/* Show appropriate loading text */}
                        {mutation.isPending ? 'Creating...' : 'Create Event'}
                    </button>
                 </div>
            </form>
        </div>
    );
};

export default CreateEventPage;