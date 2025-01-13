export const mockNewsletters = [
    // Technology Newsletters
    {
        id: 'tech-1',
        title: 'The Byte Beat',
        description: 'Weekly deep dive into the latest tech innovations and startup trends',
        author: 'Alex Rodriguez',
        websiteUrl: 'https://thebytebeat.com',
        subscribeUrl: 'https://thebytebeat.com/subscribe',
        categories: ['Technology', 'Startup'],
        tags: ['AI', 'Startups', 'Innovation', 'Tech Trends'],
        averageReadTime: 12,
        subscriberCount: 50000,
        coverImageUrl: 'https://example.com/bytebeat-cover.jpg'
    },
    {
        id: 'tech-2',
        title: 'Code Horizons',
        description: 'Cutting-edge programming insights and software engineering best practices',
        author: 'Sarah Chen',
        websiteUrl: 'https://codehorizons.dev',
        subscribeUrl: 'https://codehorizons.dev/subscribe',
        categories: ['Technology', 'Programming'],
        tags: ['Software Engineering', 'Web Development', 'Coding Tips'],
        averageReadTime: 15,
        subscriberCount: 75000,
        coverImageUrl: 'https://example.com/codehorizons-cover.jpg'
    },
    // Design Newsletters
    {
        id: 'design-1',
        title: 'Pixel Perfect',
        description: 'Curated design inspiration, UX trends, and creative insights',
        author: 'Emma Thompson',
        websiteUrl: 'https://pixelperfect.design',
        subscribeUrl: 'https://pixelperfect.design/subscribe',
        categories: ['Design'],
        tags: ['UI/UX', 'Graphic Design', 'Creative Inspiration'],
        averageReadTime: 10,
        subscriberCount: 40000,
        coverImageUrl: 'https://example.com/pixelperfect-cover.jpg'
    },
    // Marketing Newsletters
    {
        id: 'marketing-1',
        title: 'Growth Signals',
        description: 'Strategic marketing insights for entrepreneurs and marketers',
        author: 'Michael Wong',
        websiteUrl: 'https://growthsignals.com',
        subscribeUrl: 'https://growthsignals.com/subscribe',
        categories: ['Marketing', 'Entrepreneurship'],
        tags: ['Digital Marketing', 'Growth Hacking', 'Startup Marketing'],
        averageReadTime: 8,
        subscriberCount: 60000,
        coverImageUrl: 'https://example.com/growthsignals-cover.jpg'
    },
    // Finance Newsletters
    {
        id: 'finance-1',
        title: 'Wealth Wisdom',
        description: 'Comprehensive financial advice and investment strategies',
        author: 'David Kim',
        websiteUrl: 'https://wealthwisdom.finance',
        subscribeUrl: 'https://wealthwisdom.finance/subscribe',
        categories: ['Finance'],
        tags: ['Investing', 'Personal Finance', 'Wealth Management'],
        averageReadTime: 14,
        subscriberCount: 45000,
        coverImageUrl: 'https://example.com/wealthwisdom-cover.jpg'
    },
    // Science Newsletters
    {
        id: 'science-1',
        title: 'Quantum Frontier',
        description: 'Exploring the latest breakthroughs in scientific research',
        author: 'Dr. Rachel Green',
        websiteUrl: 'https://quantumfrontier.science',
        subscribeUrl: 'https://quantumfrontier.science/subscribe',
        categories: ['Science'],
        tags: ['Research', 'Innovation', 'Scientific Discoveries'],
        averageReadTime: 16,
        subscriberCount: 30000,
        coverImageUrl: 'https://example.com/quantumfrontier-cover.jpg'
    },
    // Writing Newsletters
    {
        id: 'writing-1',
        title: 'Ink & Insights',
        description: 'Writing tips, creative inspiration, and literary analysis',
        author: 'Emily Roberts',
        websiteUrl: 'https://inkandinsights.com',
        subscribeUrl: 'https://inkandinsights.com/subscribe',
        categories: ['Writing', 'Art'],
        tags: ['Creative Writing', 'Literature', 'Author Tips'],
        averageReadTime: 11,
        subscriberCount: 35000,
        coverImageUrl: 'https://example.com/inkandinsights-cover.jpg'
    },
    // Personal Development
    {
        id: 'personal-dev-1',
        title: 'Mindful Growth',
        description: 'Strategies for personal development, mental health, and self-improvement',
        author: 'Jason Miller',
        websiteUrl: 'https://mindfulgrowth.com',
        subscribeUrl: 'https://mindfulgrowth.com/subscribe',
        categories: ['Personal Development', 'Health'],
        tags: ['Self-Improvement', 'Mental Health', 'Productivity'],
        averageReadTime: 9,
        subscriberCount: 55000,
        coverImageUrl: 'https://example.com/mindfulgrowth-cover.jpg'
    }
];
// Optional: Export a function to get random recommendations
export const getRandomRecommendations = (count = 3) => {
    const shuffled = [...mockNewsletters].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};
