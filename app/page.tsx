import { AppProvider } from "@/utils/AppContext";
import Ticker from "./home/components/Ticker";
import Header from "./home/components/Header";
import Hero from "./home/components/Hero";
import Categories from "./home/components/Categories";
import JobBoard from "./home/components/JobBoard";
import HowItWorks from "./home/components/HowItWorks";
import Testimonials from "./home/components/Testimonials";
import CTA from "./home/components/CTA";
import Footer from "./home/components/Footer";


export default function HomePage() {
  return (
    <AppProvider>
      <Ticker />
      <Header />
      <main>
        <Hero />
        <Categories />
        <JobBoard />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </AppProvider>
  );
}