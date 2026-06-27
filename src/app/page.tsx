import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        {/* sections added in Tasks 4-7 */}
      </main>
      <Footer />
    </>
  );
}
