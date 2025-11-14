"use client";

import { useState, FormEvent } from "react";
import TextField from "@/components/ui/TextField";
import Button from "@/components/ui/Button";

const offices = [
  { city: "Ho Chi Minh City", info: "45 Le Loi Street, District 1, Vietnam" },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string | null;
  }>({ type: "idle", message: null });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic validation
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({
        type: "error",
        message: "Please fill in all required fields.",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setStatus({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "idle", message: null });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus({
          type: "error",
          message:
            data.error || "Something went wrong. Please try again later.",
        });
        return;
      }

      setStatus({
        type: "success",
        message:
          data.message ||
          "Thank you for your message! We'll get back to you soon.",
      });

      // Reset form
      setForm({
        name: "",
        email: "",
        company: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form error:", error);
      setStatus({
        type: "error",
        message: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center">
          <span className="rounded-full border border-white/15 px-4 py-1 text-xs uppercase tracking-widest text-slate-300">
            Contact us
          </span>
          <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">
            Let&apos;s talk about your documents
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            Sales, partnerships, press—whatever you&apos;re working on,
            we&apos;d love to hear it.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-3xl border border-white/10 bg-slate-900/60 p-6"
          >
            {status.type !== "idle" && status.message && (
              <div
                className={`rounded-2xl border px-4 py-3 text-sm ${
                  status.type === "success"
                    ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-100"
                    : "border-red-400/40 bg-red-500/10 text-red-100"
                }`}
              >
                {status.message}
              </div>
            )}

            <TextField
              id="name"
              name="name"
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              required
              disabled={isSubmitting}
            />
            <TextField
              id="email"
              name="email"
              type="email"
              label="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="your@email.com"
              autoComplete="email"
              required
              disabled={isSubmitting}
            />
            <TextField
              id="company"
              name="company"
              label="Company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="Your company"
              disabled={isSubmitting}
            />
            <TextField
              id="message"
              name="message"
              label="Message"
              multiline
              rows={6}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Your message..."
              required
              disabled={isSubmitting}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send message"}
            </Button>
          </form>
          <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6">
              <h3 className="text-xl font-semibold text-white">Offices</h3>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.3195099999997!2d106.6994!3d10.7769!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3a8d19e50d%3A0x9c4e8a8d8a8d8a8d!2s45%20L%C3%AA%20L%E1%BB%A3i%2C%20B%E1%BA%BFn%20Ngh%C3%A9%2C%20Qu%E1%BA%ADn%201%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh%2C%20Vietnam!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full rounded-2xl"
                title="Office Location - 45 Le Loi Street, District 1, Ho Chi Minh City"
              />
              <div className="space-y-3 text-sm text-slate-300">
                {offices.map((office) => (
                  <div key={office.city}>
                    <p className="font-semibold">{office.city}</p>
                    <p>{office.info}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6">
              <h3 className="text-xl font-semibold text-white">
                Direct contacts
              </h3>
              <p className="mt-3 text-sm text-slate-300">
                dangtiendung.ai@outlook.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
