// src/components/Navbar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, useIsAuthenticated, useCurrentUser } from '../stores/authStore';
import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon, ChevronDownIcon } from '@heroicons/react/20/solid'; // Example icons
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
    const isAuthenticated = useIsAuthenticated();
    const user = useCurrentUser();
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const navigate = useNavigate();

    const handleLogout = () => {
        clearAuth();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand Name */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-xl font-bold text-indigo-600">
                            KidzEvents
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/events" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                            Browse Events
                        </Link>
                        {isAuthenticated && user?.role === 'ORGANIZER' && (
                            <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                                My Dashboard
                            </Link>
                        )}
                        {/* Add other links */}
                    </div>

                    {/* Auth Buttons / User Menu */}
                    <div className="flex items-center">
                        {isAuthenticated && user ? (
                            <Menu as="div" className="relative ml-3">
                                <div>
                                    <Menu.Button className="flex items-center max-w-xs rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 p-1 hover:bg-gray-200">
                                        <span className="sr-only">Open user menu</span>
                                        <UserCircleIcon className="h-8 w-8 text-gray-500" aria-hidden="true" />
                                        <span className='ml-2 mr-1 text-sm font-medium text-gray-700 hidden sm:block'>
                                            {user.firstName || user.email}
                                        </span>
                                        <ChevronDownIcon className="h-5 w-5 text-gray-400 hidden sm:block" aria-hidden="true" />
                                    </Menu.Button>
                                </div>
                                <Transition
                                    as={React.Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    to="/profile" // Create a profile page later
                                                    className={`${active ? 'bg-gray-100' : ''
                                                        } block px-4 py-2 text-sm text-gray-700`}
                                                >
                                                    Your Profile
                                                </Link>
                                            )}
                                        </Menu.Item>
                                        {user.role === 'ORGANIZER' && (
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        to="/dashboard"
                                                        className={`${active ? 'bg-gray-100' : ''
                                                            } block px-4 py-2 text-sm text-gray-700`}
                                                    >
                                                        Dashboard
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                        )}
                                        {/* My Registrations Link (For Parents, or all users initially) */}
                                        {/* Add user.role === 'PARENT' condition later if needed */}
                                        {user.role === 'PARENT' && (
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        to="/my-registrations"
                                                        className={`${active ? 'bg-gray-100' : ''} group flex items-center px-4 py-2 text-gray-700 text-sm`}
                                                    >
                                                        <CalendarDaysIcon className="mr-3 h-5 w-5 text-gray-700" aria-hidden="true" />
                                                        My Registrations
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                        )}
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={handleLogout}
                                                    className={`${active ? 'bg-gray-100' : ''
                                                        } block w-full px-4 py-2 text-left text-sm text-gray-700`}
                                                >
                                                    Sign out
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        ) : (
                            <div className="space-x-2">
                                <Link
                                    to="/login"
                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                    {/* TODO: Mobile Menu Button */}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;