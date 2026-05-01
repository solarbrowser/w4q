document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    createSiteFooter();
    loadRepoMeta();
    initRoadmap();

    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        let currentTheme = localStorage.getItem('theme') || 'dark';

        if (currentTheme === 'light') {
            document.body.setAttribute('data-theme', 'light');
            themeToggleBtn.innerHTML = '<i data-lucide="sun" id="theme-icon"></i>';
        } else {
            themeToggleBtn.innerHTML = '<i data-lucide="moon" id="theme-icon"></i>';
        }

        lucide.createIcons();

        themeToggleBtn.addEventListener('click', () => {
            currentTheme = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';

            if (currentTheme === 'light') {
                document.body.setAttribute('data-theme', 'light');
                themeToggleBtn.innerHTML = '<i data-lucide="sun" id="theme-icon"></i>';
            } else {
                document.body.removeAttribute('data-theme');
                themeToggleBtn.innerHTML = '<i data-lucide="moon" id="theme-icon"></i>';
            }

            localStorage.setItem('theme', currentTheme);
            lucide.createIcons();
        });
    }
});

const REPO_META_CACHE_KEY = 'quanta-repo-meta-v1';
const REPO_META_TTL_MS = 1000 * 60 * 30;

function initRoadmap() {
    const roadmapRoot = document.querySelector('.roadmap-board');
    if (!roadmapRoot) {
        return;
    }

    const filterButtons = roadmapRoot.querySelectorAll('[data-filter]');
    const items = roadmapRoot.querySelectorAll('.roadmap-item');

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');

            filterButtons.forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');

            items.forEach((item) => {
                const state = item.getAttribute('data-state');
                const visible = filter === 'all' || state === filter;
                item.classList.toggle('hidden', !visible);
            });
        });
    });

    const toggles = roadmapRoot.querySelectorAll('.roadmap-toggle');
    const updateToggleLabel = (item, toggle) => {
        const expanded = item.classList.contains('open');
        const title = item.querySelector('.roadmap-title')?.textContent?.trim() || 'roadmap item';
        toggle.textContent = expanded ? '−' : '+';
        toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        toggle.setAttribute('aria-label', `${expanded ? 'Collapse' : 'Expand'} details for ${title}`);
    };

    toggles.forEach((toggle) => {
        const item = toggle.closest('.roadmap-item');
        if (item) {
            updateToggleLabel(item, toggle);
        }

        toggle.addEventListener('click', () => {
            const item = toggle.closest('.roadmap-item');
            if (item) {
                item.classList.toggle('open');
                updateToggleLabel(item, toggle);
            }
        });
    });
}

function readRepoMetaCache() {
    try {
        const raw = localStorage.getItem(REPO_META_CACHE_KEY);
        if (!raw) {
            return null;
        }
        const parsed = JSON.parse(raw);
        if (
            typeof parsed.stars !== 'number' ||
            typeof parsed.lastCommitDate !== 'string' ||
            typeof parsed.fetchedAt !== 'number'
        ) {
            return null;
        }
        return parsed;
    } catch {
        return null;
    }
}

function writeRepoMetaCache(payload) {
    try {
        localStorage.setItem(REPO_META_CACHE_KEY, JSON.stringify(payload));
    } catch {
        return;
    }
}

function applyRepoMeta(starsEl, commitEl, stars, lastCommitDate) {
    starsEl.textContent = `stars: ${new Intl.NumberFormat().format(stars)}`;
    commitEl.textContent = `last commit: ${formatTimeAgo(lastCommitDate)}`;
}

function createSiteFooter() {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `
        <div class="site-footer-inner">
            <div class="site-footer-meta">
                <span id="repo-stars">stars: ...</span>
                <span id="repo-last-commit">last commit: ...</span>
            </div>
        </div>
    `;
    document.body.appendChild(footer);
}

async function loadRepoMeta() {
    const starsEl = document.getElementById('repo-stars');
    const commitEl = document.getElementById('repo-last-commit');
    if (!starsEl || !commitEl) {
        return;
    }

    const cached = readRepoMetaCache();
    if (cached) {
        applyRepoMeta(starsEl, commitEl, cached.stars, cached.lastCommitDate);
        if (Date.now() - cached.fetchedAt < REPO_META_TTL_MS) {
            return;
        }
    }

    try {
        const repoRes = await fetch('https://api.github.com/repos/solarbrowser/quanta');
        if (!repoRes.ok) {
            throw new Error('Could not fetch repository metadata');
        }

        const repo = await repoRes.json();
        const payload = {
            stars: repo.stargazers_count,
            lastCommitDate: repo.pushed_at,
            fetchedAt: Date.now()
        };

        writeRepoMetaCache(payload);
        applyRepoMeta(starsEl, commitEl, payload.stars, payload.lastCommitDate);
    } catch {
        if (!cached) {
            starsEl.textContent = 'stars: unavailable';
            commitEl.textContent = 'last commit: unavailable';
        }
    }
}

function formatTimeAgo(dateString) {
    if (!dateString) {
        return 'unknown';
    }

    const now = Date.now();
    const then = new Date(dateString).getTime();
    if (Number.isNaN(then)) {
        return 'unknown';
    }

    const elapsedSeconds = Math.max(0, Math.floor((now - then) / 1000));
    if (elapsedSeconds < 60) {
        return 'just now';
    }

    const units = [
        ['year', 60 * 60 * 24 * 365],
        ['month', 60 * 60 * 24 * 30],
        ['day', 60 * 60 * 24],
        ['hour', 60 * 60],
        ['minute', 60]
    ];

    for (const [label, size] of units) {
        const value = Math.floor(elapsedSeconds / size);
        if (value >= 1) {
            return `${value} ${label}${value > 1 ? 's' : ''} ago`;
        }
    }

    return 'just now';
}

function copyCode() {
    const codeText = "git clone github.com/solarbrowser/quanta";
    navigator.clipboard.writeText(codeText).then(() => {
        const copyBtn = document.querySelector('.copy-btn');
        copyBtn.innerText = 'copied!';
        setTimeout(() => {
            copyBtn.innerText = 'copy';
        }, 2000);
    });
}
