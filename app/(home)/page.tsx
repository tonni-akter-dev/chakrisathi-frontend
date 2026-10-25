import { AppProvider } from "@/utils/AppContext";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import HowItWorks from "./components/HowItWorks";
import JobBoard from "./components/JobBoard";
import Testimonials from "./components/Testimonials";
import CTA from "./components/CTA";
import Pricing from "./components/Pricing";

export default function HomePage() {
  return (
    <AppProvider>
      <main>
        <Hero />
        <Categories />
        <JobBoard />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <CTA />
      </main>
    </AppProvider>
  );
}