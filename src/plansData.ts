export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  price: string;
  period: string;
  badge?: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
  yearly?: boolean;
  b2b?: boolean;
}

export const PLANS_DATA: PricingPlan[] = [
  {
    id: 'BASIC',
    name: 'Free Basic',
    tagline: 'Essential in-browser CSV cleaning.',
    price: '$0',
    period: '/ forever',
    badge: 'Starter',
    features: [
      'Unlimited CSV Cleaning',
      'Deduplicate & Trim Spaces',
      'Standard CSV & JSON Export'
    ],
    buttonText: 'Current Plan',
  },
  {
    id: 'PRO',
    name: 'Unlimited Pro',
    tagline: 'Advanced multi-format exports & speed.',
    price: '$1.99',
    period: '/ month',
    badge: 'Popular',
    popular: true,
    features: [
      'Unlimited Files (50MB+)',
      'Direct Excel (.xlsx) Export',
      'Priority 24/7 Support'
    ],
    buttonText: 'Upgrade Monthly ($1.99)',
  },
  {
    id: 'YEARLY_PRO',
    name: 'Yearly Pro',
    tagline: 'Full year access at discounted pricing.',
    price: '$15',
    period: '/ year',
    badge: 'Save 37%',
    yearly: true,
    features: [
      'All Unlimited Pro Features',
      '12 Months Full Access',
      'Excel & JSON Multi-Export'
    ],
    buttonText: 'Get Yearly Pro ($15)',
  },
  {
    id: 'BUSINESS',
    name: 'Business Team',
    tagline: 'Built for agencies and growing companies.',
    price: '$19',
    period: '/ month',
    badge: 'For Teams',
    b2b: true,
    features: [
      'Up to 10 Team Seats',
      'Bulk File Processing (100MB+)',
      'Dedicated VIP Support'
    ],
    buttonText: 'Get Business Team ($19)',
  },
];