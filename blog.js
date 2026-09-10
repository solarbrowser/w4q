const blogPosts = [
            'texts/why-a-new-js-engine.html'
        ];

        async function fetchText(url) {
            try {
                const res = await fetch(url);
                if (!res.ok) return null;
                return await res.text();
            } catch (e) {
                return null;
            }
        }

        function extractFirstH2(html, fallback) {
            if (!html) return fallback || '';
            const m = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
            if (m && m[1]) return m[1].replace(/<[^>]+>/g, '').trim();
            const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
            if (t && t[1]) return t[1].trim();
            return fallback || '';
        }

        async function loadBlogPosts() {
            const container = document.getElementById('blog-posts-container');
            if (!container) return;

            if (blogPosts.length === 0) {
                container.innerHTML = '<p class="description">No texts yet.</p>';
                return;
            }

            container.innerHTML = '';

            for (const postUrl of blogPosts) {
                const raw = await fetchText(postUrl);
                const title = extractFirstH2(raw, postUrl.split('/').pop().replace(/\.html?$/, '').replace(/-/g, ' '));

                let author = '';
                let date = '';
                if (raw) {
                    const ems = [...raw.matchAll(/<em[^>]*>([\s\S]*?)<\/em>/gi)].map(m => m[1].trim());
                    const lastEm = ems.length ? ems[ems.length - 1] : '';
                    if (lastEm) {
                        const m = lastEm.match(/written by\s+(.+)\s+on\s+(.+)/i);
                        if (m) {
                            author = m[1].trim();
                            date = m[2].trim();
                        } else {
                            const parts = lastEm.split(/\s+on\s+/i);
                            if (parts.length >= 2) {
                                author = parts[0].replace(/written by\s*/i, '').trim();
                                date = parts.slice(1).join(' on ').trim();
                            } else {
                                author = lastEm;
                            }
                        }
                    }
                }

                const article = document.createElement('article');
                article.className = 'roadmap-item';
                article.setAttribute('data-state', 'in-progress');

                const head = document.createElement('div');
                head.className = 'roadmap-item-head';

                const titleWrap = document.createElement('div');
                titleWrap.className = 'roadmap-item-title-wrap';

                const node = document.createElement('div');
                node.className = 'roadmap-node';

                const link = document.createElement('a');
                link.href = postUrl;
                link.className = 'roadmap-title';
                link.textContent = title || postUrl;

                titleWrap.appendChild(node);
                titleWrap.appendChild(link);

                const meta = document.createElement('div');
                meta.className = 'roadmap-meta';
                meta.textContent = (author || '') + (date ? ' · ' + date : '');

                head.appendChild(titleWrap);
                head.appendChild(meta);

                article.appendChild(head);
                article.tabIndex = 0;
                article.setAttribute('role', 'link');
                article.setAttribute('aria-label', title || postUrl);
                article.addEventListener('click', (e) => {
                    if (e.target && e.target.closest && e.target.closest('a')) return;
                    window.location.href = postUrl;
                });
                article.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') window.location.href = postUrl;
                });

                container.appendChild(article);
            }
        }

document.addEventListener('DOMContentLoaded', loadBlogPosts);
