"use client";
import { useState } from "react";
import Image from "next/image";
import { List, X } from "@phosphor-icons/react";
import { content } from "@/lib/content";

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-bg/80 backdrop-blur">
      <nav className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-6">
        <a href="#top" className="shrink-0">
          <Image src="/logo-wide.png" alt="Gopher Academy" width={180} height={24} priority />
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {content.nav.map((i) => (
            <a key={i.href} href={i.href} className="text-sm text-muted transition-colors hover:text-ink">
              {i.label}
            </a>
          ))}
          <a
            href={content.cta.href}
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover"
          >
            {content.cta.label}
          </a>
        </div>
        <button type="button" className="md:hidden" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <List size={24} />}
        </button>
      </nav>
      {open && (
        <div className="flex flex-col gap-4 border-t border-hairline px-6 py-6 md:hidden">
          {content.nav.map((i) => (
            <a key={i.href} href={i.href} className="text-muted" onClick={() => setOpen(false)}>
              {i.label}
            </a>
          ))}
          <a href={content.cta.href} className="rounded-full bg-accent px-5 py-3 text-center text-on-accent" onClick={() => setOpen(false)}>
            {content.cta.label}
          </a>
        </div>
      )}
    </header>
  );
}
