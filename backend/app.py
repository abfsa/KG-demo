<<<<<<< HEAD
<<<<<<< HEAD
from flask import Flask, send_from_directory, jsonify, request, send_file
import os
from werkzeug.utils import secure_filename
import subprocess
import re
import sys

app = Flask(__name__)

# 获取项目根目录
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, 'frontend')
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
UPLOAD_VIDEO_PATH = os.path.join(DATA_DIR)  # 视频保存路径
UPLOAD_OUTLINE_PATH = os.path.join(DATA_DIR)  # 教案保存路径（也是 data 文件夹）

# 假设用户ID是固定的，之后可以修改
USER_ID = 'user1'  # 假设当前就是 user1

def sanitize_filename(filename):
    """清除文件名中非法字符的函数"""
    return re.sub(r'[<>:"/\\|?*]', '', filename)

def call_video_processor(input_path, output_dir, video_name):
    """调用 video_processor.py 脚本处理视频"""
    command = [
        sys.executable, './backend/video_processor.py',
        '--input', input_path,
        '--output', output_dir,
        '--name', video_name
    ]
    subprocess.run(command, check=True)

# 主页面路由
@app.route('/')
def index():
    return send_from_directory(FRONTEND_DIR, 'index.html')

# 静态文件路由
@app.route('/<path:subpath>')
def serve_static(subpath):
    if subpath.startswith('data/'):
        return send_from_directory(DATA_DIR, subpath[5:])
    elif subpath.startswith('css/') or subpath.startswith('js/') or subpath.startswith('lib/'):
        return send_from_directory(FRONTEND_DIR, subpath)
    else:
        return send_from_directory(FRONTEND_DIR, subpath)

@app.route('/api/thumbnail/<video_id>', methods=['GET'])
def get_thumbnail(video_id):
    user_dir = os.path.join(DATA_DIR, USER_ID)
    video_dir = os.path.join(user_dir, video_id)
    thumbnail_path = os.path.join(video_dir, 'thumbnail.jpg')
    
    if os.path.exists(thumbnail_path):
        return send_file(thumbnail_path)
    else:
        return jsonify({'error': 'Thumbnail not found'}), 404

@app.route('/api/tree/<video_id>/<tree_id>', methods=['GET', 'POST'])
def tree_route(video_id, tree_id):
    filename = f'tree{tree_id}.json'
    filepath = os.path.join(DATA_DIR, USER_ID, video_id, filename)

    if request.method == 'GET':
        try:
            return send_file(filepath)
        except FileNotFoundError:
            return jsonify({'error': 'Tree not found'}), 404

    elif request.method == 'POST':
        try:
            data = request.get_json()
            with open(filepath, 'w', encoding='utf-8') as f:
                import json
                json.dump(data, f, ensure_ascii=False, indent=2)
            return jsonify({'status': 'success'})
        except Exception as e:
            return jsonify({'error': str(e)}), 500

@app.route('/api/report/<video_id>')
def get_report(video_id):
    filepath = os.path.join(DATA_DIR, USER_ID, video_id, 'report.md')
    return send_file(filepath, as_attachment=True, download_name='分析报告.md')

@app.route('/api/outline/<video_id>')
def get_outline(video_id):
    filepath = os.path.join(DATA_DIR, USER_ID, video_id, 'outline.md')
    return send_file(filepath, as_attachment=True, download_name='教案.md')

@app.route('/upload')
def upload_page():
    return send_from_directory(FRONTEND_DIR, 'upload.html')

@app.route('/api/upload/outline', methods=['POST'])
def upload_outline():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    filename = secure_filename('new_outline.md')  # 强制保存为固定文件名，方便后续处理
    file.save(os.path.join(UPLOAD_OUTLINE_PATH, filename))
    return jsonify({'message': '教案上传成功'})

@app.route('/api/analyze', methods=['POST'])
def analyze_files():
    try:
        # 在这里调用你的分析逻辑，比如分析视频/教案文件
        # 这里只是示例，假装分析了
        print("开始分析上传的视频和教案...")
        
        # 真实情况下你可以调用模型/脚本来处理
        return jsonify({'message': '分析完成！'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/upload/video', methods=['POST'])
def upload_video():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    name = request.form.get('name')
    if not name:
        return jsonify({'error': 'No video name provided'}), 400
    name = sanitize_filename(name)

    user_dir = os.path.join(DATA_DIR, USER_ID)
    os.makedirs(user_dir, exist_ok=True)

    # 给每个视频生成一个唯一id
    video_dir = os.path.join(user_dir, secure_filename(name))
    os.makedirs(video_dir, exist_ok=True)
    
    # 保存视频
    filepath = os.path.join(video_dir, 'video.mp4')
    file.save(filepath)

    call_video_processor(filepath, video_dir, name)

    return jsonify({'message': '视频上传成功', 'video_id': name})

@app.route('/api/videos', methods=['GET'])
def list_videos():
    user_dir = os.path.join(DATA_DIR, USER_ID)
    if not os.path.exists(user_dir):
        return jsonify([])

    video_ids = [
        name for name in os.listdir(user_dir)
        if os.path.isdir(os.path.join(user_dir, name))
    ]
    
    return jsonify({'videos': video_ids})

@app.route('/videos')
def videos_page():
    return send_from_directory(FRONTEND_DIR, 'videos.html')

@app.route('/video/<video_id>')
def video_detail_page(video_id):
    return send_from_directory(FRONTEND_DIR, 'video_detail.html')

@app.route('/api/analyze/<video_id>', methods=['POST'])
def analyze_video(video_id):
    # 这里可以执行实际分析逻辑，示例简单保存一个 report.md
    video_dir = os.path.join(DATA_DIR, USER_ID, video_id)
    os.makedirs(video_dir, exist_ok=True)

    report_path = os.path.join(video_dir, 'report.md')
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(f'# 分析报告\n\n这是视频 {video_id} 的分析结果。')

    return jsonify({'message': '分析完成！'})

@app.route('/api/download/report/<video_id>', methods=['GET'])
def download_report(video_id):
    video_dir = os.path.join(DATA_DIR, USER_ID, video_id)
    filepath = os.path.join(video_dir, 'report.md')
    return send_file(filepath, as_attachment=True, download_name='分析报告.md')

# 在app.py中添加以下路由
@app.route('/api/images/<video_id>', methods=['GET'])
def get_images(video_id):
    """获取视频对应的图片列表"""
    video_dir = os.path.join(DATA_DIR, USER_ID, video_id)
    
    # 假设图片命名格式为image1.jpg, image2.jpg, image3.jpg
    images = []
    for i in ['coverage', 'logic','timeline']:
        img_path = os.path.join(video_dir, f'{i}.png')
        if os.path.exists(img_path):
            images.append(f'/api/image/{video_id}/{i}')
    
    return jsonify({'images': images})

@app.route('/api/image/<video_id>/<int:image_num>', methods=['GET'])
def get_image(video_id, image_name):
    """获取单个图片"""
    video_dir = os.path.join(DATA_DIR, USER_ID, video_id)
    img_path = os.path.join(video_dir, f'{image_name}.jpg')
    
    if os.path.exists(img_path):
        return send_file(img_path)
    else:
        return jsonify({'error': 'Image not found'}), 404

# 在现有路由基础上添加以下内容
@app.route('/api/analysis_images/<video_id>')
def get_analysis_images(video_id):
    """获取分析图片路径"""
    video_dir = os.path.join(DATA_DIR, USER_ID, video_id)
    images = {
        'timeline': f'/api/analysis_image/{video_id}/timeline',
        'coverage': f'/api/analysis_image/{video_id}/coverage',
        'logic': f'/api/analysis_image/{video_id}/logic'
    }
    return jsonify(images)

@app.route('/api/analysis_image/<video_id>/<image_type>')
def get_analysis_image(video_id, image_type):
    """获取具体分析图片"""
    video_dir = os.path.join(DATA_DIR, USER_ID, video_id)
    valid_types = ['timeline', 'coverage', 'logic']
    
    if image_type not in valid_types:
        return jsonify({'error': 'Invalid image type'}), 400
    
    img_path = os.path.join(video_dir, f'{image_type}.png')
    
    if os.path.exists(img_path):
        return send_file(img_path, mimetype='image/png')
    else:
        return jsonify({'error': 'Image not found'}), 404

if __name__ == '__main__':
=======
from flask import Flask, send_from_directory, jsonify, request, send_file
=======
from flask import Flask, send_from_directory, jsonify, request, send_file, abort
>>>>>>> origin/main
import os
from werkzeug.utils import secure_filename
import subprocess
import re
import sys
<<<<<<< HEAD
=======
import json
>>>>>>> origin/main

app = Flask(__name__)

# 获取项目根目录
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, 'frontend')
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
UPLOAD_VIDEO_PATH = os.path.join(DATA_DIR)  # 视频保存路径
UPLOAD_OUTLINE_PATH = os.path.join(DATA_DIR)  # 教案保存路径（也是 data 文件夹）

# 假设用户ID是固定的，之后可以修改
USER_ID = 'user1'  # 假设当前就是 user1

def sanitize_filename(filename):
    """清除文件名中非法字符的函数"""
    return re.sub(r'[<>:"/\\|?*]', '', filename)

def call_video_processor(input_path, output_dir, video_name):
    """调用 video_processor.py 脚本处理视频"""
    command = [
        sys.executable, './backend/video_processor.py',
        '--input', input_path,
        '--output', output_dir,
        '--name', video_name
    ]
    subprocess.run(command, check=True)

# 主页面路由
@app.route('/')
def index():
    return send_from_directory(FRONTEND_DIR, 'index.html')

# 静态文件路由
@app.route('/<path:subpath>')
def serve_static(subpath):
    if subpath.startswith('data/'):
        return send_from_directory(DATA_DIR, subpath[5:])
    elif subpath.startswith('css/') or subpath.startswith('js/') or subpath.startswith('lib/'):
        return send_from_directory(FRONTEND_DIR, subpath)
    else:
        return send_from_directory(FRONTEND_DIR, subpath)

@app.route('/api/thumbnail/<video_id>', methods=['GET'])
def get_thumbnail(video_id):
    user_dir = os.path.join(DATA_DIR, USER_ID)
    video_dir = os.path.join(user_dir, video_id)
    thumbnail_path = os.path.join(video_dir, 'thumbnail.jpg')
    
    if os.path.exists(thumbnail_path):
        return send_file(thumbnail_path)
    else:
        return jsonify({'error': 'Thumbnail not found'}), 404

@app.route('/api/tree/<video_id>/<tree_id>', methods=['GET', 'POST'])
def tree_route(video_id, tree_id):
    filename = f'tree{tree_id}.json'
    filepath = os.path.join(DATA_DIR, USER_ID, video_id, filename)

    if request.method == 'GET':
        try:
            return send_file(filepath)
        except FileNotFoundError:
            return jsonify({'error': 'Tree not found'}), 404

    elif request.method == 'POST':
        try:
            data = request.get_json()
            with open(filepath, 'w', encoding='utf-8') as f:
                import json
                json.dump(data, f, ensure_ascii=False, indent=2)
            return jsonify({'status': 'success'})
        except Exception as e:
            return jsonify({'error': str(e)}), 500

@app.route('/api/report/<video_id>')
def get_report(video_id):
<<<<<<< HEAD
    filepath = os.path.join(DATA_DIR, USER_ID, video_id, 'report.md')
    return send_file(filepath, as_attachment=True, download_name='分析报告.md')

@app.route('/api/outline/<video_id>')
def get_outline(video_id):
    filepath = os.path.join(DATA_DIR, USER_ID, video_id, 'outline.md')
    return send_file(filepath, as_attachment=True, download_name='教案.md')
=======
    filepath = os.path.join(DATA_DIR, USER_ID, video_id, 'report.json')
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            report_data = json.load(f)
        return jsonify(report_data)
    except FileNotFoundError:
        abort(404, description="Report not found")

@app.route('/api/outline/<video_id>')
def get_outline(video_id):
    filepath = os.path.join(DATA_DIR, USER_ID, video_id, 'outline.json')
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            outline_data = json.load(f)
        return jsonify(outline_data)
    except FileNotFoundError:
        abort(404, description="outline not found")
>>>>>>> origin/main

@app.route('/upload')
def upload_page():
    return send_from_directory(FRONTEND_DIR, 'upload.html')

@app.route('/api/upload/outline', methods=['POST'])
def upload_outline():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    filename = secure_filename('new_outline.md')  # 强制保存为固定文件名，方便后续处理
    file.save(os.path.join(UPLOAD_OUTLINE_PATH, filename))
    return jsonify({'message': '教案上传成功'})

@app.route('/api/analyze', methods=['POST'])
def analyze_files():
    try:
        # 在这里调用你的分析逻辑，比如分析视频/教案文件
        # 这里只是示例，假装分析了
        print("开始分析上传的视频和教案...")
        
        # 真实情况下你可以调用模型/脚本来处理
        return jsonify({'message': '分析完成！'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/upload/video', methods=['POST'])
def upload_video():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    name = request.form.get('name')
    if not name:
        return jsonify({'error': 'No video name provided'}), 400
    name = sanitize_filename(name)

    user_dir = os.path.join(DATA_DIR, USER_ID)
    os.makedirs(user_dir, exist_ok=True)

    # 给每个视频生成一个唯一id
    video_dir = os.path.join(user_dir, secure_filename(name))
    os.makedirs(video_dir, exist_ok=True)
    
    # 保存视频
    filepath = os.path.join(video_dir, 'video.mp4')
    file.save(filepath)

    call_video_processor(filepath, video_dir, name)

    return jsonify({'message': '视频上传成功', 'video_id': name})

@app.route('/api/videos', methods=['GET'])
def list_videos():
    user_dir = os.path.join(DATA_DIR, USER_ID)
    if not os.path.exists(user_dir):
        return jsonify([])

    video_ids = [
        name for name in os.listdir(user_dir)
        if os.path.isdir(os.path.join(user_dir, name))
    ]
    
    return jsonify({'videos': video_ids})

@app.route('/videos')
def videos_page():
    return send_from_directory(FRONTEND_DIR, 'videos.html')

@app.route('/video/<video_id>')
def video_detail_page(video_id):
    return send_from_directory(FRONTEND_DIR, 'video_detail.html')

@app.route('/api/analyze/<video_id>', methods=['POST'])
def analyze_video(video_id):
    # 这里可以执行实际分析逻辑，示例简单保存一个 report.md
    video_dir = os.path.join(DATA_DIR, USER_ID, video_id)
    os.makedirs(video_dir, exist_ok=True)

    report_path = os.path.join(video_dir, 'report.md')
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(f'# 分析报告\n\n这是视频 {video_id} 的分析结果。')

    return jsonify({'message': '分析完成！'})

@app.route('/api/download/report/<video_id>', methods=['GET'])
def download_report(video_id):
    video_dir = os.path.join(DATA_DIR, USER_ID, video_id)
    filepath = os.path.join(video_dir, 'report.md')
    return send_file(filepath, as_attachment=True, download_name='分析报告.md')

# 在app.py中添加以下路由
@app.route('/api/images/<video_id>', methods=['GET'])
def get_images(video_id):
    """获取视频对应的图片列表"""
    video_dir = os.path.join(DATA_DIR, USER_ID, video_id)
    
    # 假设图片命名格式为image1.jpg, image2.jpg, image3.jpg
    images = []
    for i in ['coverage', 'logic','timeline']:
        img_path = os.path.join(video_dir, f'{i}.png')
        if os.path.exists(img_path):
            images.append(f'/api/image/{video_id}/{i}')
    
    return jsonify({'images': images})

@app.route('/api/image/<video_id>/<int:image_num>', methods=['GET'])
def get_image(video_id, image_name):
    """获取单个图片"""
    video_dir = os.path.join(DATA_DIR, USER_ID, video_id)
    img_path = os.path.join(video_dir, f'{image_name}.jpg')
    
    if os.path.exists(img_path):
        return send_file(img_path)
    else:
        return jsonify({'error': 'Image not found'}), 404

<<<<<<< HEAD
# 在现有路由基础上添加以下内容
=======
>>>>>>> origin/main
@app.route('/api/analysis_images/<video_id>')
def get_analysis_images(video_id):
    """获取分析图片路径"""
    video_dir = os.path.join(DATA_DIR, USER_ID, video_id)
    images = {
        'timeline': f'/api/analysis_image/{video_id}/timeline',
        'coverage': f'/api/analysis_image/{video_id}/coverage',
        'logic': f'/api/analysis_image/{video_id}/logic'
    }
    return jsonify(images)

@app.route('/api/analysis_image/<video_id>/<image_type>')
def get_analysis_image(video_id, image_type):
    """获取具体分析图片"""
    video_dir = os.path.join(DATA_DIR, USER_ID, video_id)
    valid_types = ['timeline', 'coverage', 'logic']
    
    if image_type not in valid_types:
        return jsonify({'error': 'Invalid image type'}), 400
    
    img_path = os.path.join(video_dir, f'{image_type}.png')
    
    if os.path.exists(img_path):
        return send_file(img_path, mimetype='image/png')
    else:
        return jsonify({'error': 'Image not found'}), 404

<<<<<<< HEAD
if __name__ == '__main__':
>>>>>>> origin/main
=======
@app.route('/api/html/<username>/<video_id>/<html_type>')
def serve_html_file(username, video_id, html_type):
    valid_types = ['timeline', 'logic']
    if html_type not in valid_types:
        return "Invalid request", 400
    video_dir = os.path.join(DATA_DIR, USER_ID, video_id)
    file_path = os.path.join(video_dir, f"{html_type}.html")
    
    try:
        return send_file(file_path)
    except FileNotFoundError:
        return "Content not available", 404

if __name__ == '__main__':
>>>>>>> origin/main
    app.run(debug=True, port=5000)