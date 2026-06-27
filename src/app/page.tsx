import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Stakes } from "@/components/Stakes";
import { PromiseSection } from "@/components/Promise";
import { Methods } from "@/components/Methods";
import { Pricing } from "@/components/Pricing";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <Stakes />
        <PromiseSection />
        <Methods />
        <Pricing />
        {/* sections added in Tasks 6-7 */}
      </main>
      <Footer />
    </>
  );
}
