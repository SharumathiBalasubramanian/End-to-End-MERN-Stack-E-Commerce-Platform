import React, { useState } from "react";
import { FiMail, FiMapPin, FiClock, FiSend, FiCheckCircle } from "react-icons/fi";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Your full name is required.";
    if (!form.email.trim()) errs.email = "Your email address is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Please enter a valid email format.";
    if (!form.message.trim() || form.message.length < 10)
      errs.message = "Message must be at least 10 characters long.";
    return errs;
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-14 md:py-20">
      {/* Editorial Header */}
      <div className="max-w-2xl mb-12">
        <span className="text-xs uppercase tracking-widest text-[#D95D39] font-bold block mb-2">
          Support & Inquiries
        </span>
        <h1 className="font-serif-hero text-4xl sm:text-5xl text-gray-900 font-medium leading-tight">
          We’re here to help with your orders and questions.
        </h1>
        <p className="text-sm text-gray-500 mt-3 leading-relaxed">
          Have an inquiry regarding shipping, returns, or technical specifications? Reach out and our team will get back to you within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Direct Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs">
            <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-gray-200/70 flex items-center justify-center text-[#D95D39] mb-4">
              <FiMail size={18} />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Email Customer Care</h3>
            <p className="text-xs text-gray-400 mt-1">For order modifications, feedback, and general questions.</p>
            <a href="mailto:support@marketandco.com" className="text-xs font-semibold text-gray-800 hover:text-[#D95D39] mt-2 inline-block transition">
              support@marketandco.com
            </a>
          </div>

          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs">
            <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-gray-200/70 flex items-center justify-center text-[#D95D39] mb-4">
              <FiClock size={18} />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Operating Hours</h3>
            <p className="text-xs text-gray-400 mt-1">Dedicated logistics and support desk timing.</p>
            <p className="text-xs font-medium text-gray-700 mt-2">
              Monday – Friday: 9:00 AM – 6:00 PM IST
            </p>
          </div>

          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs">
            <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-gray-200/70 flex items-center justify-center text-[#D95D39] mb-4">
              <FiMapPin size={18} />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Fulfillment Hub</h3>
            <p className="text-xs text-gray-400 mt-1">Standard warehouse dispatch origin.</p>
            <p className="text-xs font-medium text-gray-700 mt-2">
              Plot 42, Industrial Zone, Bengaluru, KA 560001
            </p>
          </div>
        </div>

        {/* Right Column: Clean Form Container */}
        <div className="lg:col-span-7 bg-white border border-gray-200/90 rounded-3xl p-8 sm:p-10 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Send a Message</h2>
          <p className="text-xs text-gray-400 mb-6">Fill out the fields below and our logistics support team will reply via email.</p>

          {submitted && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-xs font-medium">
              <FiCheckCircle size={16} className="shrink-0 text-emerald-600" />
              <span>Thank you! Your inquiry has been dispatched. We will reply within 24 hours.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Full Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Alex Henderson"
                className={`w-full bg-[#FAF8F5] border rounded-xl px-4 py-3 text-xs outline-none transition focus:bg-white ${
                  errors.name ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-gray-400"
                }`}
              />
              {errors.name && <p className="text-red-500 text-[11px] mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="e.g. alex@example.com"
                className={`w-full bg-[#FAF8F5] border rounded-xl px-4 py-3 text-xs outline-none transition focus:bg-white ${
                  errors.email ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-gray-400"
                }`}
              />
              {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                How Can We Help?
              </label>
              <textarea
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder="Describe your inquiry, order ID, or product issue in detail..."
                className={`w-full bg-[#FAF8F5] border rounded-xl px-4 py-3 text-xs outline-none transition focus:bg-white resize-none ${
                  errors.message ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-gray-400"
                }`}
              />
              {errors.message && <p className="text-red-500 text-[11px] mt-1">{errors.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-[#1A1A1A] hover:bg-black text-white text-xs font-medium py-3.5 rounded-full transition active:scale-[0.99] shadow-2xs flex items-center justify-center gap-2"
            >
              <FiSend size={13} />
              <span>Send Inquiry</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;