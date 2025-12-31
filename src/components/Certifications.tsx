import { Award, ExternalLink, Calendar } from "lucide-react";

const certifications = [
  {
    name: "UiPath Academy Automation Developer Associate Training",
    issuer: "UiPath",
    date: "2024",
    credentialId: "UIPATH-RPA-2024",
    link: "https://credentials.uipath.com/d145b46c-c183-4d1c-8cd6-e9d5bf6f963b#acc.5ZVchSK0",
    logo: "🤖"
  },
  {
    name: "Automation Anywhere Essentials",
    issuer: "Automation Anywhere",
    date: "2024",
    credentialId: "AAESSE2024A360-116793813",
    link: "https://certificates.automationanywhere.com/cecaddee-4dd0-4aa4-96a2-d8c702d257cd#acc.Xyj5FrRN",
    logo: "⚡"
  },
  {
    name: "Automation Anywhere Advanced",
    issuer: "Automation Anywhere",
    date: "2024",
    credentialId: "AAESSE2024A360-114389703",
    link: "https://certificates.automationanywhere.com/c58e5075-cc0d-4025-9140-63a5c498f40a#acc.92ABixH1",
    logo: "🔷"
  },
  {
    name: "SQL (Basic) HackerRank",
    issuer: "HackerRank",
    date: "2025",
    credentialId: "64D04EF81D62",
    link: "https://www.hackerrank.com/certificates/iframe/64d04ef81d62",
    logo: "🔄"
  },
  {
    name: "Make Foundation",
    issuer: "Make.com",
    date: "2024",
    credentialId: "MK-2024",
    link: "https://www.credly.com/badges/65798286-2060-485a-af7f-14be16a9f9a8/public_url",
    logo: "📋"
  },
  {
    name: "Python",
    issuer: "Kaggle",
    date: "2023",
    credentialId: "KG-PY-2024",
    link: "",
    logo: "🐍"
  }
];

const Certifications = () => {
  return (
    <section id="certifications" className="py-20 px-4 md:px-8 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary font-mono text-sm tracking-wider uppercase">
            &lt;credentials /&gt;
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mt-4 mb-6">
            Certifications & <span className="text-primary">Achievements</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Professional certifications validating expertise in leading RPA platforms 
            and automation technologies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="group relative bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{cert.logo}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {cert.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">{cert.issuer}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{cert.date}</span>
                  </div>
                  <a
                    href={cert.link}
                    className="flex items-center gap-1 text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Verify</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="mt-2 font-mono text-xs text-muted-foreground/70 truncate">
                  ID: {cert.credentialId}
                </div>
              </div>

              <div className="absolute top-4 right-4">
                <Award className="w-5 h-5 text-primary/30 group-hover:text-primary transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
