import { Bot } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 border-t border-border">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-heading font-bold">
            <Bot className="w-5 h-5 text-primary" />
            <span>RPA<span className="text-primary">Dev</span></span>
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Muhammad Tayyab. Automating processes, one bot at a time.
          </p>
          
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground font-mono">Built with passion</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
