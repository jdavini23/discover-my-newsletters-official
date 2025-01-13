export const NEWSLETTER_CATEGORIES = [
  'Technology',
  'Design',
  'Startup',
  'Programming',
  'Marketing',
  'Finance',
  'Science',
  'Art',
  'Writing',
  'Entrepreneurship',
  'Personal Development',
  'Health',
  'Travel',
  'Food',
  'Music',
  'Sports',
  'Politics',
  'Environment',
  'Education',
  'Other'
] as const;

export type NewsletterCategory = typeof NEWSLETTER_CATEGORIES[number];
