// Prefix internal links with the site base path (e.g. "/Mox-web/" on GitHub Pages),
// so absolute links don't break on a project page. Hash and external links pass through.
// Normalize once: strip any trailing slash, so we can join with exactly one.
const BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

export function withBase(path: string): string {
  if (path.startsWith('#') || /^https?:/.test(path) || path.startsWith('mailto:')) return path;
  return (BASE + '/' + path.replace(/^\//, '')).replace(/\/{2,}/g, '/');
}
