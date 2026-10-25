import Footer from "./components/Footer";
import Header from "./components/Header";
import Ticker from "./components/Ticker";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Ticker />
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}