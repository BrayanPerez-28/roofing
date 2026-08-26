'use client';

/**
 * components/contact/ContactForm.tsx
 *
 * Glassmorphism contact form migrated from contact_us/code.html.
 * Fields: First Name, Last Name, Email, Inquiry Type, Project Details
 * Submits via services/api.js → submitContactForm()
 * Shows success/error state with Framer Motion transitions.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { submitContactForm } from '@/services/api';

type FormState = 'idle' | 'loading' | 'success' | 'error';

interface FormData {
  firstName:   string;
  lastName:    string;
  email:       string;
  phone:       string;
  inquiryType: string;
  message:     string;
}

const inputClasses =
  'glass-input rounded-md px-4 py-3 font-body-md text-body-md w-full';

const labelClasses =
  'font-label-md text-label-md text-tertiary uppercase tracking-wider';

export default function ContactForm() {
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [data, setData] = useState<FormData>({
    firstName:   '',
    lastName:    '',
    email:       '',
    phone:       '',
    inquiryType: '',
    message:     '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');
    setErrorMessage('');

    try {
      await submitContactForm(data);
      setFormState('success');
    } catch (err: any) {
      setFormState('error');
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <AnimatePresence mode="wait">
      {formState === 'success' ? (
        // ── Success State ──
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 rounded-xl flex flex-col items-center justify-center text-center gap-6 min-h-[400px]"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          >
            <CheckCircle size={64} className="text-primary" />
          </motion.div>
          <h3 className="font-headline-md text-headline-md text-on-surface">
            Message Transmitted
          </h3>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-sm">
            Our engineering team will review your request and respond within 24 hours.
          </p>
          <button
            onClick={() => { setFormState('idle'); setData({ firstName:'', lastName:'', email:'', phone:'', inquiryType:'', message:'' }); }}
            className="btn-secondary font-button text-button px-6 py-3 rounded-md mt-4"
          >
            Submit Another Request
          </button>
        </motion.div>
      ) : (
        // ── Form State ──
        <motion.form
          key="form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="glass-card p-8 rounded-xl flex flex-col gap-6"
          noValidate
          id="contact-form"
        >
          {/* Name Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="firstName" className={labelClasses}>First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                autoComplete="given-name"
                placeholder="John"
                value={data.firstName}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="lastName" className={labelClasses}>Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                autoComplete="family-name"
                placeholder="Doe"
                value={data.lastName}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className={labelClasses}>Corporate Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="john.doe@company.com"
              value={data.email}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className={labelClasses}>Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+1 (555) 000-0000"
              value={data.phone}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="inquiryType" className={labelClasses}>Inquiry Type</label>
            <select
              id="inquiryType"
              name="inquiryType"
              value={data.inquiryType}
              onChange={handleChange}
              className={`${inputClasses} appearance-none cursor-pointer`}
            >
              <option value="">— Select a service —</option>
              <option value="Composition Shingles">Composition Shingles</option>
              <option value="Concrete Tile">Concrete Tile</option>
              <option value="Flat Roof (PVC/TPO)">Flat Roof (PVC/TPO)</option>
              <option value="Standing Seam Metal">Standing Seam Metal</option>
              <option value="Wood Shingles">Wood Shingles</option>
              <option value="Roof Repairs">Roof Repairs</option>
              <option value="Gutters & Downspouts">Gutters &amp; Downspouts</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Message */}
          <div className="flex flex-col gap-2">
            <label htmlFor="message" className={labelClasses}>Project Details</label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              placeholder="Provide structural requirements, project scope, or assessment needs..."
              value={data.message}
              onChange={handleChange}
              className={`${inputClasses} resize-none`}
            />
          </div>

          {/* Error Message */}
          {formState === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 rounded-lg bg-error-container/20 border border-error/30 text-error"
            >
              <AlertCircle size={18} />
              <span className="font-body-md text-body-md text-sm">{errorMessage}</span>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={formState === 'loading'}
            className="btn-primary-dark w-full py-4 rounded-md font-button text-button flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: formState === 'loading' ? 1 : 1.02 }}
            whileTap={{ scale: formState === 'loading' ? 1 : 0.98 }}
            id="contact-submit-btn"
          >
            {formState === 'loading' ? (
              <>
                <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Transmitting...
              </>
            ) : (
              <>
                <span>Transmit Message</span>
                <Send size={16} />
              </>
            )}
          </motion.button>

          <p className="font-body-md text-body-md text-on-surface-variant text-xs text-center">
            By submitting, you agree to our Privacy Policy. No spam — ever.
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

