class SubtitleViewer {
    constructor(containerId, videoId) {
        this.container = document.getElementById(containerId);
        this.videoId = videoId;
        this.subtitles = [];
        this.currentSubtitleIndex = -1;
        this.loadSubtitles();
        
        this.container.style.overflowY = 'auto';
        this.container.style.maxHeight = '200px';
        this.container.style.padding = '10px';
        this.container.style.border = '1px solid #ddd';
        this.container.style.borderRadius = '4px';
        this.container.style.backgroundColor = '#f8f9fa';
    }
    
    async loadSubtitles() {
        try {
            const response = await fetch(`/data/user1/${this.videoId}/subtitles.srt`);  // 注意这里
            const text = await response.text();
            this.parseSubtitles(text);
            this.renderAllSubtitles();
        } catch (error) {
            console.error('加载字幕失败:', error);
            this.container.innerHTML = '<p class="error">字幕加载失败，请刷新重试</p>';
        }
    }
    
    parseSubtitles(text) {
        const blocks = text.split(/\r?\n\r?\n/);
        this.subtitles = blocks.map(block => {
            const lines = block.split(/\r?\n/).filter(line => line.trim() !== '');
            if (lines.length < 3) return null;
            
            const [index, speakerLine, timeLine, ...contentLines] = lines;
            const content = contentLines.join('<br>');
            
            // 解析说话人
            let speaker = '';
            const speakerMatch = speakerLine.match(/--> Speaker:\s*(.+)/);
            if (speakerMatch) {
                speaker = speakerMatch[1];
            }
            
            // 解析时间
            const timeMatch = timeLine.match(/(\d{2}):(\d{2}):(\d{2}),(\d{3}) --> (\d{2}):(\d{2}):(\d{2}),(\d{3})/);
            if (!timeMatch) return null;
            
            const startTime = this.parseTime(timeMatch[1], timeMatch[2], timeMatch[3], timeMatch[4]);
            const endTime = this.parseTime(timeMatch[5], timeMatch[6], timeMatch[7], timeMatch[8]);
            
            return { 
                index, 
                speaker,
                startTime, 
                endTime, 
                content,
                timeText: timeLine // 保留原始时间文本
            };
        }).filter(Boolean);
    }
    
    parseTime(hours, minutes, seconds, milliseconds) {
        return parseFloat(hours) * 3600 + 
               parseFloat(minutes) * 60 + 
               parseFloat(seconds) + 
               parseFloat(milliseconds) / 1000;
    }
    
    renderAllSubtitles() {
        this.container.innerHTML = '';
        this.subtitles.forEach((sub, idx) => {
            const subElement = document.createElement('div');
            subElement.className = 'subtitle-item';
            subElement.dataset.index = idx;
            subElement.dataset.start = sub.startTime;
            subElement.dataset.end = sub.endTime;
            
            // 添加说话人信息
            if (sub.speaker) {
                const speakerElement = document.createElement('div');
                speakerElement.className = 'subtitle-speaker';
                speakerElement.textContent = sub.speaker + ':';
                subElement.appendChild(speakerElement);
            }
            
            // 添加时间信息
            const timeElement = document.createElement('div');
            timeElement.className = 'subtitle-time';
            timeElement.textContent = sub.timeText.split(' --> ')[0]; // 只显示开始时间
            subElement.appendChild(timeElement);
            
            // 添加内容
            const contentElement = document.createElement('div');
            contentElement.className = 'subtitle-content';
            contentElement.innerHTML = sub.content;
            subElement.appendChild(contentElement);
            
            // 点击字幕跳转到对应时间
            subElement.addEventListener('click', () => {
                const videoPlayer = window.videoPlayer;
                if (videoPlayer) {
                    videoPlayer.seekTo(sub.startTime);
                }
            });
            
            this.container.appendChild(subElement);
        });
    }
    
    update(currentTime) {
        // 清除之前的高亮
        if (this.currentSubtitleIndex >= 0) {
            const prevElement = this.container.querySelector(`.subtitle-item[data-index="${this.currentSubtitleIndex}"]`);
            if (prevElement) {
                prevElement.classList.remove('active');
                prevElement.style.backgroundColor = '';
            }
        }
        
        // 查找当前应该显示的字幕
        let foundIndex = -1;
        for (let i = 0; i < this.subtitles.length; i++) {
            const sub = this.subtitles[i];
            if (currentTime >= sub.startTime && currentTime <= sub.endTime) {
                foundIndex = i;
                break;
            }
        }
        
        // 高亮当前字幕并自动滚动
        if (foundIndex >= 0 && foundIndex !== this.currentSubtitleIndex) {
            const element = this.container.querySelector(`.subtitle-item[data-index="${foundIndex}"]`);
            if (element) {
                element.classList.add('active');
                element.style.backgroundColor = '#e6f7ff';
                
                // 平滑滚动到当前字幕
                element.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        }
        
        this.currentSubtitleIndex = foundIndex;
    }
}