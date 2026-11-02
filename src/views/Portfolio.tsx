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

function WorkItem({ project, lead }: { project: Project; lead: boolean }) {
  const isDemo = project.projectType === "product-demo";
  const title = <h2 className="work-title">{project.title}</h2>;

  return (
    <WorkLink href={project.externalUrl ?? `/project/${project.slug}`} className={lead ? "work-item work-item--lead" : "work-item"}>
      <div className={lead ? "work-cover blueprint sheet--accent" : "work-cover blueprint"}>
        <i className="corner tl" />
        <i className="corner tr" />
        <i className="corner bl" />
        <i className="corner br" />
        <ProjectCover slug={project.slug} />
      </div>
      {lead && title}
      <div>
        <p className="work-meta sheet-label">
          {isDemo ? "Demo" : "Case Study"} · {project.category} · {project.year}
        </p>
        {!lead && title}
        <p className="work-summary">{project.description}</p>
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
        {projects.map((project, i) => (
          <WorkItem key={project.id} project={project} lead={i === 0} />
        ))}
      </div>
    </PageShell>
  );
}
