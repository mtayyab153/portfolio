const technologies = {
  "RPA Platforms": [
    "UiPath",
    "RoboCorp",
    "Automation Anywhere",
    "Power Automate",
  ],
  "Programming": [
    "Python",
    "JavaScript",
    "JAVA",
    "SQL",
    "CPP",
  ],
  "Integration": [
    "REST APIs",
    "Maria DB",
    "Vector Databases",
    "SQL Server",
  ],
  "Tools & Other": [
    "Fast API",
    "Generative AI",
    "RAG Applications",
    "Git",
    "Sickit Learn",
    "Github",
    "Docker",
    "Jenkins",
    "N8N",
    "Make.com",
    "ITOP",
    "Linux"
  ],
};

const TechStack = () => {
  return (
    <section id="skills" className="py-24">
      <div className="section-container">
        <div className="text-center mb-16">
          <span className="font-mono text-sm text-primary tracking-wider uppercase">Skills</span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mt-4 mb-6">
            Tech Stack
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The tools and technologies I use to bring automation solutions to life.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(technologies).map(([category, techs]) => (
            <div key={category} className="space-y-4">
              <h3 className="font-heading font-semibold text-lg border-b border-border pb-2">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {techs.map((tech) => (
                  <span key={tech} className="tech-badge">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-border rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-heading font-bold gradient-text mb-2">2+</div>
              <div className="text-muted-foreground">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-heading font-bold gradient-text mb-2">5+</div>
              <div className="text-muted-foreground">Certifications</div>
            </div>
            <div>
              <div className="text-4xl font-heading font-bold gradient-text mb-2">100%</div>
              <div className="text-muted-foreground">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
