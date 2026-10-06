import { clsx } from 'clsx';
import { CircleCheck } from '@/helpers/icon/icon';
import Button from '../ui/button';
import Link from 'next/link';

const PLANS = [
  {
    name: 'Starter',
    tagline: 'Perfect for small businesses getting started',
    price: '৳0',
    period: '/month',
    cta: 'Start Free',
    active: true,
    href: '/signin',
    features: [
      'Up to 100 products',
      '1 warehouse',
      '1 user',
      'Basic reports',
      'Email support',
      'Mobile app access',
    ],
  },
  {
    name: 'Professional',
    tagline: 'For growing businesses that need more power',
    price: '৳1990',
    period: '/month',
    cta: 'Start Free Trial',
    active: false,
    highlighted: true,
    href: '/',
    features: [
      'Unlimited products',
      'Up to 3 warehouses',
      '10 users',
      'Advanced analytics',
      'POS system',
      'Invoice customization',
      'Priority support',
      'API access',
    ],
  },
  {
    name: 'Enterprise',
    tagline: 'For large operations with advanced needs',
    price: '৳4990',
    period: '/month',
    cta: 'Contact Sales',
    active: false,
    href: '/',
    features: [
      'Everything in Professional',
      'Unlimited warehouses',
      'Unlimited users',
      'Custom reports',
      'Dedicated manager',
      '24/7 phone support',
      'Custom integrations',
      'SLA guarantee',
    ],
  },
];
const Pricing = () => {
  return (
    <section id="pricing">
      <div className="app-container">
        <div>
          <p className="animate-slide-up mb-2 uppercase text-primary font-medium">
            Pricing
          </p>
          <h2 className="animate-slide-up">Simple, Clear Pricing</h2>
          <p className="animate-slide-up mt-1 w-full md:w-[50%]">
            Choose the plan that fits your business. Upgrade, downgrade, or
            cancel anytime.
          </p>
        </div>
        <div className="mt-8">
          <div className=" grid  gap-6 md:grid-cols-3 ">
            {PLANS.map(plan => (
              <div
                key={plan.name}
                className={clsx(
                  'relative flex flex-col rounded-2xl border p-8 bg-surface',
                  plan.highlighted
                    ? 'border-2 border-primary'
                    : 'border-border',
                )}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs">
                    Most Popular
                  </span>
                )}

                <h4>{plan.name}</h4>
                <p>{plan.tagline}</p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-text">
                    {plan.price}
                  </span>
                  <span className="text-sm text-text-muted">{plan.period}</span>
                </div>
                <Link href={plan.href}>
                  <Button
                    variant={plan.active ? 'primary' : 'secondary'}
                    disabled={!plan.active}
                    className={clsx(
                      'mt-6 w-full',
                      !plan.active && 'text-text-muted',
                    )}
                  >
                    {plan.active ? plan.cta : 'Coming Soon'}
                  </Button>
                </Link>

                <ul className="mt-8 flex flex-col gap-3">
                  {plan.features.map(feature => (
                    <li key={feature} className="flex items-center gap-2.5 p14">
                      <CircleCheck size={14} className="text-warning!" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
