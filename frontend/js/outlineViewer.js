<<<<<<< HEAD
<<<<<<< HEAD
class OutlineViewer {
    constructor(modalId, contentId, videoId) {
        this.modal = document.getElementById(modalId);
        this.content = document.getElementById(contentId);
        this.videoId = videoId; // 加一行：存 videoId
        this.initEventListeners();
        this.initMarkdownRenderer();
    }

    initEventListeners() {
        document.getElementById('show-outline').addEventListener('click', () => {
            this.openModal();
            this.loadOutline();
        });

        document.querySelector('#outline-modal .close-button').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('download-outline').addEventListener('click', () => {
            this.downloadOutline();
        });

        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
    }

    initMarkdownRenderer() {
        if (window.marked) {
            marked.setOptions({
                gfm: true,
                breaks: true,
                highlight: function(code, lang) {
                    if (window.hljs) {
                        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                        return hljs.highlight(code, { language }).value;
                    }
                    return code;
                }
            });
        }
    }

    openModal() {
        this.modal.style.display = 'block';
    }

    closeModal() {
        this.modal.style.display = 'none';
    }

    async loadOutline() {
        try {
            let response = await fetch(`/api/outline/${this.videoId}`); // 加了 videoId
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const mdText = await response.text();
            this.renderOutline(mdText);
        } catch (error) {
            console.error('加载大纲失败:', error);
            this.showError(error);
        }
    }

    renderOutline(mdText) {
        let html;
        if (window.marked) {
            html = marked.parse(mdText);
        } else {
            html = mdText
                .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                .replace(/`([^`]+)`/g, '<code>$1</code>')
                .replace(/\n/g, '<br>');
        }

        this.content.innerHTML = `
            <div class="markdown-body">
                ${html}
            </div>
        `;

        if (window.hljs) {
            document.querySelectorAll('pre code').forEach(block => {
                hljs.highlightElement(block);
            });
        }
    }

    downloadOutline() {
        const a = document.createElement('a');
        a.href = `/api/outline/${this.videoId}`; // 加了 videoId
        a.download = '教案.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    showError(error) {
        this.content.innerHTML = `
            <div class="outline-error">
                <h3>教案加载失败</h3>
                <p>${error.message}</p>
                <div class="error-actions">
                    <button onclick="location.reload()">刷新重试</button>
                    <button onclick="this.closest('.outline-error').remove()">关闭</button>
                </div>
                <div class="debug-info">
                    <p>尝试访问：</p>
                    <ul>
                        <li><a href="/api/outline/${this.videoId}" target="_blank">/api/outline/${this.videoId}</a></li>
                    </ul>
                </div>
            </div>
        `;
    }
}
=======
=======
>>>>>>> origin/main
class OutlineViewer {
    constructor(modalId, contentId, videoId) {
        this.modal = document.getElementById(modalId);
        this.content = document.getElementById(contentId);
<<<<<<< HEAD
        this.videoId = videoId; // 加一行：存 videoId
        this.initEventListeners();
        this.initMarkdownRenderer();
=======
        this.videoId = videoId;
        this.styles = {  // 自定义样式配置
            'title': { fontSize: '24px', color: '#333', fontWeight: 'bold' },
            'evaluation': { fontSize: '16px', color: 'black' },
            'details': { fontSize: '14px', color: '#7f8c8d' }
        };
        this.initEventListeners();
>>>>>>> origin/main
    }

    initEventListeners() {
        document.getElementById('show-outline').addEventListener('click', () => {
            this.openModal();
            this.loadOutline();
        });

        document.querySelector('#outline-modal .close-button').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('download-outline').addEventListener('click', () => {
            this.downloadOutline();
        });

        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
    }

    initMarkdownRenderer() {
        if (window.marked) {
            marked.setOptions({
                gfm: true,
                breaks: true,
                highlight: function(code, lang) {
                    if (window.hljs) {
                        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                        return hljs.highlight(code, { language }).value;
                    }
                    return code;
                }
            });
        }
    }

    openModal() {
        this.modal.style.display = 'block';
    }

    closeModal() {
        this.modal.style.display = 'none';
    }

    async loadOutline() {
        try {
            let response = await fetch(`/api/outline/${this.videoId}`); // 加了 videoId
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
<<<<<<< HEAD
            const mdText = await response.text();
=======
            const mdText = await response.json();
>>>>>>> origin/main
            this.renderOutline(mdText);
        } catch (error) {
            console.error('加载大纲失败:', error);
            this.showError(error);
        }
    }

<<<<<<< HEAD
    renderOutline(mdText) {
        let html;
        if (window.marked) {
            html = marked.parse(mdText);
        } else {
            html = mdText
                .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                .replace(/`([^`]+)`/g, '<code>$1</code>')
                .replace(/\n/g, '<br>');
        }

        this.content.innerHTML = `
            <div class="markdown-body">
                ${html}
            </div>
        `;

=======
    renderOutline(reportData) {
        let html = `
            <div class="course-outline">
                <h1 class="course-title">${reportData.课程名称 || '未命名课程'}</h1>
                <div class="chapters-container">
                    ${this.renderChapters(reportData.章节)}
                </div>
            </div>
        `;
        
        this.content.innerHTML = html;
        this.applySyntaxHighlighting();
    }

    renderChapters(chapters) {
        if (!Array.isArray(chapters)) return '';
        
        return chapters.map(chapter => `
            <div class="chapter">
                <h2>${chapter.章节名 || '未命名章节'}</h2>
                <div class="knowledge-points">  <!-- 移除style="display:none" -->
                    ${this.renderKnowledgePoints(chapter.知识点)}
                </div>
            </div>
        `).join('');
    }

    renderKnowledgePoints(points) {
        if (!Array.isArray(points)) return '';
        
        return points.map(point => `
            <div class="point">
                <h3>${point.名称 || '未命名知识点'}</h3>
                <div class="point-content">
                    ${this.renderMarkdown(point.内容)}
                </div>
            </div>
        `).join('');
    }
    
    renderMarkdown(mdText) {
        return window.marked ? marked.parse(mdText) : mdText;
    }

    styleToString(styleObj) {
        return Object.entries(styleObj)
            .map(([key, val]) => `${key}:${val}`)
            .join(';');
    }

    applySyntaxHighlighting() {
>>>>>>> origin/main
        if (window.hljs) {
            document.querySelectorAll('pre code').forEach(block => {
                hljs.highlightElement(block);
            });
        }
    }

    downloadOutline() {
<<<<<<< HEAD
        const a = document.createElement('a');
        a.href = `/api/outline/${this.videoId}`; // 加了 videoId
        a.download = '教案.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
=======
        // 修改为下载JSON（或保持生成PDF的逻辑）
        const a = document.createElement('a');
        a.href = `/api/outline/${this.videoId}`;
        a.download = '课程知识汇总.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
>>>>>>> origin/main
    }

    showError(error) {
        this.content.innerHTML = `
            <div class="outline-error">
<<<<<<< HEAD
                <h3>教案加载失败</h3>
=======
                <h3>知识汇总加载失败</h3>
>>>>>>> origin/main
                <p>${error.message}</p>
                <div class="error-actions">
                    <button onclick="location.reload()">刷新重试</button>
                    <button onclick="this.closest('.outline-error').remove()">关闭</button>
                </div>
                <div class="debug-info">
                    <p>尝试访问：</p>
                    <ul>
                        <li><a href="/api/outline/${this.videoId}" target="_blank">/api/outline/${this.videoId}</a></li>
                    </ul>
                </div>
            </div>
        `;
    }
<<<<<<< HEAD
}
>>>>>>> origin/main
=======
}
>>>>>>> origin/main
