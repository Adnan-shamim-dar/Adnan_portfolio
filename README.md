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

## Update flow

1. Edit files locally.
2. Commit the changes.
3. Push to `main`.
4. GitHub Actions rebuilds and republishes the site automatically.

Because this is a static site, there is no build step beyond the GitHub Actions Pages deploy.

## Caption formula

Use this formula when you add screenshots:

- what is on the screen
- what you were doing
- why it matters

Example:

`Reviewed a medical answer for accuracy and hallucinations. This shows structured evaluation, not just generic AI use.`
