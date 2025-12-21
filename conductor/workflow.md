# Workflow: Nevado Trek Web

## Development Cycle
- **Task-Based Commits:** Every task in the plan must result in a commit.
- **Visual Verification:** Since this is a high-fidelity UI project, every UI change must be verified visually (manual check of layout, animations, and responsiveness).
- **GSAP Performance Audit:** Any new or refactored animation must be checked for "micro-lags" (Target: 60fps).

## Verification Protocol
- **Manual UI Check:** Ensure the "curtain" effect and other reveal animations do not interfere with the scroll container or i18n system.
- **Cross-Browser:** Verification must consider the quirks of Webflow-exported CSS in different engines.

## Records
- **Git Notes:** A summary of each task's impact and any visual fixes made will be stored in Git Notes.
