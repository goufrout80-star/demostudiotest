'use client';

import { motion } from 'framer-motion';
import MagneticButton from '@/components/ui/MagneticButton';

const plans = [
  {
    name: 'Starter',
    price: '5,000',
    description: 'Perfect for small businesses and startups looking to establish their digital presence.',
    features: [
      'Custom Website Design',
      'Responsive Development',
      'Basic SEO Setup',
      'Content Management System',
      '3 Months Support',
    ],
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '15,000',
    description: 'Ideal for growing businesses that need advanced features and integrations.',
    features: [
      'Everything in Starter',
      'Advanced Animations',
      'E-commerce Integration',
      'Custom Functionality',
      'Performance Optimization',
      '6 Months Support',
    ],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Tailored solutions for large organizations with complex requirements.',
    features: [
      'Everything in Professional',
      'Dedicated Team',
      'Custom Integrations',
      'Advanced Analytics',
      'Priority Support',
      '12 Months Support',
    ],
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section className="relative py-32 bg-[#0a0a0a]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-[#ff4d4d] text-sm uppercase tracking-[0.3em] font-medium mb-6"
          >
            Pricing
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter"
          >
            Investment
            <br />
            <span className="text-gradient">Options</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative group ${plan.highlighted ? 'md:-mt-8' : ''}`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#ff4d4d] text-white text-xs uppercase tracking-wider rounded-full">
                  Most Popular
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-br from-[#ff4d4d]/10 to-[#00d4ff]/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
              
              <div className={`relative p-8 rounded-3xl border transition-all duration-500 h-full flex flex-col ${
                plan.highlighted
                  ? 'bg-[#111111] border-[#ff4d4d]/50'
                  : 'bg-[#0a0a0a] border-[#222222] group-hover:border-[#ff4d4d]/30'
              }`}>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-gradient">
                    {plan.price === 'Custom' ? plan.price : `$${plan.price}`}
                  </span>
                  {plan.price !== 'Custom' && (
                    <span className="text-[#888888] text-sm ml-2">starting</span>
                  )}
                </div>
                <p className="text-[#888888] mb-8 flex-grow">{plan.description}</p>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-[#ff4d4d] flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm text-[#cccccc]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <MagneticButton
                  variant={plan.highlighted ? 'primary' : 'outline'}
                  className="w-full justify-center"
                >
                  Get Started
                </MagneticButton>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
