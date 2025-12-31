import { ArrowDown, Bot, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="section-container relative z-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-6 animate-fade-up">
          <Bot className="w-6 h-6 text-primary" />
          <span className="font-mono text-sm text-muted-foreground tracking-wider uppercase">Automation Engineer | RPA / IPA Engineer</span>
          <Workflow className="w-6 h-6 text-accent" />
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-6 animate-fade-up-delay-1">
          Hi, I'm <span className="gradient-text">Muhammad Tayyab</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-up-delay-2">
          Passionate about creating intuitive and impactful digital experiences, I specialize in Automation, Data Science, AI and Backend Development.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up-delay-3">
          <Button 
            size="lg" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold glow-border"
            onClick={scrollToProjects}
          >
            View My Work
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-border hover:bg-secondary hover:text-foreground"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            Get In Touch
          </Button>
        </div>
        
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-muted-foreground" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
