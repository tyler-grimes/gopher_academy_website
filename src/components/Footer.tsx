import Image from "next/image";
import { FacebookLogo, TwitterLogo, InstagramLogo, Envelope } from "@phosphor-icons/react/dist/ssr";
import { content } from "@/lib/content";

const icons = { Facebook: FacebookLogo, Twitter: TwitterLogo, Instagram: InstagramLogo, Email: Envelope };

export function Footer() {
  return (
    <footer className="border-t border-hairline px-6 py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4">
          <Image src="/logo-wide.png" alt="Gopher Academy" width={200} height={26} />
          <p className="text-sm text-muted">{content.serviceArea}. Licensed and insured.</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-5">
            {content.social.map((s) => {
              const Icon = icons[s.label as keyof typeof icons];
              if (!Icon) return null;
              return (
                <a key={s.label} href={s.href} aria-label={s.label} className="text-muted transition-colors hover:text-ink">
                  <Icon size={22} />
                </a>
              );
            })}
          </div>
          <p className="text-sm text-muted">{content.phone}</p>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl text-xs text-muted">© {new Date().getFullYear()} Gopher Academy.</p>
    </footer>
  );
}
