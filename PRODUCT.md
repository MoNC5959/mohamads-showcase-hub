# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Hiring managers and recruiters evaluating Mohamad Noor-Chowdhury for Product Owner and Product Manager roles. They arrive from a résumé, LinkedIn, or an application, skim the portfolio, and open one or two pieces to judge how he thinks, writes, and breaks down a market.

## Product Purpose

A personal showcase hub: a home page, portfolio index, about page, contact page, one product demo (Cognitive QA), and a series of long-form editorial articles on fintech, payments, tokenization, sports media, and gaming. Success is a hiring manager reading a piece through to the end and understanding its argument.

## Positioning

Each article is a self-contained piece of analysis written and designed by the candidate, with its own visual world, rather than a generic blog template. The work itself is the evidence of product judgment.

## Operating Context

Read on desktop and phones, often in a few spare minutes between other candidates. Hosted from this repository and synced to Lovable; commits pushed to `main` appear in the Lovable editor.

## Capabilities and Constraints

- TanStack Router + React + Vite, Tailwind v4, per-article CSS files under `src/views/`.
- Each article route owns its own stylesheet and visual identity; the hub pages share `src/styles.css`.
- Article copy, figures, and data are author-owned. Redesigns change layout, design, and motion only unless the author asks for edits.

## Brand Commitments

- Author name as written: Mohamad Noor-Chowdhury.
- The Colosseum to Cloud article uses a palette the author chose: #2D3C59 (navy), #94A378 (sage), #E5BA41 (mustard), #D1855C (terracotta).

## Evidence on Hand

- Article text and figures in `src/views/*Article.tsx`.
- Cover drawings in `src/components/ProjectCover.tsx`.
- No testimonials, metrics, or press; do not invent any.

## Product Principles

- The reader's comprehension comes first: structure every article so the argument is easy to follow to the end.
- Each article's design serves its subject, not a shared template.
- Never change the author's words or numbers without being asked.
- Motion explains or paces the argument; it never delays reading.

## Accessibility & Inclusion

Body text at readable sizes, WCAG AA contrast, full keyboard access, and reduced-motion support on every animated surface.
