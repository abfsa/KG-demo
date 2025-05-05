<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> origin/main
class ReportGenerator {
    constructor(modalId, contentId, videoId) {
        this.modal = document.getElementById(modalId);
        this.content = document.getElementById(contentId);
<<<<<<< HEAD
        this.videoId = videoId;  // 加一行
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
<<<<<<< HEAD
            const mdText = await response.text();
            this.renderReport(mdText);
=======
            const reportData = await response.json();
            this.renderReport(reportData);
>>>>>>> origin/main
        } catch (error) {
            console.error('加载报告失败:', error);
            this.showError(error);
        }
    }

<<<<<<< HEAD
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
=======
    renderReport(reportData) {
        // 自定义渲染逻辑
        let html = `
            <div class="custom-report">
                <h1 style="${this.styleToString(this.styles.title)}">
                    ${reportData.response2.node[0].name || '分析报告'}
                </h1>
                <div class="evaluation" style="${this.styleToString(this.styles.evaluation)}">
                    ${this.renderMarkdown(reportData.response0)}
                </div>
                <h2 style="${this.styleToString(this.styles.title)}">
                    知识点难度分析
                </h2>
                <div class="evaluation" style="${this.styleToString(this.styles.evaluation)}">
                    ${this.renderMarkdown(reportData.response1.评价)}
                </div>
                <div class="evaluation" style="${this.styleToString(this.styles.evaluation)}">
                    ${this.renderMarkdown(reportData.response1.建议)}
                </div>
        `;
        html += `
            <div class="details-container" style="${this.styleToString(this.styles.details)}">
                <h3>详细分析</h3>
                <div class="details-grid">
                    ${reportData.response1.知识点.map(item => `
                        <div class="detail-card">
                            <h4>${item.name || '未命名条目'}</h4>
                            <div class="detail-content">
                                ${this.renderMarkdown(item.评价)}
                            </div>
                            <div class="detail-content">
                                ${this.renderMarkdown(item.建议)}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        html += `
                <h2 style="${this.styleToString(this.styles.title)}">
                    知识点结构分析
                </h2>
                <div class="evaluation" style="${this.styleToString(this.styles.evaluation)}">
                    ${this.renderMarkdown(reportData.response3.评价)}
                </div>
                <div class="evaluation" style="${this.styleToString(this.styles.evaluation)}">
                    ${this.renderMarkdown((reportData.response3.建议).join(''))}
                </div>
        `

        html += `
                <h2 style="${this.styleToString(this.styles.title)}">
                    知识点覆盖度分析
                </h2>
                <div class="evaluation" style="${this.styleToString(this.styles.evaluation)}">
                    ${this.renderMarkdown(reportData.response5.覆盖情况总结)}
                </div>
                <div class="evaluation" style="${this.styleToString(this.styles.evaluation)}">
                    覆盖评分：${this.renderMarkdown(reportData.response5.覆盖评分)}
                </div>
                <div class="evaluation" style="${this.styleToString(this.styles.evaluation)}">
                    覆盖评分：${this.renderMarkdown(reportData.response5.改进建议)}
                </div>
        `
        html += `
            <div class="details-container" style="${this.styleToString(this.styles.details)}">
                <h3>详细分析</h3>
                <div class="details-grid">
                    ${reportData.response5.分析.map(item => `
                        <div class="detail-card">
                            <h4>${item.name || '未命名条目'}</h4>
                            <div class="detail-content">
                                ${this.renderMarkdown(item.覆盖情况)}
                            </div>
                            <div class="detail-content">
                                ${this.renderMarkdown(item.解释)}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        html += `</div>`;


        this.content.innerHTML = html;
        this.applySyntaxHighlighting();
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

    generatePDF() {
<<<<<<< HEAD
        const a = document.createElement('a');
        a.href = `/api/report/${this.videoId}`;
        a.download = '分析报告.md';
=======
        // 修改为下载JSON（或保持生成PDF的逻辑）
        const a = document.createElement('a');
        a.href = `/api/report/${this.videoId}`;
        a.download = '分析报告.json';
>>>>>>> origin/main
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
<<<<<<< HEAD
>>>>>>> origin/main
=======
>>>>>>> origin/main
}