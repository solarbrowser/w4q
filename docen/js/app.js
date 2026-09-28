import { docenConfig } from './config.js';

class Docen {
    constructor() {
        this.navElement = document.getElementById('docen-nav');
        this.renderElement = document.getElementById('docen-render-area');
        this.sidebarElement = document.querySelector('.docen-sidebar');
        this.sidebarBackdrop = document.getElementById('docen-sidebar-backdrop');
        this.tocObserver = null;
        this.currentFile = null;
        this.pageSequence = this.getPageSequence();
        this.documentCache = new Map();
        this.searchIndex = new Map();
        this.searchPriorityIndexPromise = null;
        this.searchBackgroundIndexPromise = null;
        this.init();
        this.initTheme();
        this.initSearch();

        this.initSidebarControls();
        this.initKeyboardShortcuts();

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Enable developer mode
        if (docenConfig.developerMode) {
            this.enableDeveloperMode();
        }
    }

    isMobileView() {
        return window.matchMedia('(max-width: 900px)').matches;
    }

    openMobileSidebar() {
        if (!this.sidebarElement) return;
        this.sidebarElement.classList.add('mobile-open');
        if (this.sidebarBackdrop) this.sidebarBackdrop.classList.add('active');
        document.body.classList.add('sidebar-open');
    }

    closeMobileSidebar() {
        if (!this.sidebarElement) return;
        this.sidebarElement.classList.remove('mobile-open');
        if (this.sidebarBackdrop) this.sidebarBackdrop.classList.remove('active');
        document.body.classList.remove('sidebar-open');
    }

    closeMobileTocModal() {
        const toc = this.renderElement?.querySelector('.docen-page-toc');
        const backdrop = this.renderElement?.querySelector('.docen-page-toc-backdrop');
        if (toc) toc.classList.remove('mobile-open');
        if (backdrop) backdrop.classList.remove('active');
        document.body.classList.remove('toc-modal-open');
    }

    openMobileTocModal() {
        const toc = this.renderElement?.querySelector('.docen-page-toc');
        const backdrop = this.renderElement?.querySelector('.docen-page-toc-backdrop');
        if (!toc || !backdrop) return;
        toc.classList.add('mobile-open');
        backdrop.classList.add('active');
        document.body.classList.add('toc-modal-open');
    }

    initSidebarControls() {
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const mobileToggle = document.getElementById('mobile-menu-toggle');

        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                this.closeMobileSidebar();
            });
        }

        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                if (!this.sidebarElement) return;
                if (this.sidebarElement.classList.contains('mobile-open')) {
                    this.closeMobileSidebar();
                } else {
                    this.openMobileSidebar();
                }
            });
        }

        if (this.sidebarBackdrop) {
            this.sidebarBackdrop.addEventListener('click', () => this.closeMobileSidebar());
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileSidebar();
                this.closeMobileTocModal();
            }
        });

        if (this.navElement) {
            this.navElement.addEventListener('click', (e) => {
                if (e.target.closest('a') && this.isMobileView()) {
                    this.closeMobileSidebar();
                }
            });
        }

        window.addEventListener('resize', () => {
            if (!this.sidebarElement) return;
            if (!this.isMobileView()) {
                this.closeMobileSidebar();
                this.closeMobileTocModal();
            }
        });
    }

    enableDeveloperMode() {
        const footer = document.querySelector('.docen-sidebar-footer');
        if (!footer || document.getElementById('dev-mode-btn')) return;

        const devBtn = document.createElement('button');
        devBtn.id = 'dev-mode-btn';
        devBtn.className = 'theme-toggle-btn';
        devBtn.title = 'Developer Options (Icons)';
        devBtn.innerHTML = '<i data-lucide="wrench"></i>';

        devBtn.addEventListener('click', () => this.showIconViewer());

        footer.appendChild(devBtn);
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    showIconViewer() {
        let modal = document.getElementById('icon-viewer-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'icon-viewer-modal';
            modal.className = 'docen-modal-overlay';

            const modalContent = document.createElement('div');
            modalContent.className = 'docen-modal-content';

            const closeBtn = document.createElement('button');
            closeBtn.className = 'docen-modal-close';
            closeBtn.innerHTML = '<i data-lucide="x"></i>';
            closeBtn.onclick = () => modal.classList.remove('active');

            const title = document.createElement('h2');
            title.textContent = 'Lucide Icons Reference';

            const warningText = document.createElement('div');
            warningText.className = 'docen-modal-warning';
            warningText.innerHTML = '<i data-lucide="info"></i> <span>You can disable this developer tool by setting <code>developerMode: false</code> in your <code>config.js</code> file.</span>';

            const searchBar = document.createElement('input');
            searchBar.type = 'text';
            searchBar.placeholder = 'Search icons...';
            searchBar.className = 'docen-icon-search';

            const grid = document.createElement('div');
            grid.className = 'docen-icon-grid';

            searchBar.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const items = grid.querySelectorAll('.docen-icon-item');
                items.forEach(item => {
                    const iconName = item.querySelector('span').textContent.toLowerCase();
                    if (iconName.includes(query)) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });

            if (typeof lucide !== 'undefined') {
                const icons = Object.keys(lucide.icons);
                icons.forEach(icon => {
                    const item = document.createElement('div');
                    item.className = 'docen-icon-item';
                    item.innerHTML = `
                    <i data-lucide="${icon}"></i>
                    <span>${icon}</span>
                    `;
                    item.onclick = () => {
                        navigator.clipboard.writeText(icon);
                        alert(`Copied "${icon}" to clipboard!`);
                    };
                    grid.appendChild(item);
                });
            }

            modalContent.appendChild(closeBtn);
            modalContent.appendChild(title);
            modalContent.appendChild(warningText);
            modalContent.appendChild(searchBar);
            modalContent.appendChild(grid);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);

            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        modal.classList.add('active');
    }

    initTheme() {
        const toggleBtn = document.getElementById('theme-toggle');
        const currentTheme = localStorage.getItem('docen-theme') || 'light';

        this.applyTheme(currentTheme);

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                this.applyTheme(newTheme);
            });
        }
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('docen-theme', theme);

        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn && typeof lucide !== 'undefined') {
            const iconName = theme === 'dark' ? 'sun' : 'moon';
            toggleBtn.innerHTML = `<i data-lucide="${iconName}"></i>`;
            lucide.createIcons();
        }
    }

    initSearch() {
        const searchInput = document.getElementById('docen-search-input');
        const searchResults = document.getElementById('docen-search-results');

        if (!searchInput || !searchResults) return;

        const indexFile = async (info) => {
            const key = info.file.toLowerCase();
            if (this.searchIndex.has(key)) return;
            try {
                const content = await this.getDocumentText(info.file);
                const textContent = this.extractSearchText(content);
                this.searchIndex.set(key, {
                    ...info,
                    searchableContent: textContent.toLowerCase(),
                                     rawText: textContent
                });
            } catch (error) {
                console.warn(`Could not index ${info.file}`);
            }
        };

        const getPriorityFiles = () => {
            const files = this.pageSequence;
            if (!this.currentFile || files.length === 0) {
                return files.slice(0, 6);
            }

            const currentIndex = files.findIndex((item) => item.file.toLowerCase() === this.currentFile.toLowerCase());
            if (currentIndex < 0) return files.slice(0, 6);

            const orderedIndexes = [currentIndex, currentIndex + 1, currentIndex - 1, currentIndex + 2, currentIndex - 2]
            .filter((index, pos, arr) => index >= 0 && index < files.length && arr.indexOf(index) === pos);
            return orderedIndexes.map((index) => files[index]);
        };

        const ensurePriorityIndex = async () => {
            if (!this.searchPriorityIndexPromise) {
                this.searchPriorityIndexPromise = (async () => {
                    const priorityFiles = getPriorityFiles();
                    for (const info of priorityFiles) {
                        await indexFile(info);
                    }
                })();
            }
            await this.searchPriorityIndexPromise;
        };

        const startBackgroundIndex = () => {
            if (this.searchBackgroundIndexPromise) return;
            this.searchBackgroundIndexPromise = (async () => {
                for (const info of this.pageSequence) {
                    await indexFile(info);
                }
            })();
        };

        const handleSearch = async (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query.length < 2) { // Minimum 2 characters to search (you can edit it if it is much or less)
                searchResults.classList.remove('active');
                return;
            }

            if (this.searchIndex.size === 0) {
                searchResults.innerHTML = '<div class="search-result-item" style="opacity: 0.5;">Indexing pages...</div>';
                searchResults.classList.add('active');
                await ensurePriorityIndex();
            }
            startBackgroundIndex();

            const indexedPages = Array.from(this.searchIndex.values());
            if (indexedPages.length === 0) return;

            const results = indexedPages.filter(d =>
            d.title.toLowerCase().includes(query) ||
            d.searchableContent.includes(query)
            );

            if (results.length === 0) {
                searchResults.innerHTML = '<div class="search-result-item" style="opacity: 0.5;">No results found</div>';
                searchResults.classList.add('active');
                return;
            }

            searchResults.innerHTML = results.slice(0, 5).map(res => {
                let excerpt = res.rawText.substring(0, 50);
                const contentIndex = res.searchableContent.indexOf(query);
                if (contentIndex > -1) {
                    const start = Math.max(0, contentIndex - 20);
                    excerpt = `...${res.rawText.substring(start, start + 50)}...`;
                }

                return `
                <a href="#${res.file}?search=${encodeURIComponent(query)}" class="search-result-item" onclick="document.getElementById('docen-search-input').value = ''">
                <div class="search-result-title">${res.title}</div>
                <div class="search-result-excerpt" style="pointer-events: none;">${excerpt}</div>
                </a>
                `;
            }).join('');

            searchResults.classList.add('active');
        };

        searchInput.addEventListener('input', handleSearch);

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.docen-search')) {
                searchResults.classList.remove('active');
            }
        });

        searchInput.addEventListener('focus', () => {
            if (searchInput.value.trim() && searchResults.innerHTML) {
                searchResults.classList.add('active');
            }
        });
    }

    // keyboard shorcuts
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
            const typing = this.isTypingTarget(document.activeElement);

            if (e.key === '/' && !typing) {
                e.preventDefault();
                const searchInput = document.getElementById('docen-search-input');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
                return;
            }

            if ((e.key === 'n' || e.key === 'N') && !typing) {
                e.preventDefault();
                this.goRelativePage(1);
                return;
            }

            if ((e.key === 'p' || e.key === 'P') && !typing) {
                e.preventDefault();
                this.goRelativePage(-1);
            }
        });
    }

    isTypingTarget(element) {
        if (!element) return false;
        const tag = element.tagName;
        return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || element.isContentEditable;
    }

    init() {
        // Set Docen title
        const logoTarget = document.querySelector('.docen-logo h2');
        if (logoTarget && docenConfig.title) {
            logoTarget.textContent = docenConfig.title;
        }

        this.buildNav();
        this.handleRoute();

        window.addEventListener('hashchange', () => this.handleRoute());
        this.renderElement.addEventListener('click', (event) => this.handleContentLinkClick(event));
    }

    buildNav() {
        this.navElement.innerHTML = '';
        const ul = document.createElement('ul');
        this.appendNavItems(docenConfig.nav, ul, true);
        this.navElement.appendChild(ul);

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    appendNavItems(items, parentElement, isRoot = false) {
        // Read global icon preferences from config with safe fallback defaults
        const useIcons = docenConfig.icons !== false;
        const useDefaultIcons = docenConfig.showDefaultIcons !== false;

        items.forEach(item => {
            const li = document.createElement('li');

            // Icon handling to determine if we should generate an icon element
            let iconHtml = '';
            if (useIcons && isRoot) {
                if (item.icon) {
                    iconHtml = `<i data-lucide="${item.icon.toLowerCase()}" class="nav-item-icon"></i>`;
                } else if (useDefaultIcons) {
                    if (item.folder) {
                        iconHtml = `<i data-lucide="folder" class="nav-item-icon"></i>`;
                    } else {
                        iconHtml = `<i data-lucide="file-text" class="nav-item-icon"></i>`;
                    }
                }
            }

            if (item.folder) {
                const folderDiv = document.createElement('div');

                let folderLink;
                if (item.file) {
                    folderLink = document.createElement('a');
                    folderLink.href = `#${item.file}`;
                } else {
                    folderLink = document.createElement('span');
                }

                folderLink.className = 'folder-link';
                folderLink.innerHTML = `<div class="nav-link-content">${iconHtml}<span>${item.folder}</span></div><i data-lucide="chevron-right" class="folder-icon"></i>`;

                if (!item.file) {
                    folderLink.addEventListener('click', (e) => {
                        const childUl = li.querySelector(':scope > ul.folder-children');
                        const icon = folderLink.querySelector('.folder-icon');
                        if (childUl) {
                            childUl.classList.toggle('open');
                            if (icon) icon.classList.toggle('open');
                        }
                        e.preventDefault();
                    });
                }

                li.appendChild(folderLink);

                if (item.children && item.children.length > 0) {
                    const childUl = document.createElement('ul');
                    childUl.className = 'folder-children';
                    this.appendNavItems(item.children, childUl, false);
                    li.appendChild(childUl);
                }
            } else {
                const a = document.createElement('a');
                a.className = 'item-link';
                a.href = `#${item.file}`;
                a.innerHTML = `<div class="nav-link-content">${iconHtml}<span>${item.title}</span></div>`;
                li.appendChild(a);
            }

            parentElement.appendChild(li);
        });
    }

    getPageSequence(items = docenConfig.nav, pages = []) {
        items.forEach((item) => {
            if (item.file) {
                pages.push({
                    file: item.file,
                    title: item.title || item.folder || item.file
                });
            }
            if (item.children && item.children.length > 0) {
                this.getPageSequence(item.children, pages);
            }
        });
        return pages;
    }

    updateNavState(currentFile) {
        const links = this.navElement.querySelectorAll('a');
        let activeLinkElement = null;

        links.forEach(link => {
            link.classList.remove('active');

            if (link.getAttribute('href') === `#${currentFile}`) {
                link.classList.add('active');
                activeLinkElement = link;
            }
        });

        const allChildrenLists = this.navElement.querySelectorAll('ul.folder-children');
        const allIcons = this.navElement.querySelectorAll('.folder-icon');
        allChildrenLists.forEach(ul => ul.classList.remove('open'));
        allIcons.forEach(icon => icon.classList.remove('open'));

        if (activeLinkElement) {
            let parent = activeLinkElement.parentElement;
            while (parent && parent !== this.navElement) {
                if (parent.tagName === 'LI') {
                    const childUl = parent.querySelector(':scope > ul.folder-children');
                    const icon = parent.querySelector(':scope > .folder-link .folder-icon');
                    if (childUl) childUl.classList.add('open');
                    if (icon) icon.classList.add('open');
                }
                parent = parent.parentElement;
            }
        }
    }

    parseRoute(hash) {
        let filename = hash || docenConfig.homePage;
        let searchQuery = null;
        let section = null;

        if (filename.includes('?')) {
            const parts = filename.split('?');
            filename = parts[0];
            const params = new URLSearchParams('?' + parts.slice(1).join('?'));
            searchQuery = params.get('search');
            section = params.get('section');
        }

        return { filename: filename || docenConfig.homePage, searchQuery, section };
    }

    async handleRoute() {
        const { filename, searchQuery, section } = this.parseRoute(window.location.hash.slice(1));

        // Same document, only the section changed: just scroll, don't reload
        if (section && !searchQuery && this.renderedFile === filename && filename === this.currentFile) {
            this.scrollToSection(section);
            return;
        }

        this.currentFile = filename;
        this.updateNavState(filename);
        await this.loadContent(filename, searchQuery);
        if (section) {
            setTimeout(() => this.scrollToSection(section), 50);
        }
        if (this.isMobileView()) this.closeMobileSidebar();
    }

    async loadContent(filename, searchQuery = null) {
        this.renderedFile = null;
        this.renderElement.innerHTML = '<p>Loading...</p>';
        try {
            const markdown = await this.getDocumentText(filename);
            this.renderDocument(markdown, searchQuery, filename);
        } catch (error) {
            this.renderElement.innerHTML = `<h1>Page Not Found</h1><p>The document <code>${filename}</code> could not be loaded.</p>`;
            console.error(error);
        }
    }

    async getDocumentText(filename) {
        const key = filename.toLowerCase();
        if (this.documentCache.has(key)) {
            return this.documentCache.get(key);
        }

        const response = await fetch(`${docenConfig.baseDir}${filename}`);
        if (!response.ok) {
            throw new Error(`Failed to load ${filename}`);
        }

        const markdown = await response.text();
        this.documentCache.set(key, markdown);
        return markdown;
    }

    renderDocument(markdown, searchQuery = null, currentFile = null) {
        this.destroyTocObserver();
        this.closeMobileTocModal();

        if (typeof marked !== 'undefined') {
            const renderedHtml = marked.parse(markdown);
            this.renderElement.innerHTML = this.sanitizeHtml(renderedHtml);
            this.wrapPageContent();
            this.assignHeadingIds();
            this.rewriteDocumentLinks(currentFile);
            this.buildPageToc();
            this.buildPageNavigation(currentFile);
            this.renderedFile = currentFile;

            // Execute highlight and scroll logic if routed from search
            if (searchQuery) {
                setTimeout(() => this.highlightAndScroll(searchQuery), 50);
            }
        } else {
            this.renderElement.innerHTML = '<p>Error: Markdown parser not loaded.</p>';
        }
    }

    sanitizeHtml(html) {
        if (typeof DOMPurify !== 'undefined') {
            return DOMPurify.sanitize(html);
        }
        return html;
    }

    extractSearchText(markdown) {
        const rawHtml = typeof marked !== 'undefined' ? marked.parse(markdown) : markdown;
        const safeHtml = this.sanitizeHtml(rawHtml);
        const tmpDiv = document.createElement('div');
        tmpDiv.innerHTML = safeHtml;
        return (tmpDiv.textContent || tmpDiv.innerText || '').replace(/\s+/g, ' ');
    }

    wrapPageContent() {
        if (this.renderElement.querySelector('.docen-page-content')) return;

        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'docen-page-content';

        while (this.renderElement.firstChild) {
            contentWrapper.appendChild(this.renderElement.firstChild);
        }

        this.renderElement.appendChild(contentWrapper);
    }

    destroyTocObserver() {
        if (this.tocObserver) {
            this.tocObserver.disconnect();
            this.tocObserver = null;
        }
    }

    slugify(text) {
        return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }

    assignHeadingIds() {
        const contentWrapper = this.renderElement.querySelector('.docen-page-content');
        if (!contentWrapper) return;

        const seenIds = new Set();
        contentWrapper.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
            const baseId = heading.id || this.slugify(heading.textContent || '') || 'section';

            let candidate = baseId;
            let suffix = 1;
            while (seenIds.has(candidate)) {
                candidate = `${baseId}-${suffix}`;
                suffix += 1;
            }

            heading.id = candidate;
            seenIds.add(candidate);
        });
    }

    // Resolve a path written inside a document against that document's folder.
    // Returns a path relative to docenConfig.baseDir (e.g. "Architecture/parser.md").
    resolveDocPath(path, currentFile) {
        const resolved = new URL(path, `https://docen.invalid/${currentFile || ''}`);
        return decodeURIComponent(resolved.pathname.slice(1));
    }

    // Markdown links are written relative to the document, but the browser resolves them
    // against index.html. Rewrite them into hash routes so they stay inside the app,
    // wherever it is hosted (site root or a subfolder like /docen/).
    rewriteDocumentLinks(currentFile) {
        const contentWrapper = this.renderElement.querySelector('.docen-page-content');
        if (!contentWrapper || !currentFile) return;

        const isExternal = (value) => /^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith('//');

        contentWrapper.querySelectorAll('a[href]').forEach((link) => {
            const href = link.getAttribute('href').trim();
            if (!href || isExternal(href)) return;

            if (href.startsWith('#')) {
                const target = href.slice(1);
                // Already a Docen route like "#Advanced/theming.md"
                if (!target || /\.md(\?|$)/i.test(target)) return;
                link.setAttribute('href', this.buildRouteHash(currentFile, this.safeDecode(target)));
                return;
            }

            const [, path, suffix] = href.match(/^([^?#]*)(.*)$/);
            const resolved = this.resolveDocPath(path, currentFile);

            if (/\.md$/i.test(path)) {
                const hashIndex = suffix.indexOf('#');
                const section = hashIndex >= 0 ? this.safeDecode(suffix.slice(hashIndex + 1)) : null;
                link.setAttribute('href', this.buildRouteHash(resolved, section));
            } else {
                // Other files next to the document (downloads, ...) live under baseDir
                link.setAttribute('href', `${docenConfig.baseDir}${resolved}${suffix}`);
            }
        });

        contentWrapper.querySelectorAll('img[src]').forEach((img) => {
            const src = img.getAttribute('src').trim();
            if (!src || isExternal(src)) return;
            img.setAttribute('src', `${docenConfig.baseDir}${this.resolveDocPath(src, currentFile)}`);
        });
    }

    buildRouteHash(file, section = null) {
        return section ? `#${file}?section=${encodeURIComponent(section)}` : `#${file}`;
    }

    safeDecode(value) {
        try {
            return decodeURIComponent(value);
        } catch {
            return value;
        }
    }

    findSectionElement(section) {
        const contentRoot = this.renderElement.querySelector('.docen-page-content') || this.renderElement;
        const candidates = [section, section.toLowerCase(), this.slugify(section)];
        for (const id of candidates) {
            if (!id) continue;
            const byId = contentRoot.querySelector(`#${CSS.escape(id)}`);
            if (byId) return byId;
            const byName = contentRoot.querySelector(`a[name="${CSS.escape(id)}"]`);
            if (byName) return byName;
        }
        return null;
    }

    scrollToSection(section) {
        const target = this.findSectionElement(section);
        if (!target) return;
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (/^H[1-6]$/.test(target.tagName)) this.flashSection(target);
    }

    // Links to a section of the current document: scroll without re-rendering,
    // even when the same link is clicked twice (no hashchange fires then).
    handleContentLinkClick(event) {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        const link = event.target.closest('.docen-page-content a[href^="#"]');
        if (!link) return;

        const { filename, searchQuery, section } = this.parseRoute(link.getAttribute('href').slice(1));
        if (!section || searchQuery || filename !== this.currentFile || this.renderedFile !== filename) return;

        event.preventDefault();
        const newHash = link.getAttribute('href');
        if (window.location.hash !== newHash) {
            history.pushState(null, '', newHash);
        }
        this.scrollToSection(section);
    }

    buildPageToc() {
        const contentWrapper = this.renderElement.querySelector('.docen-page-content');
        if (!contentWrapper) return;

        const headings = Array.from(contentWrapper.querySelectorAll('h2, h3'));
        if (headings.length === 0) {
            this.renderElement.classList.add('no-toc');
            return;
        }
        this.renderElement.classList.remove('no-toc');

        const seenIds = new Set();
        headings.forEach((heading) => {
            let baseId = heading.id || this.slugify(heading.textContent || 'section');
            if (!baseId) baseId = 'section';

            let candidate = baseId;
            let suffix = 2;
            while (seenIds.has(candidate) || (document.getElementById(candidate) && document.getElementById(candidate) !== heading)) {
                candidate = `${baseId}-${suffix}`;
                suffix += 1;
            }

            heading.id = candidate;
            seenIds.add(candidate);
        });

        const toc = document.createElement('nav');
        toc.className = 'docen-page-toc';
        toc.setAttribute('aria-label', 'On this page');

        const titleBar = document.createElement('div');
        titleBar.className = 'docen-page-toc-titlebar';

        const title = document.createElement('p');
        title.className = 'docen-page-toc-title';
        title.textContent = 'On this page';

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'docen-page-toc-close';
        closeBtn.setAttribute('aria-label', 'Close table of contents');
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', () => this.closeMobileTocModal());

        titleBar.appendChild(title);
        titleBar.appendChild(closeBtn);
        toc.appendChild(titleBar);

        const list = document.createElement('ul');
        const buttonMap = new Map();

        headings.forEach((heading) => {
            const item = document.createElement('li');
            item.className = `docen-page-toc-item level-${heading.tagName.toLowerCase()}`;

            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = heading.textContent || '';
            button.dataset.targetId = heading.id;
            button.addEventListener('click', () => {
                heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
                this.flashSection(heading);
                buttonMap.forEach((btn) => btn.classList.remove('active'));
                button.classList.add('active');
                if (this.isMobileView()) this.closeMobileTocModal();
            });

                buttonMap.set(heading.id, button);
                item.appendChild(button);
                list.appendChild(item);
        });

        toc.appendChild(list);
        this.renderElement.appendChild(toc);

        const mobileTrigger = document.createElement('button');
        mobileTrigger.type = 'button';
        mobileTrigger.className = 'docen-mobile-toc-trigger';
        mobileTrigger.textContent = 'On this page';
        mobileTrigger.addEventListener('click', () => this.openMobileTocModal());
        this.renderElement.appendChild(mobileTrigger);

        const mobileBackdrop = document.createElement('div');
        mobileBackdrop.className = 'docen-page-toc-backdrop';
        mobileBackdrop.addEventListener('click', () => this.closeMobileTocModal());
        this.renderElement.appendChild(mobileBackdrop);

        const setActiveButton = (headingId) => {
            buttonMap.forEach((btn) => btn.classList.remove('active'));
            const activeBtn = buttonMap.get(headingId);
            if (activeBtn) activeBtn.classList.add('active');
        };

            setActiveButton(headings[0].id);

            this.tocObserver = new IntersectionObserver((entries) => {
                const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

                if (visible.length > 0) {
                    setActiveButton(visible[0].target.id);
                }
            }, {
                root: null,
                rootMargin: '-20% 0px -70% 0px',
                threshold: [0.1, 0.4, 0.7]
            });

            headings.forEach((heading) => this.tocObserver.observe(heading));
    }

    buildPageNavigation(currentFile) {
        const contentWrapper = this.renderElement.querySelector('.docen-page-content');
        if (!contentWrapper || !currentFile) return;

        const pages = this.pageSequence;
        const currentIndex = pages.findIndex((page) => page.file.toLowerCase() === currentFile.toLowerCase());
        if (currentIndex < 0) return;

        const previousPage = currentIndex > 0 ? pages[currentIndex - 1] : null;
        const nextPage = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null;

        if (!previousPage && !nextPage) return;

        const nav = document.createElement('nav');
        nav.className = 'docen-page-nav';
        nav.setAttribute('aria-label', 'Page navigation');

        const createLink = (page, direction) => {
            const link = document.createElement('a');
            link.className = `docen-page-nav-link ${direction}`;
            link.href = `#${page.file}`;
            link.innerHTML = direction === 'prev'
            ? `<span class="docen-page-nav-top"><span class="docen-page-nav-label">Previous</span><kbd class="docen-keycap">P</kbd></span><span class="docen-page-nav-title">${page.title}</span>`
            : `<span class="docen-page-nav-top"><span class="docen-page-nav-label">Next</span><kbd class="docen-keycap">N</kbd></span><span class="docen-page-nav-title">${page.title}</span>`;
            return link;
        };

        if (previousPage) {
            nav.appendChild(createLink(previousPage, 'prev'));
        } else {
            const spacer = document.createElement('span');
            spacer.className = 'docen-page-nav-spacer';
            nav.appendChild(spacer);
        }

        if (nextPage) {
            nav.appendChild(createLink(nextPage, 'next'));
        }

        contentWrapper.appendChild(nav);
    }

    goRelativePage(offset) {
        const pages = this.pageSequence;
        if (!this.currentFile || pages.length === 0) return;

        const currentIndex = pages.findIndex((page) => page.file.toLowerCase() === this.currentFile.toLowerCase());
        if (currentIndex < 0) return;

        const targetIndex = currentIndex + offset;
        if (targetIndex < 0 || targetIndex >= pages.length) return;

        window.location.hash = `#${pages[targetIndex].file}`;
    }

    flashSection(heading) {
        heading.classList.remove('docen-section-flash');
        void heading.offsetWidth;
        heading.classList.add('docen-section-flash');

        setTimeout(() => {
            heading.classList.remove('docen-section-flash');
        }, 1800);
    }

    highlightAndScroll(query) {
        const contentRoot = this.renderElement.querySelector('.docen-page-content') || this.renderElement;
        const walker = document.createTreeWalker(contentRoot, NodeFilter.SHOW_TEXT, null, false);
        let node;
        const nodesToReplace = [];

        while (node = walker.nextNode()) {
            if (node.parentNode.tagName !== 'SCRIPT' && node.nodeValue.toLowerCase().includes(query.toLowerCase())) {
                nodesToReplace.push(node);
            }
        }

        nodesToReplace.forEach(node => {
            const parts = node.nodeValue.split(new RegExp(`(${query})`, 'i'));
            const fragment = document.createDocumentFragment();

            parts.forEach(part => {
                if (part.toLowerCase() === query.toLowerCase()) {
                    const mark = document.createElement('mark');
                    mark.className = 'docen-flash';
                    mark.textContent = part;
                    fragment.appendChild(mark);
                } else if (part) {
                    fragment.appendChild(document.createTextNode(part));
                }
            });
            node.parentNode.replaceChild(fragment, node);
        });

        // Try to scroll to the first highlight smoothly
        const firstMark = contentRoot.querySelector('.docen-flash');
        if (firstMark) {
            firstMark.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Docen();
});
