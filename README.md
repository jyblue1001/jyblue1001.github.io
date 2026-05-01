# Jae Young Yoon Tech Blog

Personal technical blog for analog circuit design notes, PLL design writeups, and open-source IC design experiments.

The live site is published at:

```text
https://jyblue1001.github.io/
```

## Stack

- Astro for static site generation
- Markdown content collections for posts
- KaTeX for equations
- GitHub Actions for GitHub Pages deployment

## Project Structure

```text
astro-blog/
  src/content/posts/      Blog posts
  src/layouts/            Shared page layout
  src/pages/              Site routes
  src/styles/             Global styling
  public/images/          Post images and static assets
```

PLL posts are grouped under:

```text
astro-blog/src/content/posts/pll/
```

## Local Development

```bash
cd astro-blog
npm install
npm run dev
```

Build the production site with:

```bash
npm run build
```

## Deployment

Pushes to `main` run the `Build and Deploy Astro` GitHub Actions workflow. The workflow builds `astro-blog` and publishes `astro-blog/dist` to GitHub Pages.

GitHub Pages should be configured with:

```text
Source: GitHub Actions
```
