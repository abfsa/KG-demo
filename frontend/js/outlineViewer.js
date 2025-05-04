class OutlineViewer {
    constructor(modalId, contentId, videoId) {
        this.modal = document.getElementById(modalId);
        this.content = document.getElementById(contentId);
        this.videoId = videoId;
        this.styles = {  // 自定义样式配置
            'title': { fontSize: '24px', color: '#333', fontWeight: 'bold' },
            'evaluation': { fontSize: '16px', color: 'black' },
            'details': { fontSize: '14px', color: '#7f8c8d' }
        };
        this.initEventListeners();
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
            const mdText = await response.json();
            this.renderOutline(mdText);
        } catch (error) {
            console.error('加载大纲失败:', error);
            this.showError(error);
        }
    }

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
        if (window.hljs) {
            document.querySelectorAll('pre code').forEach(block => {
                hljs.highlightElement(block);
            });
        }
    }

    downloadOutline() {
        // 修改为下载JSON（或保持生成PDF的逻辑）
        const a = document.createElement('a');
        a.href = `/api/outline/${this.videoId}`;
        a.download = '课程知识汇总.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    showError(error) {
        this.content.innerHTML = `
            <div class="outline-error">
                <h3>知识汇总加载失败</h3>
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