import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import TechStack from "@/components/TechStack";
import Certifications from "@/components/Certifications";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>RPA Developer Portfolio | Robotic Process Automation Expert</title>
        <meta 
          name="description" 
          content="Professional RPA Developer specializing in UiPath, Automation Anywhere, and Blue Prism. Building intelligent automation solutions that transform business processes." 
        />
        <meta name="keywords" content="RPA Developer, Robotic Process Automation, UiPath, Automation Anywhere, Blue Prism, Process Automation" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* First focusable element, so keyboard and screen-reader users can
            bypass the nav. Hidden until focused. WCAG 2.4.1 */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main" tabIndex={-1}>
          <Hero />
          <About />
          <Projects />
          <TechStack />
          <Certifications />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
