import { useState } from "react";
import Reveal from "../components/Reveal.jsx";
import { validateEmail } from "../utils/emailValidation.js";

export default function ContactUs({ onBack }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextEmailError = validateEmail(formData.email);
    setEmailError(nextEmailError);
    if (formData.name && !nextEmailError && formData.message) {
      setSubmitted(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "email" && emailError) setEmailError("");
  };

  return (
    <div className="pt-36 sm:pt-40 lg:pt-44 pb-24">
      {/* HERO SECTION */}
      <Reveal className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop mb-16">
        {/* Back button */}
        <button
          className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors mb-8 cursor-pointer"
          onClick={onBack}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">
            chevron_left
          </span>
          Back to home
        </button>

        <div className="space-y-4 max-w-2xl">
          <div className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 font-label-md uppercase tracking-[0.2em] text-[10px]">
            GET IN TOUCH
          </div>
          <h1 className="font-display-lg text-4xl sm:text-5xl md:text-6xl text-on-surface leading-tight">
            Contact Us
          </h1>
          <div className="space-y-2 text-on-surface-variant text-base sm:text-lg leading-relaxed">
            <p className="text-on-surface font-medium text-xl">
              We&apos;d love to hear from you.
            </p>
            <p>
              Have a question, feedback, or need help choosing the perfect
              bottle?
            </p>
            <p>Our team is here to help.</p>
          </div>
        </div>
      </Reveal>

      {/* MAIN SECTION: 2 COLUMNS */}
      <Reveal className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT: GET IN TOUCH CARDS */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="font-headline-sm text-2xl text-on-surface">
              Get in Touch
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone Card */}
              <div className="glass-panel rounded-2xl border border-outline-variant/30 bg-surface-container/60 p-6 space-y-3 transition-all duration-300 hover:border-primary/50 hover:bg-surface-container-high/80">
                <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-2xl">
                    call
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-on-surface text-base">Phone</h3>
                  <p className="text-on-surface-variant text-sm font-medium mt-1">
                    +61 2 1234 5678
                  </p>
                  <p className="text-xs text-outline mt-1">
                    Mon – Fri: 9AM – 6PM AEST
                  </p>
                </div>
              </div>

              {/* Email Card */}
              <div className="glass-panel rounded-2xl border border-outline-variant/30 bg-surface-container/60 p-6 space-y-3 transition-all duration-300 hover:border-primary/50 hover:bg-surface-container-high/80">
                <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-2xl">
                    mail
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-on-surface text-base">Email</h3>
                  <p className="text-on-surface-variant text-sm font-medium mt-1 break-all">
                    hello@sipnow.com.au
                  </p>
                  <p className="text-xs text-outline mt-1">
                    We aim to reply within 24 hours
                  </p>
                </div>
              </div>

              {/* Address Card */}
              <div className="glass-panel rounded-2xl border border-outline-variant/30 bg-surface-container/60 p-6 space-y-3 transition-all duration-300 hover:border-primary/50 hover:bg-surface-container-high/80">
                <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-2xl">
                    location_on
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-on-surface text-base">
                    Address
                  </h3>
                  <p className="text-on-surface-variant text-sm font-medium mt-1">
                    123 Drink Street,
                  </p>
                  <p className="text-on-surface-variant text-sm font-medium">
                    Sydney NSW 2000,
                  </p>
                  <p className="text-on-surface-variant text-sm font-medium">
                    Australia
                  </p>
                </div>
              </div>

              {/* Live Chat Card */}
              <div className="glass-panel rounded-2xl border border-outline-variant/30 bg-surface-container/60 p-6 space-y-3 transition-all duration-300 hover:border-primary/50 hover:bg-surface-container-high/80">
                <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-2xl">
                    chat_bubble
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-on-surface text-base">
                    Live Chat
                  </h3>
                  <p className="text-on-surface-variant text-sm font-medium mt-1">
                    Chat with our team
                  </p>
                  <p className="text-xs text-outline mt-1">
                    Available on website
                  </p>
                  <p className="text-xs text-outline">
                    Mon – Fri: 9AM – 6PM AEST
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: SEND US A MESSAGE FORM */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-headline-sm text-2xl text-on-surface">
              Send us a Message
            </h2>

            {submitted ? (
              <div className="glass-panel rounded-3xl border border-primary/40 bg-primary/10 p-8 text-center space-y-4">
                <div className="h-16 w-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto text-3xl">
                  <span className="material-symbols-outlined text-4xl">
                    check_circle
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-on-surface">
                  Message Sent Successfully!
                </h3>
                <p className="text-on-surface-variant max-w-md mx-auto">
                  Thank you for reaching out to SipNow. We have received your
                  inquiry and our team will respond within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: "",
                      email: "",
                      subject: "",
                      message: "",
                    });
                  }}
                  className="primary-gradient rounded-full px-6 py-2.5 text-sm font-label-md text-white mt-4 cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Your Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant block">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full bg-surface-container-low border rounded-xl px-4 py-3 text-on-surface placeholder:text-outline/70 focus:outline-none transition-colors ${emailError ? "border-error focus:border-error" : "border-outline-variant/40 focus:border-primary"}`}
                    />
                    {emailError && (
                      <p className="text-xs text-error">{emailError}</p>
                    )}
                  </div>

                  {/* Your Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant block">
                      Your Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-on-surface placeholder:text-outline/70 focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant block">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-on-surface placeholder:text-outline/70 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant block">
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Type your message here..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-on-surface placeholder:text-outline/70 focus:border-primary focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2 space-y-4">
                  <button
                    type="submit"
                    className="primary-gradient group flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-label-md text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <span>SEND MESSAGE</span>
                    <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </button>

                  <div className="flex items-center gap-2 text-xs text-on-surface-variant/80">
                    <span className="material-symbols-outlined text-[16px] text-primary">
                      shield
                    </span>
                    <span>
                      Your information is safe with us. We respect your privacy.
                    </span>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
