function uploadFileWithProgress(endpoint, fileInputId, successMessage) {
    const fileInput = document.getElementById(fileInputId);
    const file = fileInput.files[0];
    const statusMessage = document.getElementById('status-message');
    const progressBar = document.getElementById('upload-progress-bar');
    const videoName = document.getElementById('video-name').value;
    
    if (!file) {
        alert('请先选择文件');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', videoName);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint, true);

    // 上传进度监听
    xhr.upload.onprogress = function (event) {
        if (event.lengthComputable) {
            const percentComplete = Math.round(event.loaded / event.total * 100);
            progressBar.style.width = percentComplete + '%';
            progressBar.innerText = percentComplete + '%';
        }
    };

    xhr.onload = function () {
        if (xhr.status === 200) {
            alert(successMessage || '上传成功');
            statusMessage.innerText = successMessage || '上传成功！';
            progressBar.style.width = '0%';
            progressBar.innerText = '';
        } else {
            alert('上传失败');
            statusMessage.innerText = '上传失败';
            progressBar.style.width = '0%';
            progressBar.innerText = '';
        }
    };

    xhr.onerror = function () {
        alert('上传失败');
        statusMessage.innerText = '上传失败';
        progressBar.style.width = '0%';
        progressBar.innerText = '';
    };

    statusMessage.innerText = '正在上传...';
    xhr.send(formData);
}

document.getElementById('upload-video-btn').addEventListener('click', function () {
    uploadFileWithProgress('/api/upload/video', 'video-upload', '视频上传成功');
});

document.getElementById('upload-outline-btn').addEventListener('click', function () {
    uploadFileWithProgress('/api/upload/outline', 'outline-upload', '教案上传成功');
});
