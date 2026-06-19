/* ── Nav: scroll state + active link + mobile toggle ─────────── */
const nav       = document.getElementById('nav');
const navLinks  = document.getElementById('nav-links');
const navToggle = document.getElementById('nav-toggle');
const allLinks  = navLinks.querySelectorAll('a');
const sections  = document.querySelectorAll('main section[id]');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);

  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 90) current = sec.id;
  });
  allLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}, { passive: true });

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

allLinks.forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  });
});

/* ── Scroll fade-in (IntersectionObserver) ───────────────────── */
const fadeObserver = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        fadeObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
);

function observeFade(root) {
  root.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));
}
observeFade(document);

/* ── GitHub repos ────────────────────────────────────────────── */
const GITHUB_USER = 'kwcheong007';

const LANG_COLORS = {
  JavaScript:  '#f1e05a',
  TypeScript:  '#3178c6',
  Python:      '#3572A5',
  Java:        '#b07219',
  HTML:        '#e34c26',
  CSS:         '#563d7c',
  Go:          '#00ADD8',
  Rust:        '#dea584',
  Swift:       '#F05138',
  Kotlin:      '#A97BFF',
  C:           '#555555',
  'C++':       '#f34b7d',
  Ruby:        '#701516',
  PHP:         '#4F5D95',
  Shell:       '#89e051',
  Dart:        '#00B4AB',
  Vue:         '#41b883',
  Svelte:      '#ff3e00',
};

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function loadRepos() {
  const container = document.getElementById('repos-container');

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=12`,
      { headers: { Accept: 'application/vnd.github+json' } }
    );
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);

    const repos = await res.json();
    if (!Array.isArray(repos) || repos.length === 0) {
      container.innerHTML = '<p class="repos-message">No public repositories yet.</p>';
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'repos-grid';

    repos.forEach(repo => {
      const card = document.createElement('article');
      card.className = 'repo-card fade-in';

      const langColor = LANG_COLORS[repo.language] || '#6b7280';
      const langHTML = repo.language
        ? `<span class="repo-lang">
             <span class="lang-dot" style="background:${langColor}" aria-hidden="true"></span>
             ${esc(repo.language)}
           </span>`
        : '';

      const starsHTML = repo.stargazers_count > 0
        ? `<span class="repo-stars">
             <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
               <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
             </svg>
             ${repo.stargazers_count}
           </span>`
        : '';

      card.innerHTML = `
        <a href="${esc(repo.html_url)}"
           target="_blank" rel="noopener noreferrer"
           class="repo-name">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          ${esc(repo.name)}
        </a>
        <p class="repo-desc">${esc(repo.description || 'No description.')}</p>
        <div class="repo-meta">${langHTML}${starsHTML}</div>
      `;

      grid.appendChild(card);
    });

    container.innerHTML = '';
    container.appendChild(grid);
    observeFade(grid);

  } catch {
    container.innerHTML = `
      <div class="repos-message">
        <p>Could not load repositories right now.</p>
        <p style="margin-top:.5rem">
          <a href="https://github.com/${GITHUB_USER}"
             target="_blank" rel="noopener noreferrer">Browse on GitHub &nearr;</a>
        </p>
      </div>
    `;
  }
}

loadRepos();
