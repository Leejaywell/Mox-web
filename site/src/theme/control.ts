// Global theme controller: re-skins the whole site (CSS vars) and drives the
// site-wide ambient effect when a theme is chosen from the panel. Choice persists.
import { getThemes, getTheme } from '@/data/themes';
import { AmbientEffect } from '@/effects/ambient';

const KEY = 'mox.theme';
let fx: AmbientEffect | null = null;

export function applyTheme(id: string) {
  const th = getTheme(id);
  if (!th) return;
  const r = document.documentElement.style;
  r.setProperty('--bg', th.palette.bg);
  r.setProperty('--fg', th.palette.text);
  r.setProperty('--accent', th.palette.accent);
  document.documentElement.style.colorScheme = th.dark ? 'dark' : 'light';
  fx?.setConfig({ type: th.effect, colors: th.effectColors });
  fx?.start();
  try { localStorage.setItem(KEY, id); } catch {}
  document.querySelectorAll<HTMLElement>('[data-theme-id]').forEach((el) =>
    el.classList.toggle('on', el.dataset.themeId === id));
}

export function initTheme() {
  const canvas = document.getElementById('site-fx') as HTMLCanvasElement | null;
  let saved: string | null = null;
  try { saved = localStorage.getItem(KEY); } catch {}
  // Default theme is 绯夜 (waifu) unless the user picked one before.
  const th = (saved ? getTheme(saved) : undefined) || getTheme('waifu');

  if (canvas) {
    fx = new AmbientEffect(canvas, {
      type: th?.effect || 'orbs',
      colors: th?.effectColors || ['#ff5c8a', '#c04fff', '#7b5cff'],
    });
    fx.start();
  }
  if (th) applyTheme(th.id);

  // Panel open/close.
  const panel = document.getElementById('theme-panel');
  const openBtn = document.getElementById('theme-open');
  openBtn?.addEventListener('click', (e) => { e.preventDefault(); panel?.classList.toggle('open'); });
  document.addEventListener('click', (e) => {
    const t = e.target as Node;
    if (panel?.classList.contains('open') && !panel.contains(t) && !openBtn?.contains(t)) panel.classList.remove('open');
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') panel?.classList.remove('open'); });

  // Swatch clicks.
  document.querySelectorAll<HTMLElement>('[data-theme-id]').forEach((el) =>
    el.addEventListener('click', () => { applyTheme(el.dataset.themeId!); }));
}
