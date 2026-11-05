import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from '@/lib/router-compat';
import PageShell from "../components/PageShell";
import ProjectCover from "../components/ProjectCover";
import { projects } from "../data/projects";
import type { Project } from "../types";

function isInternalRoute(url: string) {
  return url.startsWith("/");
}

function WorkLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  return isInternalRoute(href) ? (
    <Link to={href} className={className}>
      {children}
    </Link>
  ) : (
    <a href={href} className={className} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

// Each project sets its own composition in styles.css, keyed by its slug.
function WorkItem({ project }: { project: Project }) {
  const isDemo = project.projectType === "product-demo";

  return (
    <WorkLink href={project.externalUrl ?? `/project/${project.slug}`} className={`work-item work-item--${project.slug}`}>
      <div className="work-cover blueprint">
        <i className="corner tl" />
        <i className="corner tr" />
        <i className="corner bl" />
        <i className="corner br" />
        <ProjectCover slug={project.slug} />
      </div>
      <h2 className="work-title">{project.title}</h2>
      <div className="work-copy">
        <p className="work-summary">{project.description}</p>
        <p className="work-meta sheet-label">
          {isDemo ? "Demo" : "Case Study"} · {project.category} · {project.year}
        </p>
        <span className="work-action sheet-label">
          {isDemo ? "Open the demo" : "Read the case study"}
          <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
        </span>
      </div>
    </WorkLink>
  );
}

export default function Portfolio() {
  return (
    <PageShell sheetRef="Box 02 / Sheet 03 of 04" title="Portfolio">
      <p className="sheet-body">
        A collection of work spanning case studies, demo products, and market explorations. These projects reflect
        the problems I find most pressing and the trends I think are worth paying attention to.
      </p>

      <div className="work-list">
        {projects.map((project) => (
          <WorkItem key={project.id} project={project} />
        ))}
      </div>
    </PageShell>
  );
}
