<<<<<<< HEAD
// 初始化各模块
document.addEventListener('DOMContentLoaded', () => {
    // 视频播放器
    window.videoPlayer = new VideoPlayer('main-video');
    
    // 字幕查看器
    const subtitleViewer = new SubtitleViewer('subtitle-viewer', '/data/subtitles.srt');
    window.videoPlayer.setSubtitleViewer(subtitleViewer);
    
    // 树状图查看器
    const treeViewer = new TreeViewer('tree-container');
    treeViewer.loadTree('1'); // 默认加载第一个树状图
    
    // 报告生成器
    new ReportGenerator('report-modal', 'report-content');
});

// 在main.js中添加窗口大小调整监听
window.addEventListener('resize', adjustLayout);

function adjustLayout() {
    const leftPanel = document.querySelector('.left-panel');
    const rightPanel = document.querySelector('.right-panel');
    const videoContainer = document.querySelector('.video-container');
    
    // 计算可用高度
    const windowHeight = window.innerHeight;
    const controlPanelHeight = document.querySelector('.control-panel').offsetHeight;
    const padding = 30; // 上下padding总和
    
    // 设置右侧树状图容器高度
    const treeContainer = document.getElementById('tree-container');
    if (treeContainer) {
        treeContainer.style.maxHeight = `${windowHeight - controlPanelHeight - padding}px`;
    }
    
    // 设置视频容器高度 (可选)
    videoContainer.style.maxHeight = `${windowHeight * 0.4}px`; // 视频占40%屏幕高度
}

// 在DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // ...原有初始化代码...
    
    // 初始调整布局
    adjustLayout();
    
    // 加载完成后再次调整
    setTimeout(adjustLayout, 500);
});

const zoom = d3.zoom()
    .scaleExtent([0.5, 2])
    .on('zoom', (event) => {
        svg.attr('transform', event.transform);
    });

document.getElementById('reset-zoom').addEventListener('click', () => {
    svg.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity);
});

window.addEventListener('resize', () => {
    const treeViewer = window.treeViewer;
    if (treeViewer && treeViewer.currentViewMode === 'graph') {
        treeViewer.renderGraphView();
    }
=======
// 初始化各模块
document.addEventListener('DOMContentLoaded', () => {
    // 视频播放器
    window.videoPlayer = new VideoPlayer('main-video');
    
    // 字幕查看器
    const subtitleViewer = new SubtitleViewer('subtitle-viewer', '/data/subtitles.srt');
    window.videoPlayer.setSubtitleViewer(subtitleViewer);
    
    // 树状图查看器
    const treeViewer = new TreeViewer('tree-container');
    treeViewer.loadTree('1'); // 默认加载第一个树状图
    
    // 报告生成器
    new ReportGenerator('report-modal', 'report-content');
});

// 在main.js中添加窗口大小调整监听
window.addEventListener('resize', adjustLayout);

function adjustLayout() {
    const leftPanel = document.querySelector('.left-panel');
    const rightPanel = document.querySelector('.right-panel');
    const videoContainer = document.querySelector('.video-container');
    
    // 计算可用高度
    const windowHeight = window.innerHeight;
    const controlPanelHeight = document.querySelector('.control-panel').offsetHeight;
    const padding = 30; // 上下padding总和
    
    // 设置右侧树状图容器高度
    const treeContainer = document.getElementById('tree-container');
    if (treeContainer) {
        treeContainer.style.maxHeight = `${windowHeight - controlPanelHeight - padding}px`;
    }
    
    // 设置视频容器高度 (可选)
    videoContainer.style.maxHeight = `${windowHeight * 0.4}px`; // 视频占40%屏幕高度
}

// 在DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // ...原有初始化代码...
    
    // 初始调整布局
    adjustLayout();
    
    // 加载完成后再次调整
    setTimeout(adjustLayout, 500);
});

const zoom = d3.zoom()
    .scaleExtent([0.5, 2])
    .on('zoom', (event) => {
        svg.attr('transform', event.transform);
    });

document.getElementById('reset-zoom').addEventListener('click', () => {
    svg.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity);
});

window.addEventListener('resize', () => {
    const treeViewer = window.treeViewer;
    if (treeViewer && treeViewer.currentViewMode === 'graph') {
        treeViewer.renderGraphView();
    }
>>>>>>> origin/main
});