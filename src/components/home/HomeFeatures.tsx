import React from 'react';
import { Sparkles, Lightbulb, Rocket, LucideIcon } from 'lucide-react';

// Extend the LucideIcon type to include className
interface ExtendedLucideIcon extends LucideIcon {
  className?: string;
}

export const HomeFeatures: React.FC = () => {
  interface Feature {
    icon: ExtendedLucideIcon;
    title: string;
    description: string;
    color: string;
  }

  const features: Feature[] = [
    {
      icon: Sparkles,
      title: 'Curated Selection',
      description: 'Handpicked newsletters across diverse topics, ensuring quality and relevance.',
      color: 'primary',
    },
    {
      icon: Rocket,
      title: 'Quick Discovery',
      description: 'Advanced search and smart filters to find your perfect newsletter in seconds.',
      color: 'primary',
    },
    {
      icon: Lightbulb,
      title: 'Personalized Insights',
      description: 'AI-powered recommendations tailored to your interests and reading preferences.',
      color: 'primary',
    },
  ];

  return (
    <div className='w-full bg-white px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24'>
      <div className='w-full max-w-7xl mx-auto grid md:grid-cols-3 gap-8 py-16'>
        {features.map((feature, index) => (
          <div
            key={index}
            className='bg-gray-50 p-6 rounded-lg text-center hover:shadow-lg transition-all duration-300'
          >
            <div className='flex justify-center mb-4'>
              <div className={`bg-${feature.color}-100 text-${feature.color}-600 p-3 rounded-full`}>
                <feature.icon className='h-8 w-8' />
              </div>
            </div>
            <h3 className='text-xl font-semibold mb-2 text-gray-900'>{feature.title}</h3>
            <p className='text-gray-600'>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
