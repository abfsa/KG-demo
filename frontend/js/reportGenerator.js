class ReportGenerator {
    constructor(modalId, contentId, videoId) {
        this.modal = document.getElementById(modalId);
        this.content = document.getElementById(contentId);
        this.videoId = videoId;  // 加一行
        this.initEventListeners();
        this.initMarkdownRenderer();
    }

    initEventListeners() {
        // 生成报告按钮
        document.getElementById('generate-report').addEventListener('click', () => {
            this.openModal();
            this.loadReport();
        });

        // 关闭按钮
        document.querySelector('.close-button').addEventListener('click', () => {
            this.closeModal();
        });

        // 下载PDF按钮
        document.getElementById('download-pdf').addEventListener('click', () => {
            this.generatePDF();
        });

        // 点击模态框外部关闭
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
    }

    initMarkdownRenderer() {
        // 配置marked.js（如果可用）
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

    async loadReport() {
        try {
            const response = await fetch(`/api/report/${this.videoId}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const mdText = await response.text();
            this.renderReport(mdText);
        } catch (error) {
            console.error('加载报告失败:', error);
            this.showError(error);
        }
    }

    renderReport(mdText) {
        let html;
        if (window.marked) {
            html = marked.parse(mdText);
        } else {
            // 降级方案：简单处理换行和代码块
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

        // 应用语法高亮
        if (window.hljs) {
            document.querySelectorAll('pre code').forEach(block => {
                hljs.highlightElement(block);
            });
        }
    }

    generatePDF() {
        const a = document.createElement('a');
        a.href = `/api/report/${this.videoId}`;
        a.download = '分析报告.md';
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    showError(error) {
        this.content.innerHTML = `
            <div class="report-error">
                <h3>报告加载失败</h3>
                <p>${error.message}</p>
                <div class="error-actions">
                    <button onclick="location.reload()">刷新重试</button>
                    <button onclick="this.closest('.report-error').remove()">关闭</button>
                </div>
                <div class="debug-info">
                    <p>尝试访问：</p>
                    <ul>
                        <li><a href="/api/report" target="_blank">/api/report</a></li>
                        <li><a href="/data/report.md" target="_blank">/data/report.md</a></li>
                    </ul>
                </div>
            </div>
        `;
    }
}