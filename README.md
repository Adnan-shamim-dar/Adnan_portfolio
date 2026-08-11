# Rambe Portfolio Hub

This is a local portfolio workspace for:

- Outlier proof-of-work
- NeoVax / NeoResist-MD research
- MedViva
- AI evaluation work
- future grants, conferences, scholarships, and jobs

## What to put here

- screenshots from completed work
- short project summaries
- links to GitHub, papers, drafts, or demos
- notes about what each screenshot proves

## Files

- `index.html` - local portfolio homepage
- `style.css` - visual style
- `data/projects.json` - editable project content
- `assets/` - screenshots and images
- `notes/` - future notes, drafts, and evidence logs

## How to view

Run `serve.ps1`, then open `http://localhost:8088`.

## GitHub Pages deploy

This site is ready to publish as a static GitHub Pages site.

Recommended setup:

1. Create a new public GitHub repository for this folder.
2. Push the contents of this folder to the repo root.
3. In GitHub, go to `Settings -> Pages`.
4. Set the source to `GitHub Actions`.
5. Push changes to `main` to trigger a fresh deploy.

The repository includes a GitHub Actions workflow that publishes the site automatically on every push to `main`.

If you later add a custom domain, configure it in GitHub Pages settings after the first deploy.

## GitHub Pages setup

1. Put this folder in its own GitHub repo.
2. Commit `index.html`, `style.css`, `app.js`, `data/projects.json`, `assets/`, and `notes/`.
3. In GitHub, open `Settings -> Pages`.
4. Choose the branch you want to publish from, usually `main`, and set the folder to `/ (root)`.
5. Save and wait for the Pages URL to go live.

Because this is a static site, there is no build step. GitHub Pages can serve it directly.

## Caption formula

Use this formula when you add screenshots:

- what is on the screen
- what you were doing
- why it matters

Example:

`Reviewed a medical answer for accuracy and hallucinations. This shows structured evaluation, not just generic AI use.`
