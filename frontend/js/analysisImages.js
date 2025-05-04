<<<<<<< HEAD
class AnalysisImages {
    constructor(videoId) {
      this.videoId = videoId;
      this.initContainers();
      this.loadImages();
      this.loadLogicImage();
    }

    loadLogicImage() {
        fetch(`/api/analysis_images/${this.videoId}`)
            .then(response => response.json())
            .then(data => {
                const img = document.getElementById('logic-image');
                if (img) {
                    img.src = data.logic;
                    img.onload = () => {
                        // 动态调整高度，确保不超过右侧面板的30%
                        const rightPanel = document.querySelector('.right-panel');
                        const maxHeight = rightPanel.clientHeight * 0.3;
                        if (img.naturalHeight > maxHeight) {
                            img.style.maxHeight = `${maxHeight}px`;
                            img.style.width = 'auto';
                        }
                    };
                    img.onerror = () => {
                        const container = document.querySelector('.logic-image-container');
                        container.querySelector('h4').textContent += ' (图片加载失败)';
                        img.style.display = 'none';
                    };
                }
            })
            .catch(error => {
                console.error('Error loading logic image:', error);
            });
    }
  
    initContainers() {
      // 创建图片容器
      this.timelineContainer = this.createImageContainer('timeline-container', '时间线分析');
      this.coverageContainer = this.createImageContainer('coverage-container', '知识点覆盖');
      this.logicContainer = this.createImageContainer('logic-container', '逻辑结构');
      
      // 插入到DOM中
      const subtitleViewer = document.querySelector('.subtitle-viewer');
      subtitleViewer.after(this.timelineContainer);
      this.timelineContainer.after(this.coverageContainer);
      
      const treeContainer = document.getElementById('tree-container');
      treeContainer.parentNode.insertBefore(this.logicContainer, treeContainer.nextSibling);
    }
  
    createImageContainer(id, title) {
      const container = document.createElement('div');
      container.className = 'analysis-image-container';
      container.id = id;
      
      const titleElement = document.createElement('h4');
      titleElement.textContent = title;
      container.appendChild(titleElement);
      
      const imgElement = document.createElement('img');
      imgElement.alt = title;
      imgElement.className = 'analysis-image';
      container.appendChild(imgElement);
      
      return container;
    }
  
    loadImages() {
      fetch(`/api/analysis_images/${this.videoId}`)
        .then(response => response.json())
        .then(data => {
          this.setImage('timeline-container', data.timeline);
          this.setImage('coverage-container', data.coverage);
          this.setImage('logic-container', data.logic);
        })
        .catch(error => {
          console.error('Error loading analysis images:', error);
        });
    }
  
    setImage(containerId, imageUrl) {
      const container = document.getElementById(containerId);
      if (!container) return;
      
      const img = container.querySelector('img');
      if (img) {
        img.src = imageUrl;
        img.onload = () => this.adjustImageSize(img);
        img.onerror = () => {
          container.querySelector('h4').textContent += ' (图片加载失败)';
          img.style.display = 'none';
        };
      }
    }
  
    adjustImageSize(img) {
      // 根据容器宽度调整图片大小
      const container = img.parentNode;
      const maxWidth = container.clientWidth - 40; // 留出边距
      if (img.naturalWidth > maxWidth) {
        img.style.width = '100%';
        img.style.height = 'auto';
      }
    }
=======
class AnalysisImages {
    constructor(videoId) {
      this.videoId = videoId;
      this.initContainers();
      this.loadImages();
      this.loadLogicImage();
    }

    loadLogicImage() {
        fetch(`/api/analysis_images/${this.videoId}`)
            .then(response => response.json())
            .then(data => {
                const img = document.getElementById('logic-image');
                if (img) {
                    img.src = data.logic;
                    img.onload = () => {
                        // 动态调整高度，确保不超过右侧面板的30%
                        const rightPanel = document.querySelector('.right-panel');
                        const maxHeight = rightPanel.clientHeight * 0.3;
                        if (img.naturalHeight > maxHeight) {
                            img.style.maxHeight = `${maxHeight}px`;
                            img.style.width = 'auto';
                        }
                    };
                    img.onerror = () => {
                        const container = document.querySelector('.logic-image-container');
                        container.querySelector('h4').textContent += ' (图片加载失败)';
                        img.style.display = 'none';
                    };
                }
            })
            .catch(error => {
                console.error('Error loading logic image:', error);
            });
    }
  
    initContainers() {
      // 创建图片容器
      this.timelineContainer = this.createImageContainer('timeline-container', '时间线分析');
      this.coverageContainer = this.createImageContainer('coverage-container', '知识点覆盖');
      this.logicContainer = this.createImageContainer('logic-container', '逻辑结构');
      
      // 插入到DOM中
      const subtitleViewer = document.querySelector('.subtitle-viewer');
      subtitleViewer.after(this.timelineContainer);
      this.timelineContainer.after(this.coverageContainer);
      
      const treeContainer = document.getElementById('tree-container');
      treeContainer.parentNode.insertBefore(this.logicContainer, treeContainer.nextSibling);
    }
  
    createImageContainer(id, title) {
      const container = document.createElement('div');
      container.className = 'analysis-image-container';
      container.id = id;
      
      const titleElement = document.createElement('h4');
      titleElement.textContent = title;
      container.appendChild(titleElement);
      
      const imgElement = document.createElement('img');
      imgElement.alt = title;
      imgElement.className = 'analysis-image';
      container.appendChild(imgElement);
      
      return container;
    }
  
    loadImages() {
      fetch(`/api/analysis_images/${this.videoId}`)
        .then(response => response.json())
        .then(data => {
          this.setImage('timeline-container', data.timeline);
          this.setImage('coverage-container', data.coverage);
          this.setImage('logic-container', data.logic);
        })
        .catch(error => {
          console.error('Error loading analysis images:', error);
        });
    }
  
    setImage(containerId, imageUrl) {
      const container = document.getElementById(containerId);
      if (!container) return;
      
      const img = container.querySelector('img');
      if (img) {
        img.src = imageUrl;
        img.onload = () => this.adjustImageSize(img);
        img.onerror = () => {
          container.querySelector('h4').textContent += ' (图片加载失败)';
          img.style.display = 'none';
        };
      }
    }
  
    adjustImageSize(img) {
      // 根据容器宽度调整图片大小
      const container = img.parentNode;
      const maxWidth = container.clientWidth - 40; // 留出边距
      if (img.naturalWidth > maxWidth) {
        img.style.width = '100%';
        img.style.height = 'auto';
      }
    }
>>>>>>> origin/main
  }