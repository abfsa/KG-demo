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
