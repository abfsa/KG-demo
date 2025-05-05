<<<<<<< HEAD
<<<<<<< HEAD
class TreeViewer {
    constructor(containerId, videoId) {
        this.container = document.getElementById(containerId);
        this.videoId = videoId;  // 加上 videoId
        this.currentTree = null;
        this.currentViewMode = 'graph';
        this.treeData = null;
        this.initEventListeners();
        
        this.graphContainer = document.createElement('div');
        this.graphContainer.className = 'tree-graph-container';
        this.container.appendChild(this.graphContainer);
        this.loadTree(1);
    }
    
    initEventListeners() {
        document.getElementById('tree-select').addEventListener('change', (e) => {
            this.loadTree(e.target.value);
        });
        
        document.getElementById('view-mode').addEventListener('change', (e) => {
            this.currentViewMode = e.target.value;
            this.renderTree();
        });

        document.getElementById('save-tree').addEventListener('click', () => {
            const treeId = document.getElementById('tree-select').value;
            this.saveTreeToServer(treeId);
        });
    }
    
    async loadTree(treeId) {
        try {
            const response = await fetch(`/api/tree/${this.videoId}/${treeId}`);
            this.currentTree = await response.json();
            this.treeData = this.convertToD3Hierarchy(this.currentTree);
            this.renderTree();
        } catch (error) {
            console.error('加载树状图失败:', error);
            this.showError(error);
        }
    }
    
    // 将原始数据转换为D3需要的层次结构
    convertToD3Hierarchy(node) {
        const root = d3.hierarchy(node);
        root.descendants().forEach(d => {
            d.data._children = d.data.child; // 保留原始子节点引用
        });
        return root;
    }
    
    renderTree() {
        if (!this.currentTree) return;
        
        this.graphContainer.innerHTML = '';
        
        switch (this.currentViewMode) {
            case 'graph':
                this.renderGraphView();
                break;
            case 'tree':
                this.renderTreeView(this.currentTree, this.graphContainer);
                break;
            case 'list':
                this.renderListView(this.currentTree, this.graphContainer);
                break;
        }
    }

    renderTreeView(node, parentElement, level = 0) {
        const nodeElement = document.createElement('div');
        nodeElement.className = 'tree-node';
        nodeElement.style.paddingLeft = `${level * 20}px`; // 用padding控制缩进
        
        // 设置为可拖拽
        nodeElement.draggable = true;
        nodeElement.dataset.nodeId = Math.random().toString(36).substring(2, 9); // 生成唯一ID

        // 拖动开始：存储拖动项ID
        nodeElement.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', nodeElement.dataset.nodeId);
            e.stopPropagation();
        });

        // 节点标题区域
        const headerElement = document.createElement('div');
        headerElement.className = 'tree-node-header';
        
        // 节点名称
        const titleElement = document.createElement('span');
        titleElement.className = 'tree-node-title';
        titleElement.textContent = node.name;
        titleElement.style.fontWeight = level === 0 ? 'bold' : 'normal';
        
        // 双击可编辑
        titleElement.addEventListener('dblclick', () => {
            const newName = prompt('请输入新的名称：', node.name);
            if (newName !== null && newName.trim() !== '') {
                node.name = newName;
                titleElement.textContent = newName;
            }
        });

        // 节点类型标签
        if (node.type) {
            const typeElement = document.createElement('span');
            typeElement.className = 'tree-node-type';
            typeElement.textContent = `[${node.type}]`;
            headerElement.appendChild(typeElement);
        }
        
        // 时间标签
        if (node.time) {
            const timeElement = document.createElement('span');
            timeElement.className = 'tree-node-time';
            timeElement.textContent = node.time.split(' --> ')[0]; // 只显示开始时间
            headerElement.appendChild(timeElement);
        }
        
        headerElement.appendChild(titleElement);

        const addBtn = document.createElement('button');
        addBtn.textContent = '+';
        addBtn.className = 'tree-node-action';
        addBtn.title = '添加子节点';
        addBtn.onclick = () => {
            const newNode = {
                name: '新节点',
                type: '知识点',
                time: '',
                content: '新建内容描述',
                child: []
        };
            if (!node.child) node.child = [];
            node.child.push(newNode);
            this.renderTree(); // 重新渲染
        };

        // 删除节点按钮（排除根节点）
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑';
        deleteBtn.className = 'tree-node-action';
        deleteBtn.title = '删除此节点';
        deleteBtn.onclick = () => {
            if (confirm('确定要删除此节点吗？')) {
                this.deleteNode(this.currentTree, node); // 自定义删除函数
                this.renderTree();
            }
        };

        headerElement.appendChild(addBtn);
        if (level > 0) headerElement.appendChild(deleteBtn); // 根节点不能删
    
        
        // 内容区域
        const contentElement = document.createElement('div');
        contentElement.className = 'tree-node-content';
        
        // 节点内容描述
        if (node.content) {
            const descElement = document.createElement('div');
            descElement.className = 'tree-node-desc';
            descElement.textContent = node.content;
            contentElement.appendChild(descElement);
        }
        
        // 子节点容器
        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'tree-children-container';
        
        childrenContainer.addEventListener('dragover', (e) => {
            e.preventDefault(); // 允许放置
        });
        
        childrenContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedId = e.dataTransfer.getData('text/plain');
            const draggedEl = childrenContainer.querySelector(`[data-node-id="${draggedId}"]`);
            const dropTargetEl = e.target.closest('.tree-node');
        
            if (draggedEl && dropTargetEl && draggedEl !== dropTargetEl) {
                const nodes = Array.from(childrenContainer.children);
                const draggedIndex = nodes.indexOf(draggedEl);
                const targetIndex = nodes.indexOf(dropTargetEl);
        
                if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
                    const temp = node.child[draggedIndex];
                    node.child.splice(draggedIndex, 1);
                    node.child.splice(targetIndex, 0, temp);
        
                    this.renderTree(); // 重新渲染
                }
            }
        });
        

        // 如果有子节点
        if (node.child && node.child.length > 0) {
            const toggleButton = document.createElement('button');
            toggleButton.className = 'tree-toggle';
            toggleButton.textContent = '▶';
            toggleButton.onclick = () => {
                childrenContainer.style.display = 
                    childrenContainer.style.display === 'none' ? 'block' : 'none';
                toggleButton.textContent = 
                    childrenContainer.style.display === 'none' ? '▶' : '▼';
            };
            headerElement.prepend(toggleButton);
            
            node.child.forEach(child => {
                this.renderTreeView(child, childrenContainer, level + 1);
            });
        }
        
        // 组装所有元素
        nodeElement.appendChild(headerElement);
        nodeElement.appendChild(contentElement);
        nodeElement.appendChild(childrenContainer);
        parentElement.appendChild(nodeElement);
        
        // 默认展开前两级
        if (level < 2) {
            childrenContainer.style.display = 'block';
        } else {
            childrenContainer.style.display = 'none';
        }
    }

    deleteNode(parent, target) {
        if (!parent.child) return false;
        const index = parent.child.indexOf(target);
        if (index !== -1) {
            parent.child.splice(index, 1); // 删除目标
            return true;
        }
        // 递归寻找并删除
        for (let child of parent.child) {
            if (this.deleteNode(child, target)) return true;
        }
        return false;
    }
    

    async saveTreeToServer(treeId) {
        try {
            const response = await fetch(`/api/tree/${this.videoId}/${treeId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.currentTree),
            });
            const result = await response.json();
            if (result.status === 'success') {
                alert('保存成功！');
            } else {
                alert('保存失败：' + result.error);
            }
        } catch (error) {
            alert('请求失败：' + error.message);
        }
    }

    // 新增方法
    setupZoomControls(svg) {
        const zoom = d3.zoom();
    
        // 放大
        document.getElementById('zoom-in').addEventListener('click', () => {
            svg.transition()
                .call(zoom.scaleBy, 1.3);
        });
    
        // 缩小
        document.getElementById('zoom-out').addEventListener('click', () => {
            svg.transition()
                .call(zoom.scaleBy, 0.7);
        });
    
        // 重置
        document.getElementById('reset-zoom').addEventListener('click', () => {
            const containerWidth = this.container.clientWidth;
            const containerHeight = this.container.clientHeight;
            svg.transition()
                .duration(750)
                .call(zoom.transform, d3.zoomIdentity
                    .translate(containerWidth/4, containerHeight/4)
                    .scale(0.8));
        });
    }

    renderGraphView() {
        // 清空容器
        this.graphContainer.innerHTML = '';
        
        // 设置尺寸参数
        const containerWidth = this.container.clientWidth;
        const containerHeight = this.container.clientHeight;
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        
        // 创建SVG画布
        const svg = d3.select(this.graphContainer)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
            .call(d3.zoom()
                .scaleExtent([0.1, 5]) // 缩放范围 (10% - 500%)
                .on('zoom', (event) => {
                    innerGroup.attr('transform', event.transform);
                }))
            .append('g');
        
        // 内部组用于缩放和拖动
        const innerGroup = svg.append('g');
        
        // 创建横向树布局
        const treeLayout = d3.tree()
            .size([containerHeight * 2, containerWidth * 1.5]) // 扩大布局区域
            .nodeSize([80, 150]); // 节点垂直/水平间距
    
        // 转换数据
        const root = d3.hierarchy(this.currentTree, d => d.child);
        const treeData = treeLayout(root);
    
        // 绘制连线
        innerGroup.selectAll('.link')
            .data(treeData.links())
            .enter()
            .append('path')
            .attr('class', 'link')
            .attr('d', d3.linkHorizontal() // 横向连线
                .x(d => d.y)
                .y(d => d.x));
    
        // 创建节点组
        const node = innerGroup.selectAll('.node')
            .data(treeData.descendants())
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.y},${d.x})`);
    
        // 添加节点背景卡片
        node.append('rect')
            .attr('width', 140)
            .attr('height', 50)
            .attr('x', -70)
            .attr('y', -25)
            .attr('rx', 5)
            .attr('ry', 5)
            .attr('fill', d => d.depth === 0 ? '#1890ff' : '#fff')
            .attr('stroke', '#1890ff');
    
        // 添加节点文本
        node.append('text')
            .attr('dy', 4)
            .attr('text-anchor', 'middle')
            .text(d => d.data.name)
            .attr('fill', d => d.depth === 0 ? '#fff' : '#333')
            .on('dblclick', function (event, d) {
                const newName = prompt('请输入新的节点名称：', d.data.name);
                if (newName && newName.trim() !== '') {
                    d.data.name = newName;
                    d3.select(this).text(newName); // 更新图上文字
                }
            });
        
        // 添加子节点按钮
        node.append('text')
            .attr('x', 75)
            .attr('y', -15)
            .attr('class', 'node-button')
            .text('+')
            .style('cursor', 'pointer')
            .style('fill', '#2e8b57')
            .on('click', (event, d) => {
                const newNode = {
                    name: '新节点',
                    type: '知识点',
                    time: '',
                    content: '新建内容描述',
                    child: []
                };
                if (!d.data.child) d.data.child = [];
                d.data.child.push(newNode);
                this.renderTree(); // 重新渲染
            });
        
        // 删除节点按钮（排除根节点）
        node.filter(d => d.depth > 0) // 排除根节点
            .append('text')
            .attr('x', 75)
            .attr('y', 10)
            .attr('class', 'node-button')
            .text('🗑')
            .style('cursor', 'pointer')
            .style('fill', '#d9534f')
            .on('click', (event, d) => {
                if (confirm('确定要删除此节点吗？')) {
                    this.deleteNode(this.currentTree, d.data);
                    this.renderTree();
                }
            });
    
        // 初始缩放和居中
        const bounds = innerGroup.node().getBBox();
        const dx = bounds.width;
        const dy = bounds.height;
        const x = (containerWidth - dx) / 2 - bounds.x;
        const y = (containerHeight - dy) / 2 - bounds.y;
        
        svg.call(d3.zoom().transform, 
            d3.zoomIdentity.translate(x, y).scale(0.9));

        this.setupZoomControls(svg);
    }

    renderListView(node, parentElement) {
        const listContainer = document.createElement('div');
        listContainer.className = 'list-view-container';
    
        const flattenNodes = this.flattenTree(node);
    
        flattenNodes.forEach(({ node, level }) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'list-view-item';
            itemElement.style.paddingLeft = `${level * 15}px`;
    
            const titleRow = document.createElement('div');
            titleRow.className = 'list-view-title-row';
    
            // 缩进标识
            if (level > 0) {
                const indent = document.createElement('span');
                indent.className = 'list-indent';
                indent.innerHTML = '&nbsp;'.repeat(level * 2);
                titleRow.appendChild(indent);
            }
    
            // 名称（可编辑）
            const titleElement = document.createElement('span');
            titleElement.className = 'list-view-title';
            titleElement.textContent = node.name;
            titleElement.addEventListener('dblclick', () => {
                const newName = prompt('请输入新名称：', node.name);
                if (newName && newName.trim() !== '') {
                    node.name = newName;
                    titleElement.textContent = newName;
                }
            });
    
            // 类型
            if (node.type) {
                const typeElement = document.createElement('span');
                typeElement.className = 'list-view-type';
                typeElement.textContent = node.type;
                titleRow.appendChild(typeElement);
            }
    
            // 时间
            if (node.time) {
                const timeElement = document.createElement('span');
                timeElement.className = 'list-view-time';
                timeElement.textContent = node.time.split(' --> ')[0];
                titleRow.appendChild(timeElement);
            }
    
            titleRow.appendChild(titleElement);
            // 添加按钮
            const addBtn = document.createElement('button');
            addBtn.textContent = '+';
            addBtn.title = '添加子节点';
            addBtn.className = 'list-action-button';
            addBtn.onclick = () => {
                const newNode = {
                    name: '新节点',
                    type: '知识点',
                    time: '',
                    content: '新建内容描述',
                    child: []
                };
                if (!node.child) node.child = [];
                node.child.push(newNode);
                this.renderTree();
            };

            // 删除按钮（根节点不能删）
            if (level > 0) {
                const delBtn = document.createElement('button');
                delBtn.textContent = '🗑';
                delBtn.title = '删除节点';
                delBtn.className = 'list-action-button';
                delBtn.onclick = () => {
                    if (confirm('确定要删除此节点吗？')) {
                        this.deleteNode(this.currentTree, node);
                        this.renderTree();
                    }
                };
                titleRow.appendChild(delBtn);
        }

                titleRow.appendChild(addBtn);

            itemElement.appendChild(titleRow);
    
            // 内容描述
            if (node.content) {
                const descElement = document.createElement('div');
                descElement.className = 'list-view-desc';
                descElement.textContent = node.content;
                itemElement.appendChild(descElement);
            }
    
            listContainer.appendChild(itemElement);
        });
    
        parentElement.appendChild(listContainer);
    }
    
    flattenTree(node, result = [], level = 0) {
        result.push({ node, level });
        if (node.child && node.child.length > 0) {
            node.child.forEach(child => {
                this.flattenTree(child, result, level + 1);
            });
        }
        return result;
    }
    
    showError(error) {
        this.container.innerHTML = `
            <div class="error-message">
                <p>加载树状图失败</p>
                <p>${error.message}</p>
                <button onclick="location.reload()">重试</button>
            </div>
        `;
    }
}

=======
=======
>>>>>>> origin/main
class TreeViewer {
    constructor(containerId, videoId) {
        this.container = document.getElementById(containerId);
        this.videoId = videoId;  // 加上 videoId
        this.currentTree = null;
        this.currentViewMode = 'graph';
        this.treeData = null;
        this.initEventListeners();
        
        this.graphContainer = document.createElement('div');
        this.graphContainer.className = 'tree-graph-container';
        this.container.appendChild(this.graphContainer);
        this.loadTree(1);
    }
    
    initEventListeners() {
        document.getElementById('tree-select').addEventListener('change', (e) => {
            this.loadTree(e.target.value);
        });
        
        document.getElementById('view-mode').addEventListener('change', (e) => {
            this.currentViewMode = e.target.value;
            this.renderTree();
        });

        document.getElementById('save-tree').addEventListener('click', () => {
            const treeId = document.getElementById('tree-select').value;
            this.saveTreeToServer(treeId);
        });
    }
    
    async loadTree(treeId) {
        try {
            const response = await fetch(`/api/tree/${this.videoId}/${treeId}`);
            this.currentTree = await response.json();
            this.treeData = this.convertToD3Hierarchy(this.currentTree);
            this.renderTree();
        } catch (error) {
            console.error('加载树状图失败:', error);
            this.showError(error);
        }
    }
    
    // 将原始数据转换为D3需要的层次结构
    convertToD3Hierarchy(node) {
        const root = d3.hierarchy(node);
        root.descendants().forEach(d => {
            d.data._children = d.data.child; // 保留原始子节点引用
        });
        return root;
    }
    
    renderTree() {
        if (!this.currentTree) return;
        
        this.graphContainer.innerHTML = '';
        
        switch (this.currentViewMode) {
            case 'graph':
                this.renderGraphView();
                break;
            case 'tree':
                this.renderTreeView(this.currentTree, this.graphContainer);
                break;
            case 'list':
                this.renderListView(this.currentTree, this.graphContainer);
                break;
        }
    }

    renderTreeView(node, parentElement, level = 0) {
        const nodeElement = document.createElement('div');
        nodeElement.className = 'tree-node';
        nodeElement.style.paddingLeft = `${level * 20}px`; // 用padding控制缩进
        
        // 设置为可拖拽
        nodeElement.draggable = true;
        nodeElement.dataset.nodeId = Math.random().toString(36).substring(2, 9); // 生成唯一ID

        // 拖动开始：存储拖动项ID
        nodeElement.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', nodeElement.dataset.nodeId);
            e.stopPropagation();
        });

        // 节点标题区域
        const headerElement = document.createElement('div');
        headerElement.className = 'tree-node-header';
        
        // 节点名称
        const titleElement = document.createElement('span');
        titleElement.className = 'tree-node-title';
        titleElement.textContent = node.name;
        titleElement.style.fontWeight = level === 0 ? 'bold' : 'normal';
        
        // 双击可编辑
        titleElement.addEventListener('dblclick', () => {
            const newName = prompt('请输入新的名称：', node.name);
            if (newName !== null && newName.trim() !== '') {
                node.name = newName;
                titleElement.textContent = newName;
            }
        });

        // 节点类型标签
        if (node.type) {
            const typeElement = document.createElement('span');
            typeElement.className = 'tree-node-type';
            typeElement.textContent = `[${node.type}]`;
            headerElement.appendChild(typeElement);
        }
        
        // 时间标签
        if (node.time) {
            const timeElement = document.createElement('span');
            timeElement.className = 'tree-node-time';
            timeElement.textContent = node.time.split(' --> ')[0]; // 只显示开始时间
            headerElement.appendChild(timeElement);
        }
        
        headerElement.appendChild(titleElement);

        const addBtn = document.createElement('button');
        addBtn.textContent = '+';
        addBtn.className = 'tree-node-action';
        addBtn.title = '添加子节点';
        addBtn.onclick = () => {
            const newNode = {
                name: '新节点',
                type: '知识点',
                time: '',
                content: '新建内容描述',
                child: []
        };
            if (!node.child) node.child = [];
            node.child.push(newNode);
            this.renderTree(); // 重新渲染
        };

        // 删除节点按钮（排除根节点）
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑';
        deleteBtn.className = 'tree-node-action';
        deleteBtn.title = '删除此节点';
        deleteBtn.onclick = () => {
            if (confirm('确定要删除此节点吗？')) {
                this.deleteNode(this.currentTree, node); // 自定义删除函数
                this.renderTree();
            }
        };

        headerElement.appendChild(addBtn);
        if (level > 0) headerElement.appendChild(deleteBtn); // 根节点不能删
    
        
        // 内容区域
        const contentElement = document.createElement('div');
        contentElement.className = 'tree-node-content';
        
        // 节点内容描述
        if (node.content) {
            const descElement = document.createElement('div');
            descElement.className = 'tree-node-desc';
            descElement.textContent = node.content;
            contentElement.appendChild(descElement);
        }
        
        // 子节点容器
        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'tree-children-container';
        
        childrenContainer.addEventListener('dragover', (e) => {
            e.preventDefault(); // 允许放置
        });
        
        childrenContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedId = e.dataTransfer.getData('text/plain');
            const draggedEl = childrenContainer.querySelector(`[data-node-id="${draggedId}"]`);
            const dropTargetEl = e.target.closest('.tree-node');
        
            if (draggedEl && dropTargetEl && draggedEl !== dropTargetEl) {
                const nodes = Array.from(childrenContainer.children);
                const draggedIndex = nodes.indexOf(draggedEl);
                const targetIndex = nodes.indexOf(dropTargetEl);
        
                if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
                    const temp = node.child[draggedIndex];
                    node.child.splice(draggedIndex, 1);
                    node.child.splice(targetIndex, 0, temp);
        
                    this.renderTree(); // 重新渲染
                }
            }
        });
        

        // 如果有子节点
        if (node.child && node.child.length > 0) {
            const toggleButton = document.createElement('button');
            toggleButton.className = 'tree-toggle';
            toggleButton.textContent = '▶';
            toggleButton.onclick = () => {
                childrenContainer.style.display = 
                    childrenContainer.style.display === 'none' ? 'block' : 'none';
                toggleButton.textContent = 
                    childrenContainer.style.display === 'none' ? '▶' : '▼';
            };
            headerElement.prepend(toggleButton);
            
            node.child.forEach(child => {
                this.renderTreeView(child, childrenContainer, level + 1);
            });
        }
        
        // 组装所有元素
        nodeElement.appendChild(headerElement);
        nodeElement.appendChild(contentElement);
        nodeElement.appendChild(childrenContainer);
        parentElement.appendChild(nodeElement);
        
        // 默认展开前两级
        if (level < 2) {
            childrenContainer.style.display = 'block';
        } else {
            childrenContainer.style.display = 'none';
        }
    }

    deleteNode(parent, target) {
        if (!parent.child) return false;
        const index = parent.child.indexOf(target);
        if (index !== -1) {
            parent.child.splice(index, 1); // 删除目标
            return true;
        }
        // 递归寻找并删除
        for (let child of parent.child) {
            if (this.deleteNode(child, target)) return true;
        }
        return false;
    }
    

    async saveTreeToServer(treeId) {
        try {
            const response = await fetch(`/api/tree/${this.videoId}/${treeId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.currentTree),
            });
            const result = await response.json();
            if (result.status === 'success') {
                alert('保存成功！');
            } else {
                alert('保存失败：' + result.error);
            }
        } catch (error) {
            alert('请求失败：' + error.message);
        }
    }

    // 新增方法
    setupZoomControls(svg) {
        const zoom = d3.zoom();
    
        // 放大
        document.getElementById('zoom-in').addEventListener('click', () => {
            svg.transition()
                .call(zoom.scaleBy, 1.3);
        });
    
        // 缩小
        document.getElementById('zoom-out').addEventListener('click', () => {
            svg.transition()
                .call(zoom.scaleBy, 0.7);
        });
    
        // 重置
        document.getElementById('reset-zoom').addEventListener('click', () => {
            const containerWidth = this.container.clientWidth;
            const containerHeight = this.container.clientHeight;
            svg.transition()
                .duration(750)
                .call(zoom.transform, d3.zoomIdentity
                    .translate(containerWidth/4, containerHeight/4)
                    .scale(0.8));
        });
    }

    renderGraphView() {
        // 清空容器
        this.graphContainer.innerHTML = '';
        
        // 设置尺寸参数
        const containerWidth = this.container.clientWidth;
        const containerHeight = this.container.clientHeight;
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        
        // 创建SVG画布
        const svg = d3.select(this.graphContainer)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
            .call(d3.zoom()
                .scaleExtent([0.1, 5]) // 缩放范围 (10% - 500%)
                .on('zoom', (event) => {
                    innerGroup.attr('transform', event.transform);
                }))
            .append('g');
        
        // 内部组用于缩放和拖动
        const innerGroup = svg.append('g');
        
        // 创建横向树布局
        const treeLayout = d3.tree()
            .size([containerHeight * 2, containerWidth * 1.5]) // 扩大布局区域
            .nodeSize([80, 150]); // 节点垂直/水平间距
    
        // 转换数据
        const root = d3.hierarchy(this.currentTree, d => d.child);
        const treeData = treeLayout(root);
    
        // 绘制连线
        innerGroup.selectAll('.link')
            .data(treeData.links())
            .enter()
            .append('path')
            .attr('class', 'link')
            .attr('d', d3.linkHorizontal() // 横向连线
                .x(d => d.y)
                .y(d => d.x));
    
        // 创建节点组
        const node = innerGroup.selectAll('.node')
            .data(treeData.descendants())
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.y},${d.x})`);
    
        // 添加节点背景卡片
        node.append('rect')
            .attr('width', 140)
            .attr('height', 50)
            .attr('x', -70)
            .attr('y', -25)
            .attr('rx', 5)
            .attr('ry', 5)
            .attr('fill', d => d.depth === 0 ? '#1890ff' : '#fff')
            .attr('stroke', '#1890ff');
    
        // 添加节点文本
        node.append('text')
            .attr('dy', 4)
            .attr('text-anchor', 'middle')
            .text(d => d.data.name)
            .attr('fill', d => d.depth === 0 ? '#fff' : '#333')
            .on('dblclick', function (event, d) {
                const newName = prompt('请输入新的节点名称：', d.data.name);
                if (newName && newName.trim() !== '') {
                    d.data.name = newName;
                    d3.select(this).text(newName); // 更新图上文字
                }
            });
        
        // 添加子节点按钮
        node.append('text')
            .attr('x', 75)
            .attr('y', -15)
            .attr('class', 'node-button')
            .text('+')
            .style('cursor', 'pointer')
            .style('fill', '#2e8b57')
            .on('click', (event, d) => {
                const newNode = {
                    name: '新节点',
                    type: '知识点',
                    time: '',
                    content: '新建内容描述',
                    child: []
                };
                if (!d.data.child) d.data.child = [];
                d.data.child.push(newNode);
                this.renderTree(); // 重新渲染
            });
        
        // 删除节点按钮（排除根节点）
        node.filter(d => d.depth > 0) // 排除根节点
            .append('text')
            .attr('x', 75)
            .attr('y', 10)
            .attr('class', 'node-button')
            .text('🗑')
            .style('cursor', 'pointer')
            .style('fill', '#d9534f')
            .on('click', (event, d) => {
                if (confirm('确定要删除此节点吗？')) {
                    this.deleteNode(this.currentTree, d.data);
                    this.renderTree();
                }
            });
    
        // 初始缩放和居中
        const bounds = innerGroup.node().getBBox();
        const dx = bounds.width;
        const dy = bounds.height;
        const x = (containerWidth - dx) / 2 - bounds.x;
        const y = (containerHeight - dy) / 2 - bounds.y;
        
        svg.call(d3.zoom().transform, 
            d3.zoomIdentity.translate(x, y).scale(0.9));

        this.setupZoomControls(svg);
    }

    renderListView(node, parentElement) {
        const listContainer = document.createElement('div');
        listContainer.className = 'list-view-container';
    
        const flattenNodes = this.flattenTree(node);
    
        flattenNodes.forEach(({ node, level }) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'list-view-item';
            itemElement.style.paddingLeft = `${level * 15}px`;
    
            const titleRow = document.createElement('div');
            titleRow.className = 'list-view-title-row';
    
            // 缩进标识
            if (level > 0) {
                const indent = document.createElement('span');
                indent.className = 'list-indent';
                indent.innerHTML = '&nbsp;'.repeat(level * 2);
                titleRow.appendChild(indent);
            }
    
            // 名称（可编辑）
            const titleElement = document.createElement('span');
            titleElement.className = 'list-view-title';
            titleElement.textContent = node.name;
            titleElement.addEventListener('dblclick', () => {
                const newName = prompt('请输入新名称：', node.name);
                if (newName && newName.trim() !== '') {
                    node.name = newName;
                    titleElement.textContent = newName;
                }
            });
    
            // 类型
            if (node.type) {
                const typeElement = document.createElement('span');
                typeElement.className = 'list-view-type';
                typeElement.textContent = node.type;
                titleRow.appendChild(typeElement);
            }
    
            // 时间
            if (node.time) {
                const timeElement = document.createElement('span');
                timeElement.className = 'list-view-time';
                timeElement.textContent = node.time.split(' --> ')[0];
                titleRow.appendChild(timeElement);
            }
    
            titleRow.appendChild(titleElement);
            // 添加按钮
            const addBtn = document.createElement('button');
            addBtn.textContent = '+';
            addBtn.title = '添加子节点';
            addBtn.className = 'list-action-button';
            addBtn.onclick = () => {
                const newNode = {
                    name: '新节点',
                    type: '知识点',
                    time: '',
                    content: '新建内容描述',
                    child: []
                };
                if (!node.child) node.child = [];
                node.child.push(newNode);
                this.renderTree();
            };

            // 删除按钮（根节点不能删）
            if (level > 0) {
                const delBtn = document.createElement('button');
                delBtn.textContent = '🗑';
                delBtn.title = '删除节点';
                delBtn.className = 'list-action-button';
                delBtn.onclick = () => {
                    if (confirm('确定要删除此节点吗？')) {
                        this.deleteNode(this.currentTree, node);
                        this.renderTree();
                    }
                };
                titleRow.appendChild(delBtn);
        }

                titleRow.appendChild(addBtn);

            itemElement.appendChild(titleRow);
    
            // 内容描述
            if (node.content) {
                const descElement = document.createElement('div');
                descElement.className = 'list-view-desc';
                descElement.textContent = node.content;
                itemElement.appendChild(descElement);
            }
    
            listContainer.appendChild(itemElement);
        });
    
        parentElement.appendChild(listContainer);
    }
    
    flattenTree(node, result = [], level = 0) {
        result.push({ node, level });
        if (node.child && node.child.length > 0) {
            node.child.forEach(child => {
                this.flattenTree(child, result, level + 1);
            });
        }
        return result;
    }
    
    showError(error) {
        this.container.innerHTML = `
            <div class="error-message">
                <p>加载树状图失败</p>
                <p>${error.message}</p>
                <button onclick="location.reload()">重试</button>
            </div>
        `;
    }
<<<<<<< HEAD
}

>>>>>>> origin/main
=======
}
>>>>>>> origin/main
