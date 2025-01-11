import type { GlobalTypes } from '@/types/global';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/stores/authStore';
import { useAnimatedVisibility } from '@/hooks/useAnimatedVisibility';
import Footer from '@/components/common/Footer';
import HomeCTA from '@/components/home/HomeCTA';
import HomeFeatures from '@/components/home/HomeFeatures';
import { HomeSearchBar } from '@/components/home/HomeSearchBar';

const HomePage: () => JSX.Element = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const { visibilityClasses } = useAnimatedVisibility(100);

    const handleGetStarted = () => {
        navigate(isAuthenticated ? '/profile' : '/auth');
    };

    return (
        <div 
            className={`
                flex flex-col min-h-screen 
                bg-gradient-to-br from-primary-50 via-white to-primary-100 
                overflow-x-hidden 
                ${visibilityClasses.container}
                safe-top-[env(safe-area-inset-top)]
            `} 
            role='main' 
            aria-label='Newsletter Discovery Homepage'
        >
            {/* Hero Section */}
            <section className='w-full px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24 py-12 md:py-16 lg:py-24'>
                <div className='w-full grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto'>
                    {/* Left Column: Hero Text */}
                    <div className={`
                        text-center lg:text-left space-y-6 
                        transition-all duration-1000 transform 
                        ${visibilityClasses.content}
                    `}>
                        <div className='space-y-4'>
                            <h1 
                                className='text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight' 
                                aria-level={1}
                            >
                                Discover Your Perfect <br />
                                <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400'>
                                    Newsletter Companion
                                </span>
                            </h1>
                            <p 
                                className='text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0' 
                                aria-label='Tagline description'
                            >
                                Curate your digital reading experience with personalized newsletter recommendations
                                tailored to your interests.
                            </p>
                        </div>
                        <div className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start'>
                            <button 
                                onClick={handleGetStarted} 
                                className='btn-primary bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-300 px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg'
                            >
                                Get Started
                            </button>
                            <button 
                                onClick={() => navigate('/newsletters')} 
                                className='btn-secondary border border-primary-600 text-primary-600 hover:bg-primary-50 transition-colors duration-300 px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg'
                            >
                                Explore Newsletters
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Hero Image or Illustration */}
                    <div className={`
                        hidden lg:flex justify-center items-center 
                        transition-all duration-1000 transform 
                        ${visibilityClasses.content}
                    `}>
                        <div className='w-full max-w-md aspect-square bg-primary-100 rounded-full opacity-70 shadow-xl'></div>
                    </div>
                </div>
            </section>

            {/* Content Sections */}
            <main className='flex-grow container mx-auto px-4 space-y-16 w-full max-w-7xl'>
                {/* Home Search Bar */}
                <section className='w-full'>
                    <HomeSearchBar />
                </section>

                {/* Home Features */}
                <section className='w-full'>
                    <HomeFeatures />
                </section>

                {/* Home CTA */}
                <section className='w-full'>
                    <HomeCTA />
                </section>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default HomePage;
