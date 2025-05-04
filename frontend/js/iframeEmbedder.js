class IframeEmbedder {
    constructor(videoId) {
        this.videoId = videoId;
        this.initContainers();
        this.loadIframes();
        this.setupResizeObserver();
    }

    initContainers() {
        // 时间轴容器
        this.timelineContainer = document.createElement('div');
        this.timelineContainer.className = 'timeline-container';
        this.timelineContainer.innerHTML = `
            <h3 class="module-title">视频时间轴</h3>
            <div class="iframe-wrapper">
                <iframe class="content-iframe" sandbox="allow-scripts allow-same-origin"></iframe>
            </div>
        `;
        document.querySelector('.subtitle-container').after(this.timelineContainer);

        // 逻辑图容器
        this.logicContainer = document.createElement('div');
        this.logicContainer.className = 'logic-container';
        this.logicContainer.innerHTML = `
            <h3 class="module-title">分析逻辑图</h3>
            <div class="iframe-wrapper">
                <iframe class="content-iframe" sandbox="allow-scripts allow-same-origin"></iframe>
            </div>
        `;
        document.querySelector('.tree-graph-container').after(this.logicContainer);

        this.timelineIframe = this.timelineContainer.querySelector('iframe');
        this.logicIframe = this.logicContainer.querySelector('iframe');
    }

    loadIframes() {
        this.timelineIframe.src = `/api/html/user1/${this.videoId}/timeline`;
        this.logicIframe.src = `/api/html/user1/${this.videoId}/logic`;
    }

    setupResizeObserver() {
        // 动态调整iframe高度
        const resizeIframe = (iframe) => {
            try {
                const contentHeight = iframe.contentDocument.documentElement.scrollHeight;
                iframe.style.height = `${contentHeight}px`;
                iframe.style.minHeight = '300px'; // 设置最小高度
            } catch (e) {
                console.warn('高度调整受限，使用默认高度');
                iframe.style.height = '600px'; // 跨域时的备用高度
            }
        };

        // 初始加载后调整
        this.timelineIframe.onload = () => resizeIframe(this.timelineIframe);
        this.logicIframe.onload = () => resizeIframe(this.logicIframe);

        // 持续监听变化（需要iframe允许访问）
        if (window.ResizeObserver) {
            new ResizeObserver(() => resizeIframe(this.timelineIframe))
                .observe(this.timelineContainer);
            new ResizeObserver(() => resizeIframe(this.logicIframe))
                .observe(this.logicContainer);
        }
    }
}