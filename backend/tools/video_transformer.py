import json
import os
import time
import requests
import base64
import hashlib
import hmac
import time
import requests
import urllib
import subprocess

lfasr_host = 'https://raasr.xfyun.cn/v2/api'

# 请求的接口名

api_upload = '/upload'
api_get_result = '/getResult'

def generate_thumbnail(input_path, output_path):
    """生成视频缩略图"""
    try:
        subprocess.run([
            'ffmpeg',
            '-i', input_path,
            '-ss', '00:00:01',
            '-vframes', '1',
            '-q:v', '2',
            output_path
        ], check=True)
    except Exception as e:
        print(f"生成缩略图失败: {str(e)}")

def generate_audio(path):
    """
    批量将视频文件转换为音频文件。
    
    参数:
        video_dir (str): 包含视频文件的目录。
        output_dir (str): 输出音频文件的目录。
    """
    # 检查输出目录是否存在，如果不存在则创建
    if not os.path.exists(path):
        os.makedirs(path)

    for filename in os.listdir(path):
        if filename.endswith(('.mp4', '.avi', '.mov', '.mkv')):  # 支持的文件格式
            video_path = os.path.join(path, filename)
            audio_path = os.path.join(path, 'audio.mp3')

            # 构建 FFmpeg 命令
            command = [
                'ffmpeg',
                '-i', video_path,
                '-vn',  # 不包括视频
                '-acodec', 'libmp3lame',  # 使用 MP3 编解码器
                '-ab', '128k',  # 设置音频比特率
                audio_path  # 输出文件路径
            ]

            # 执行 FFmpeg 命令
            try:
                subprocess.run(command, check=True)
                print(f"转换完成：{audio_path}")
            except subprocess.CalledProcessError as e:
                print(f"转换失败：{filename}，错误：{e}")
    return

def convert_to_srt(data):
    srt_lines = []
    index = 1

    for lattice in data['lattice2']:
        begin = int(lattice['begin'])
        end = int(lattice['end'])
        sentence = []
        start_time = begin
        end_time = end

        for segment in lattice['json_1best']['st']['rt']:
            for word_segment in segment['ws']:
                sentence.append(''.join([word['w'] for word in word_segment['cw']]))

        # Join the sentence and format the time
        full_sentence = ''.join(sentence)
        start_time_srt = f"{start_time // 3600000:02d}:{(start_time % 3600000) // 60000:02d}:{(start_time % 60000) // 1000:02d},{start_time % 1000:03d}"
        end_time_srt = f"{end_time // 3600000:02d}:{(end_time % 3600000) // 60000:02d}:{(end_time % 60000) // 1000:02d},{end_time % 1000:03d}"

        srt_lines.append(f"{index}\n--> speaker: \n{start_time_srt} --> {end_time_srt}\n{full_sentence}\n\n")
        index += 1

    return ''.join(srt_lines)

class RequestApi(object):
    def __init__(self, appid, secret_key, upload_file_path):
        self.appid = appid
        self.secret_key = secret_key
        self.upload_file_path = upload_file_path
        self.ts = str(int(time.time()))
        self.signa = self.get_signa()

    def get_signa(self):
        appid = self.appid
        secret_key = self.secret_key
        m2 = hashlib.md5()
        m2.update((appid + self.ts).encode('utf-8'))
        md5 = m2.hexdigest()
        md5 = bytes(md5, encoding='utf-8')
        # 以secret_key为key, 上面的md5为msg， 使用hashlib.sha1加密结果为signa
        signa = hmac.new(secret_key.encode('utf-8'), md5, hashlib.sha1).digest()
        signa = base64.b64encode(signa)
        signa = str(signa, 'utf-8')
        return signa

    def upload(self):
        upload_file_path = self.upload_file_path
        file_len = os.path.getsize(upload_file_path)
        file_name = os.path.basename(upload_file_path)

        param_dict = {}
        param_dict['appId'] = self.appid
        param_dict['signa'] = self.signa
        param_dict['ts'] = self.ts
        param_dict["fileSize"] = file_len
        param_dict["fileName"] = file_name
        param_dict["duration"] = "200"
        data = open(upload_file_path, 'rb').read(file_len)

        response = requests.post(url=lfasr_host + api_upload + "?" + urllib.parse.urlencode(param_dict),
                                 headers={"Content-type": "application/json"}, data=data)
        result = json.loads(response.text)
        return result

    def get_result(self):
        uploadresp = self.upload()
        orderId = uploadresp['content']['orderId']
        param_dict = {}
        param_dict['appId'] = self.appid
        param_dict['signa'] = self.signa
        param_dict['ts'] = self.ts
        param_dict['orderId'] = orderId
        param_dict['resultType'] = "transfer,predict"
        status = 3
        # 建议使用回调的方式查询结果，查询接口有请求频率限制
        while status == 3:
            response = requests.post(url=lfasr_host + api_get_result + "?" + urllib.parse.urlencode(param_dict),
                                     headers={"Content-type": "application/json"})
            result = json.loads(response.text)
            status = result['content']['orderInfo']['status']
            if status == 4:
                break
            time.sleep(5)
        return result