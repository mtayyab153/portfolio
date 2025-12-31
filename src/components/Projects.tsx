import { ExternalLink, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "Intent Classification App",
    description: "Designed and deployed a text classification solution by training and optimizing a Scikit-learn model on a custom dataset. Applied feature engineering techniques such as tokenization and vectorization to transform raw text into meaningful numerical representations before training the model using classical machine learning algorithms. Evaluated model performance with multiple metrics, including accuracy, precision, recall, and F1-score, and documented key limitations and edge cases related to domain-specific text and data imbalance. Integrated the model into a FastAPI service with prediction and health-check endpoints, and containerized the complete application using Docker for consistent and scalable deployment environments.",
    tags: ["Python", "Sickit Learn", "Fast Api", "Pandas"],
    impact: "Built and deployed a scalable intent classification ML service",
    githubUrl: "https://github.com/mtayyab153/intent_classification_api"
  },
  {
    title: "Todo Management REST API",
    description: "Developed a secure Todo application with well-structured REST endpoints, proper exception handling, and accurateHTTP response codes. Integrated a relational database with support for schema changes through a data migrationtool. Implemented strong request/response validation and JWT-based authentication with role-based authorization, including admin-exclusive operations. Added complete automated test coverage for all endpoints to ensure reliability and data integrity.",
    tags: ["Python", "Fast Api", "SQL Alchemy", "Alembic"],
    impact: "Delivered a secure, scalable, and well-tested REST API",
    githubUrl: "https://github.com/mtayyab153/Python/tree/main/Fast%20API/Project%205%20Todo%20App%20Full%20Stack"
  },
  {
    title: "Invoice Processing Bot",
    description: "This process systematically extracts all required information from the source document and accurately records it into the designated portal. Each record is processed individually in a sequential manner to ensure data integrity, precise entry, and complete traceability. By validating and logging each entry one by one, the process minimizes errors, maintains consistency, and enables reliable tracking throughout the entire workflow.",
    tags: ["RPA", "OCR", "SAP", "Excel"],
    impact: "Reduced processing time by 85%",
    githubUrl: "https://github.com/mtayyab153"
  },
  {
    title: "RAG-Based Document QA System",
    description: "Built a retrieval-augmented Q&A application that processes PDF document, chunks and embeds content for semantic search, stores vectors in vector database, and generates answers by retrieving relevant information during user queries.",
    tags: ["Python", "Langchain", "Gemini", "Pinecone"],
    impact: "Improved security operations by automating threat blocking and incident reporting",
    githubUrl: "https://github.com/mtayyab153/Python/tree/main/iNueron%20Gen%20Ai/6_chroma_db"
  },
  {
    title: "Blocking Malicious IP, Domains and Hashes",
    description: "The process begins with receiving an email containing malicious IPs, domains, and file hashes. These indicators are extracted and stored in a database with an initial status of 'To Work'. Each item is then processed for blocking across the respective security portals. Based on the outcome, their statuses are updated to 'Completed' or 'Failed'. Failed entries are then retried when it is triggered again. At the end of the day, a comprehensive report is generated and sent to the client.",
    tags: ["RPA", "Email", "Oracle", "Reporting"],
    impact: "Enhanced document understanding through accurate, context-aware question answering",
    githubUrl: "https://github.com/mtayyab153"
  },
  {
    title: "Employee Resignation Alerts",
    description: "The process begins with an email containing details of an employee intending to resign. The process updates the employee's record by setting the specified end date. Once the end date is reached, the employee's account is disabled to ensure proper offboarding and access control.",
    tags: ["RPA", "Oracle", "DB", "Email"],
    impact: "Ensured timely offboarding and access control with zero manual intervention",
    githubUrl: "https://github.com/mtayyab153"
  },
  {
    title: "Bank Statement",
    description: "This process involves retrieving ticket data from the Customer Portal, including details such as ticket number, CNIC, email, name, and statement duration (from and to dates). Based on this information, the bot downloads the customer's statement from another portal and sends it directly to the customer, ensuring timely and accurate service delivery. And logs are dumped to excel file.",
    tags: ["RPA", "CSCP", "Excel", "BOP"],
    impact: "Improved customer response time by automating end-to-end statement delivery",
    githubUrl: "https://github.com/mtayyab153"
  },
  {
    title: "CIM Process",
    description: "The CIM (Customer Identity Management) process involves managing user accounts across Active Directory and two banking portals. Key tasks include enabling and disabling user IDs, creating new users, resetting passwords, and ensuring consistent access control across all systems. The process helps maintain secure and efficient user lifecycle management within the organization.",
    tags: ["RPA", "Oracle", "Excel", "CIM"],
    impact: "Strengthened security and consistency by automating user lifecycle management across multiple systems",
    githubUrl: "https://github.com/mtayyab153"
  },
  {
    title: "Dormant Account Activation",
    description: "The process is initiated when a scanned PDF is placed on a shared path by the Process Owner. A bot reads and extracts data from the PDF, performs pre-checks on the portal related to the user's account, and removes any dormancy if applicable. The bot then updates the Process Owner with the status and logs the details into a database for tracking and auditing purpose.",
    tags: ["RPA", "Oracle", "DB", "OCR"],
    impact: "Accelerated account reactivation by automating PDF processing and validation workflows",
    githubUrl: "https://github.com/mtayyab153"
  },
];

const Projects = () => {
  const handleGitHubClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <section id="projects" className="py-24 bg-secondary/30">
      <div className="section-container">
        <div className="text-center mb-16">
          <span className="font-mono text-sm text-primary tracking-wider uppercase">Portfolio</span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mt-4 mb-6">
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A selection of automation solutions I've designed and implemented for clients 
            across various industries.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <article 
              key={index}
              className="group bg-card border border-border rounded-xl p-6 card-hover flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <Folder className="w-10 h-10 text-primary" />
                {project.githubUrl && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleGitHubClick(project.githubUrl!)}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <h3 className="text-xl font-heading font-semibold mb-3 group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              
              <p className="text-muted-foreground text-base mb-4 flex-grow">
                {project.description}
              </p>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="tech-badge text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-border">
                  <span className="text-sm font-medium text-primary">{project.impact}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
