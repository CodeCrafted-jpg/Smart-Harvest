"use client"

import React, { useState, useEffect } from 'react';
import { Menu, X, Bot, Heart, Shield, Users, MessageCircle, Home, Info, LeafyGreen } from 'lucide-react';
import { UserButton, useUser, SignInButton } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


interface NavItem {
    label: string;
    href: string;
    icon?: React.ReactNode;
}

const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState<boolean>(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const { isSignedIn, user } = useUser();
    const router = useRouter();

    const navItems: NavItem[] = [
        { label: 'Home', href: '/', icon: <Home size={16} /> },
        { label: 'Features', href: '#features', icon: <Shield size={16} /> },
        { label: 'Quick-Chat', href: '/QuickChat', icon: <Info size={16} /> },
        { label: ' Info', href: '#info', icon: <Heart size={16} /> },
        { label: 'Chats', href: '/previous', icon: <Shield size={16} /> },
        { label: 'Contact', href: '#contact', icon: <Users size={16} /> },
    ];

    const handleClick=()=>{
       router.push("/Form")
    }

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleNavClick = (href: string) => {
        setIsMobileMenuOpen(false);

        // Smooth scroll to section
        if (href.startsWith("#")) {
    // 🔽 In-page anchor scroll
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  } else {
    // 🔽 Next.js route navigation
    router.push(href);
  }
    };

    // Function to generate unique chat ID and navigate
    const handleStartChat = async () => {
        try {
            // Option 1: Generate UUID-like ID
            const chatId = generateChatId();

            // Option 2: If you have an API to create chat sessions
            // const response = await fetch('/api/chat/create', { method: 'POST' });
            // const { chatId } = await response.json();

            // Navigate to the chat route
            router.push(`/Chat/${chatId}`);
        } catch (error) {
            console.error('Error creating chat:', error);
            // Fallback to generated ID
            const chatId = generateChatId();
            router.push(`/Chat/${chatId}`);
        }
    };

    // Generate a unique chat ID
    const generateChatId = (): string => {
        // Option 1: Simple timestamp + random
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Option 2: More UUID-like format
        // return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        //   const r = Math.random() * 16 | 0;
        //   const v = c == 'x' ? r : (r & 0x3 | 0x8);
        //   return v.toString(16);
        // });
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white/98 backdrop-blur-xl shadow-lg border-b border-gray-200/20'
                    : 'bg-white/95 backdrop-blur-lg'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link
                                href="/"
                                className="flex items-center space-x-2 text-xl font-bold text-green-600 hover:text-green-700 transition-colors duration-200 group"

                            >
                                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg group-hover:scale-110 transition-transform duration-200">
                                    <LeafyGreen className="h-6 w-6 text-white" />
                                </div>
                                <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent font-extrabold tracking-tight text-xl sm:text-2xl drop-shadow-md group-hover:drop-shadow-lg">
                                SmartHarvest
                                </span>

                                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider rounded-full px-2 py-0.5 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 shadow-sm">
                                    AI-powered
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-center space-x-1">
                                <div className="flex items-baseline space-x-1">
                                    {navItems.map((item) => (
                                        <a
                                            key={item.label}
                                            href={item.href}
                                            className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-indigo-50 transition-all duration-200 group"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleNavClick(item.href);
                                            }}
                                        >
                                            <span className="group-hover:scale-110 transition-transform duration-200">
                                                {item.icon}
                                            </span>
                                            <span>{item.label}</span>
                                        </a>
                                    ))}
                                </div>

                                {/* Authentication Section */}
                                <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-200">
                                    {isSignedIn ? (
                                        <div className="flex items-center space-x-3">
                                            <span className="text-sm text-gray-600 hidden lg:block">
                                                Welcome, {user?.firstName || 'User'}!
                                            </span>
                                            <UserButton
                                                appearance={{
                                                    elements: {
                                                        avatarBox: "w-8 h-8 ring-2 ring-indigo-200 hover:ring-indigo-300 transition-all duration-200"
                                                    }
                                                }}
                                            />
                                            <button
                                                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-600 text-white px-6 py-2 rounded-full font-semibold hover:from-green-700 hover:to-green-700 transform hover:scale-105 hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl"
                                               onClick={handleClick}
                                            >
                                                <MessageCircle size={16} />
                                                <span >Recommendation</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-3">
                                            <SignInButton mode="modal">
                                                <button className="text-gray-700 hover:text-green-600 px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                                                    Sign In
                                                </button>
                                            </SignInButton>
                                            <button
                                                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-600 text-white px-6 py-2 rounded-full font-semibold hover:from-green-700 hover:to-green-700 transform hover:scale-105 hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl"
                                                onClick={handleStartChat}
                                            >
                                                <MessageCircle size={16} />
                                                <span>Try Demo</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={handleMobileMenuToggle}
                                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-indigo-50 transition-colors duration-200"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen
                        ? 'max-h-96 opacity-100'
                        : 'max-h-0 opacity-0 overflow-hidden'
                    }`}>
                    <div className="px-2 pt-2 pb-3 space-y-1 bg-white/98 backdrop-blur-xl border-t border-gray-200/20">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-green-600 hover:bg-indigo-50 transition-all duration-200"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNavClick(item.href);
                                }}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </a>
                        ))}

                        {/* Mobile Authentication Section */}
                        <div className="pt-4 border-t border-gray-200/30">
                            {isSignedIn ? (
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3 px-3 py-2">
                                        <UserButton
                                            appearance={{
                                                elements: {
                                                    avatarBox: "w-8 h-8 ring-2 ring-indigo-200"
                                                }
                                            }}
                                        />
                                        <span className="text-sm text-gray-600">
                                            {user?.firstName || 'User'}
                                        </span>
                                    </div>
                                    <button
                                        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                                        onClick={handleStartChat}
                                    >
                                        <MessageCircle size={16} />
                                        <span>Recommendation</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <SignInButton mode="modal">
                                        <button className="w-full text-gray-700 hover:text-green-600 px-4 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-all duration-200 border border-gray-200">
                                            Sign In to Continue
                                        </button>
                                    </SignInButton>
                                    <button
                                        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-700 transition-all duration-200 shadow-lg"
                                        onClick={handleStartChat}
                                    >
                                        <MessageCircle size={16} />
                                        <span>Try Demo</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;