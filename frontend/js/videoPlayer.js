<<<<<<< HEAD
<<<<<<< HEAD
class VideoPlayer {
    constructor(videoId) {
        this.video = document.getElementById(videoId);
        this.subtitleViewer = null;
        
        // 绑定事件
        this.video.addEventListener('timeupdate', () => this.onTimeUpdate());
    }
    
    setSubtitleViewer(subtitleViewer) {
        this.subtitleViewer = subtitleViewer;
    }
    
    onTimeUpdate() {
        if (this.subtitleViewer) {
            this.subtitleViewer.update(this.video.currentTime);
        }
    }
    
    getCurrentTime() {
        return this.video.currentTime;
    }
    
    play() {
        this.video.play();
    }
    
    pause() {
        this.video.pause();
    }
    
    seekTo(time) {
        this.video.currentTime = time;
    }
=======
=======
>>>>>>> origin/main
class VideoPlayer {
    constructor(videoId) {
        this.video = document.getElementById(videoId);
        this.subtitleViewer = null;
        
        // 绑定事件
        this.video.addEventListener('timeupdate', () => this.onTimeUpdate());
    }
    
    setSubtitleViewer(subtitleViewer) {
        this.subtitleViewer = subtitleViewer;
    }
    
    onTimeUpdate() {
        if (this.subtitleViewer) {
            this.subtitleViewer.update(this.video.currentTime);
        }
    }
    
    getCurrentTime() {
        return this.video.currentTime;
    }
    
    play() {
        this.video.play();
    }
    
    pause() {
        this.video.pause();
    }
    
    seekTo(time) {
        this.video.currentTime = time;
    }
<<<<<<< HEAD
>>>>>>> origin/main
=======
>>>>>>> origin/main
}