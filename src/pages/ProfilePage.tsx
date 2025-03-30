// src/pages/ProfilePage.tsx
import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import apiClient from '../services/api';
// Assuming types are defined centrally
import { BaseUser } from '../types/entities';
import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

// --- Zod Schemas ---

// Schema for updating profile details
const profileSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
});
type ProfileFormInputs = z.infer<typeof profileSchema>;

// Schema for changing password
const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match",
    path: ["confirmPassword"], // Set error on confirmPassword field
});
type PasswordFormInputs = z.infer<typeof passwordSchema>;

// --- Component ---

const ProfilePage: React.FC = () => {
    const queryClient = useQueryClient();
    // State for success/error messages
    const [profileUpdateStatus, setProfileUpdateStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [passwordUpdateStatus, setPasswordUpdateStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // --- Fetch Current User Data ---
    // Explicitly provide BaseUser as the third generic (TData)
    const { data: userData, isLoading: isLoadingUser, error: userError } = useQuery<BaseUser, Error, BaseUser>({
        queryKey: ['currentUserProfile'],
        // Assuming GET /auth/profile returns user data matching BaseUser
        // Adjust if your endpoint or user type is different
        queryFn: async () => {
            const { data } = await apiClient.get('/auth/profile');
            // Ensure the data returned here actually matches BaseUser structure
            return data;
        },
        staleTime: Infinity, // Profile data likely doesn't change unless updated here
    });

    // --- Update Profile Form & Mutation ---
    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        formState: { errors: profileErrors, isDirty: isProfileDirty }, // Check if form is dirty
        reset: resetProfileForm, // Function to reset form values
        setError: setProfileError,
    } = useForm<ProfileFormInputs>({
        resolver: zodResolver(profileSchema),
        defaultValues: { // Set default values once userData is loaded
            firstName: '',
            lastName: '',
            email: '',
        }
    });

    // Effect to reset form when user data loads
    useEffect(() => {
        if (userData) {
            // FIX: Convert null to empty string for reset
            resetProfileForm({
                firstName: userData.firstName ?? '', // Use nullish coalescing
                lastName: userData.lastName ?? '', // Use nullish coalescing
                email: userData.email || '', // Fallback for email just in case
            });
        }
    }, [userData, resetProfileForm]);

    const profileMutation = useMutation<BaseUser, Error, ProfileFormInputs>({
        mutationFn: (data) => apiClient.patch('/users/me', data).then(res => res.data), // Assuming PATCH /users/me endpoint
        onSuccess: (updatedUser) => {
            setProfileUpdateStatus({ type: 'success', message: 'Profile updated successfully!' });
            setPasswordUpdateStatus(null); // Clear password status
            // Update the cached user data
            queryClient.setQueryData(['currentUserProfile'], updatedUser);
            // Optionally update zustand store if needed elsewhere immediately
            // useAuthStore.getState().setUser(updatedUser); // Adjust based on your store structure

            // FIX: Convert null to empty string for reset
            resetProfileForm({
                firstName: updatedUser.firstName ?? '', // Use nullish coalescing
                lastName: updatedUser.lastName ?? '', // Use nullish coalescing
                email: updatedUser.email, // Email should be string
            }); // Reset form to updated values, marking it as not dirty
        },
        onError: (error: any) => {
            setProfileUpdateStatus({ type: 'error', message: error.response?.data?.message || error.message || 'Failed to update profile.' });
            setPasswordUpdateStatus(null);
            setProfileError('root.serverError', { message: error.response?.data?.message || error.message });
        },
    });

    const onProfileSubmit: SubmitHandler<ProfileFormInputs> = (data) => {
        setProfileUpdateStatus(null); // Clear previous status
        profileMutation.mutate(data);
    };

    // --- Change Password Form & Mutation ---
    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: { errors: passwordErrors },
        reset: resetPasswordForm,
        setError: setPasswordError,
    } = useForm<PasswordFormInputs>({
        resolver: zodResolver(passwordSchema),
    });

    const passwordMutation = useMutation<unknown, Error, PasswordFormInputs>({ // Response type might just be success message
        mutationFn: (data) => apiClient.patch('/users/me/password', data).then(res => res.data), // Assuming PATCH /users/me/password
        onSuccess: () => {
            setPasswordUpdateStatus({ type: 'success', message: 'Password changed successfully!' });
            setProfileUpdateStatus(null); // Clear profile status
            resetPasswordForm(); // Clear password fields
        },
        onError: (error: any) => {
            setPasswordUpdateStatus({ type: 'error', message: error.response?.data?.message || error.message || 'Failed to change password.' });
            setProfileUpdateStatus(null);
            setPasswordError('root.serverError', { message: error.response?.data?.message || error.message });

        },
    });

    const onPasswordSubmit: SubmitHandler<PasswordFormInputs> = (data) => {
        setPasswordUpdateStatus(null); // Clear previous status
        passwordMutation.mutate(data);
    };

    // --- Render Logic ---

    if (isLoadingUser) {
        return <div className="text-center p-10">Loading profile...</div>;
    }

    if (userError) {
        return <div className="text-center p-10 bg-red-100 text-red-700 rounded-lg shadow">Error loading profile: {userError.message}</div>;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>

            {/* General Status Messages */}
            {profileUpdateStatus && (
                <div className={`p-4 rounded-md text-sm ${profileUpdateStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {profileUpdateStatus.message}
                </div>
            )}
            {passwordUpdateStatus && (
                <div className={`p-4 rounded-md text-sm ${passwordUpdateStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {passwordUpdateStatus.message}
                </div>
            )}

            {/* Section 1: Update Profile Details */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
                <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-4">
                    {profileErrors.root?.serverError && (
                        <p className="text-sm text-red-600">{profileErrors.root.serverError.message}</p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                            <input
                                id="firstName"
                                type="text"
                                {...registerProfile('firstName')}
                                className={`mt-1 block w-full input ${profileErrors.firstName ? 'input-error' : 'input-bordered'}`} // Use consistent input classes
                            />
                            {profileErrors.firstName && <p className="mt-1 text-sm text-red-600">{profileErrors.firstName.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                id="lastName"
                                type="text"
                                {...registerProfile('lastName')}
                                className={`mt-1 block w-full input ${profileErrors.lastName ? 'input-error' : 'input-bordered'}`}
                            />
                            {profileErrors.lastName && <p className="mt-1 text-sm text-red-600">{profileErrors.lastName.message}</p>}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            type="email"
                            {...registerProfile('email')}
                            className={`mt-1 block w-full input ${profileErrors.email ? 'input-error' : 'input-bordered'}`}
                        />
                        {profileErrors.email && <p className="mt-1 text-sm text-red-600">{profileErrors.email.message}</p>}
                    </div>
                    <div className="text-right">
                        <button
                            type="submit"
                            disabled={profileMutation.isPending || !isProfileDirty} // Disable if not dirty or pending
                            className="btn btn-primary disabled:opacity-50" // Use consistent button classes
                        >
                            {profileMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Section 2: Change Password */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h2>
                <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-4">
                    {passwordErrors.root?.serverError && (
                        <p className="text-sm text-red-600">{passwordErrors.root.serverError.message}</p>
                    )}
                    <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                        <input
                            id="currentPassword"
                            type="password"
                            {...registerPassword('currentPassword')}
                            className={`mt-1 block w-full input ${passwordErrors.currentPassword ? 'input-error' : 'input-bordered'}`}
                        />
                        {passwordErrors.currentPassword && <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            id="newPassword"
                            type="password"
                            {...registerPassword('newPassword')}
                            className={`mt-1 block w-full input ${passwordErrors.newPassword ? 'input-error' : 'input-bordered'}`}
                        />
                        {passwordErrors.newPassword && <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            {...registerPassword('confirmPassword')}
                            className={`mt-1 block w-full input ${passwordErrors.confirmPassword ? 'input-error' : 'input-bordered'}`}
                        />
                        {passwordErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>}
                    </div>
                    <div className="text-right">
                        <button
                            type="submit"
                            disabled={passwordMutation.isPending}
                            className="btn btn-primary disabled:opacity-50"
                        >
                            {passwordMutation.isPending ? 'Changing...' : 'Change Password'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Add sections for other suggested profile items here later */}

        </div>
    );
};

// Add these helper classes to your global CSS (e.g., src/index.css) if you don't have them
/*
.input { @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm; }
.input-bordered { @apply border-gray-300; } // Default border
.input-error { @apply border-red-500 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500; }
.select { @apply block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm; }
.select-bordered { @apply border-gray-300; }
.select-error { @apply border-red-500 text-red-900 focus:border-red-500 focus:ring-red-500; }
.btn { @apply inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2; }
.btn-primary { @apply border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500; }
.btn-ghost { @apply border-transparent bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-indigo-500; }
*/


export default ProfilePage;
