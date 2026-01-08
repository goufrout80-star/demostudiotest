'use client';

import { motion } from 'framer-motion';

const contactMethods = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Email',
    value: 'hello@studio.com',
    link: 'mailto:hello@studio.com',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    title: 'Phone',
    value: '+1 (555) 123-4567',
    link: 'tel:+15551234567',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Office',
    value: 'New York, NY 10012',
    link: '#',
  },
];

const socialLinks = [
  { name: 'Twitter', url: '#' },
  { name: 'Instagram', url: '#' },
  { name: 'LinkedIn', url: '#' },
  { name: 'Dribbble', url: '#' },
  { name: 'Behance', url: '#' },
];

export default function ContactInfo() {
  return (
    <section className="relative py-32 bg-[#0a0a0a] border-t border-[#222222]">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-20">
          {contactMethods.map((method, index) => (
            <motion.a
              key={index}
              href={method.link}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
              data-cursor-hover
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff4d4d]/5 to-[#00d4ff]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
              
              <div className="relative p-8 rounded-2xl bg-[#111111] border border-[#222222] group-hover:border-[#ff4d4d]/30 transition-all duration-500 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#ff4d4d]/10 text-[#ff4d4d] mb-4 group-hover:scale-110 transition-transform duration-300">
                  {method.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{method.title}</h3>
                <p className="text-[#888888] group-hover:text-white transition-colors duration-300">
                  {method.value}
                </p>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold mb-6">Follow Us</h3>
          <div className="flex justify-center gap-6">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.url}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="text-[#888888] hover:text-[#ff4d4d] transition-colors duration-300"
                data-cursor-hover
              >
                {social.name}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
