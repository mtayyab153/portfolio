import { Zap, Target, TrendingUp, Clock } from "lucide-react";

const stats = [
  { icon: Zap, value: "25+", label: "Automations Built" },
  { icon: Clock, value: "10K+", label: "Hours Saved" },
  { icon: TrendingUp, value: "95%", label: "Success Rate" },
  { icon: Target, value: "5+", label: "Clients Served" },
];

const About = () => {
  return (
    <section id="about" className="py-24 relative">
      <div className="section-container">
        <div className="text-center mb-16">
          <span className="font-mono text-sm text-primary tracking-wider uppercase">About Me</span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mt-4 mb-6">
            Automating the Future
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            I am an RPA Engineer currently working at Mercurial Minds , where I specialize in Intelligent 
            Automations and AI-Powered solutions. My goal is to bridge the gap between complex manual
            workflows and efficient, automated systems using cutting-edge tools like UiPath, 
            Power Automate, Automation Anywhere, Robot Framework, Python, and Low/No code tools.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-card border border-border rounded-xl p-6 text-center card-hover"
            >
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-4" />
              <div className="text-3xl font-heading font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-heading font-semibold">What I Do</h3>
            <p className="text-muted-foreground leading-relaxed">
              I transform complex, repetitive business processes into efficient automated workflows. 
              From data extraction and form processing to system integrations and report generation, 
              I leverage cutting-edge RPA tools to deliver solutions that scale.
            </p>
            <ul className="space-y-3">
              {[
                "Process analysis & automation roadmap design",
                "Bot development & deployment",
                "System integration & API connectivity",
                "Performance monitoring & optimization",
                "BackEnd Development using Python"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-secondary to-card border border-border rounded-2xl p-8">
              <div className="font-mono text-sm text-primary mb-4">// automation_bot.py</div>
              <pre className="text-sm text-muted-foreground overflow-x-auto">
                <code>{`def automate_workflow():
    # Connect to systems
    init_rpa_engine()
    
    # Process data
    for task in get_queue():
        extract_data(task)
        validate_inputs()
        execute_actions()
        
    # Generate report
    create_summary()
    notify_stakeholders()`}</code>
              </pre>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
