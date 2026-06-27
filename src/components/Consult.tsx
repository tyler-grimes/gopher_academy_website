"use client";
import { useState } from "react";
import { Section } from "./Section";

const acreages = ["Under 5 acres", "5-20 acres", "20-50 acres", "50+ acres"];

const field = "mt-2 w-full rounded-xl border border-hairline bg-surface px-4 py-3 text-ink outline-none placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/30";
const label = "text-sm font-medium text-ink";

export function Consult() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        const j = await res.json().catch(() => ({ errors: {} }));
        setErrors(j.errors ?? {});
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <Section id="consult" className="border-t border-hairline">
        <div className="mx-auto max-w-xl rounded-xl border border-accent bg-surface p-10 text-center">
          <h2 className="text-2xl font-medium text-ink">Request received.</h2>
          <p className="mt-3 text-muted">We will walk your property and send a plan within a few days. Talk soon.</p>
        </div>
      </Section>
    );
  }

  return (
    <Section id="consult" className="border-t border-hairline">
      <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <div>
          <h2 className="text-3xl font-medium leading-tight tracking-tight text-ink md:text-5xl">Request a consultation.</h2>
          <p className="mt-6 max-w-[45ch] text-lg leading-relaxed text-muted">
            Tell us about your property. We walk it, map the activity, and send a plan within a few days.
          </p>
        </div>
        <form onSubmit={onSubmit} className="grid gap-5" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={label}>Name</label>
              <input id="name" name="name" className={field} placeholder="Your name" />
              {errors.name && <p className="mt-1.5 text-sm text-accent">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="estate" className={label}>Estate / vineyard</label>
              <input id="estate" name="estate" className={field} placeholder="Property name" />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className={label}>Email</label>
              <input id="email" name="email" type="email" className={field} placeholder="you@estate.com" />
              {errors.email && <p className="mt-1.5 text-sm text-accent">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="phone" className={label}>Phone</label>
              <input id="phone" name="phone" className={field} placeholder="Optional" />
            </div>
          </div>
          <div>
            <label htmlFor="acreage" className={label}>Approximate acreage</label>
            <select id="acreage" name="acreage" className={field} defaultValue="">
              <option value="" disabled>Select a range</option>
              {acreages.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="message" className={label}>What are you seeing?</label>
            <textarea id="message" name="message" rows={4} className={field} placeholder="Mounds, where, how long" />
          </div>
          {status === "error" && !errors.name && !errors.email && (
            <p className="text-sm text-accent">Something went wrong. Please try again or call us.</p>
          )}
          <button type="submit" disabled={status === "submitting"} className="justify-self-start rounded-full bg-accent px-7 py-3 font-medium text-on-accent transition-colors hover:bg-accent-hover active:scale-[0.98] disabled:opacity-60">
            {status === "submitting" ? "Sending..." : "Request a consultation"}
          </button>
        </form>
      </div>
    </Section>
  );
}
