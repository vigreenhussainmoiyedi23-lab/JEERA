// Ads configuration with multiple ad variations
export const ADS_CONFIG = {
  // Profile page sponsored ads
  profileAds: [
    {
      id: 'build-brand',
      title: 'Build your brand',
      description: 'Grow your online presence',
      bgColor: 'from-yellow-400/20 to-amber-500/10',
      borderColor: 'border-white/10'
    },
    {
      id: 'hire-talent',
      title: 'Hire top talent',
      description: 'Find your next teammate',
      bgColor: 'from-indigo-500/20 to-sky-500/10',
      borderColor: 'border-white/10'
    },
    {
      id: 'level-up-skills',
      title: 'Level up skills',
      description: 'Learn faster with projects',
      bgColor: 'from-emerald-500/20 to-teal-500/10',
      borderColor: 'border-white/10'
    },
    {
      id: 'premium-features',
      title: 'Premium features',
      description: 'Unlock advanced tools',
      bgColor: 'from-purple-500/20 to-pink-500/10',
      borderColor: 'border-white/10'
    },
    {
      id: 'network-growth',
      title: 'Network growth',
      description: 'Connect with professionals',
      bgColor: 'from-blue-500/20 to-cyan-500/10',
      borderColor: 'border-white/10'
    }
  ],
  
  // Posts page sponsored ads
  postsAds: [
    {
      id: 'teams-workflow',
      title: 'Jeera Teams',
      description: 'Manage tasks, projects, and collaboration in one place',
      buttonText: 'View projects',
      buttonLink: '/projects',
      buttonIcon: 'ArrowRight'
    },
    {
      id: 'pro-features',
      title: 'Pro Features',
      description: 'Unlock advanced analytics and tools',
      buttonText: 'Learn more',
      buttonLink: '/pricing',
      buttonIcon: 'ArrowRight'
    },
    {
      id: 'team-collaboration',
      title: 'Team Collaboration',
      description: 'Work together seamlessly with your team',
      buttonText: 'Get started',
      buttonLink: '/projects',
      buttonIcon: 'ArrowRight'
    },
    {
      id: 'productivity-boost',
      title: 'Productivity Boost',
      description: '10x your team\'s efficiency with smart tools',
      buttonText: 'Try now',
      buttonLink: '/features',
      buttonIcon: 'ArrowRight'
    }
  ]
};

// Function to get random ads
export const getRandomAds = (adType, count = 1) => {
  const ads = ADS_CONFIG[adType];
  const shuffled = [...ads].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Function to get a single random ad
export const getRandomAd = (adType) => {
  const ads = ADS_CONFIG[adType];
  const randomIndex = Math.floor(Math.random() * ads.length);
  return ads[randomIndex];
};
