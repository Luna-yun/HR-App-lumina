import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
//import { LogoMarquee } from "@/components/landing/LogoMarquee";//
import { Features } from "@/components/landing/Features";
import { EmployeeInfo } from "@/components/landing/EmployeeInfo";
import { SettingsOperations } from "@/components/landing/SettingsOperations";
import { Testimonials } from "@/components/landing/Testimonials";
//import { Spaces } from "@/components/landing/Spaces";//
import { FAQ } from "@/components/landing/FAQ";
//import { Contact } from "@/components/landing/Contact";//
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <EmployeeInfo />
        <SettingsOperations />
        <Testimonials />
        {/*<LogoMarquee />*/}
        {/*<Spaces />*/}
        <FAQ />
        {/*<Contact />*/}
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
