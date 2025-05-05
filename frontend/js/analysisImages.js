<<<<<<< HEAD
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
=======
>>>>>>> origin/main
class AnalysisImages {
    constructor(videoId) {
      this.videoId = videoId;
      this.initContainers();
      this.loadImages();
      this.loadLogicImage();
    }

<<<<<<< HEAD
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
=======
    // loadLogicImage() {
    //     fetch(`/api/analysis_images/${this.videoId}`)
    //         .then(response => response.json())
    //         .then(data => {
    //             const img = document.getElementById('logic-image');
    //             if (img) {
    //                 img.src = data.logic;
    //                 img.onload = () => {
    //                     // 动态调整高度，确保不超过右侧面板的30%
    //                     const rightPanel = document.querySelector('.right-panel');
    //                     const maxHeight = rightPanel.clientHeight * 0.3;
    //                     if (img.naturalHeight > maxHeight) {
    //                         img.style.maxHeight = `${maxHeight}px`;
    //                         img.style.width = 'auto';
    //                     }
    //                 };
    //                 img.onerror = () => {
    //                     const container = document.querySelector('.logic-image-container');
    //                     container.querySelector('h4').textContent += ' (图片加载失败)';
    //                     img.style.display = 'none';
    //                 };
    //             }
    //         })
    //         .catch(error => {
    //             console.error('Error loading logic image:', error);
    //         });
    // }

    initContainers() {
      // 创建知识点覆盖容器
      this.coverageContainer = document.createElement('div');
      this.coverageContainer.className = 'coverage-container';
      this.coverageContainer.innerHTML = `
        <h3 class="module-title">知识点覆盖</h3>
        <div class="image-wrapper" style="width: 100%;">
            <img class="coverage-image" alt="知识点覆盖图" style="width: 100%; height: auto; display: block;">
        </div>
      `;
      
      // 确保插入在timeline容器之后
      const timelineContainer = document.querySelector('.timeline-container');
      if (timelineContainer) {
          timelineContainer.after(this.coverageContainer);
      } else {
          // 如果timeline容器不存在，则插入到字幕容器后
          document.querySelector('.subtitle-container').after(this.coverageContainer);
      }

      this.coverageImage = this.coverageContainer.querySelector('img');
    }

    loadImages() {
      fetch(`/api/analysis_images/${this.videoId}`)
          .then(response => response.json())
          .then(data => {
              if (data.coverage) {
                  this.coverageImage.src = data.coverage;
                  this.coverageImage.onload = () => {
                      // 保持原始比例的同时最大化显示
                      const containerWidth = this.coverageContainer.clientWidth;
                      const imgRatio = this.coverageImage.naturalHeight / this.coverageImage.naturalWidth;
                    
                      // 设置图片宽度为容器宽度（减去边距）
                      this.coverageImage.style.width = `${containerWidth - 40}px`;
                      this.coverageImage.style.height = 'auto';
                    
                      // 计算并设置容器高度（保持比例）
                      const imgHeight = (containerWidth - 40) * imgRatio;
                      this.coverageContainer.querySelector('.image-wrapper').style.height = `${imgHeight}px`;
                    
                      // 添加水平滚动条（如果图片很宽）
                      this.coverageContainer.querySelector('.image-wrapper').style.overflowX = 'auto';
                  };
              }
          })
          .catch(error => {
              console.error('Error loading coverage image:', error);
              this.coverageContainer.querySelector('h3').textContent += ' (图片加载失败)';
          });
        }
    
  
    // initContainers() {
    //   // 创建图片容器
    //   this.timelineContainer = this.createImageContainer('timeline-container', '时间线分析');
    //   this.coverageContainer = this.createImageContainer('coverage-container', '知识点覆盖');
    //   this.logicContainer = this.createImageContainer('logic-container', '逻辑结构');
      
    //   // 插入到DOM中
    //   const subtitleViewer = document.querySelector('.subtitle-viewer');
    //   subtitleViewer.after(this.timelineContainer);
    //   this.timelineContainer.after(this.coverageContainer);
      
    //   const treeContainer = document.getElementById('tree-container');
    //   treeContainer.parentNode.insertBefore(this.logicContainer, treeContainer.nextSibling);
    // }
  
    // createImageContainer(id, title) {
    //   const container = document.createElement('div');
    //   container.className = 'analysis-image-container';
    //   container.id = id;
      
    //   const titleElement = document.createElement('h4');
    //   titleElement.textContent = title;
    //   container.appendChild(titleElement);
      
    //   const imgElement = document.createElement('img');
    //   imgElement.alt = title;
    //   imgElement.className = 'analysis-image';
    //   container.appendChild(imgElement);
      
    //   return container;
    // }
  
    // loadImages() {
    //   fetch(`/api/analysis_images/${this.videoId}`)
    //     .then(response => response.json())
    //     .then(data => {
    //       this.setImage('timeline-container', data.timeline);
    //       this.setImage('coverage-container', data.coverage);
    //       this.setImage('logic-container', data.logic);
    //     })
    //     .catch(error => {
    //       console.error('Error loading analysis images:', error);
    //     });
    // }
>>>>>>> origin/main
  
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
<<<<<<< HEAD
>>>>>>> origin/main
=======
>>>>>>> origin/main
  }