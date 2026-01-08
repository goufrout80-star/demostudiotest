'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import MagneticButton from '@/components/ui/MagneticButton';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    budget: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="relative py-32 bg-[#0a0a0a]">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <motion.form
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-3 text-[#cccccc]">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-[#111111] border border-[#222222] rounded-xl text-white placeholder-[#666666] focus:border-[#ff4d4d] focus:outline-none transition-colors duration-300"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-3 text-[#cccccc]">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-[#111111] border border-[#222222] rounded-xl text-white placeholder-[#666666] focus:border-[#ff4d4d] focus:outline-none transition-colors duration-300"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="company" className="block text-sm font-medium mb-3 text-[#cccccc]">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-[#111111] border border-[#222222] rounded-xl text-white placeholder-[#666666] focus:border-[#ff4d4d] focus:outline-none transition-colors duration-300"
                  placeholder="Your Company"
                />
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm font-medium mb-3 text-[#cccccc]">
                  Project Budget
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-[#111111] border border-[#222222] rounded-xl text-white focus:border-[#ff4d4d] focus:outline-none transition-colors duration-300"
                >
                  <option value="">Select budget range</option>
                  <option value="5k-10k">$5,000 - $10,000</option>
                  <option value="10k-25k">$10,000 - $25,000</option>
                  <option value="25k-50k">$25,000 - $50,000</option>
                  <option value="50k+">$50,000+</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-3 text-[#cccccc]">
                Project Details *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-[#111111] border border-[#222222] rounded-xl text-white placeholder-[#666666] focus:border-[#ff4d4d] focus:outline-none transition-colors duration-300 resize-none"
                placeholder="Tell us about your project..."
              />
            </div>

            <div className="flex items-center gap-4">
              <MagneticButton type="submit" variant="primary" className="px-12 py-4">
                Send Message
              </MagneticButton>
              <p className="text-sm text-[#888888]">
                We will respond within 24 hours
              </p>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
