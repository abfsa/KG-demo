import argparse
from openai import OpenAI
import os
import json
import subprocess
import re
from tools.generate_doc_tree import *
from tools.video_transformer import *
from tools.generate_video_tree import *
from tools.generate_report import *
from tools.new_outline import *
from tools.generate_logic import *
from tools.generate_timeline import *

prompt_dir = os.path.dirname(os.path.abspath(__file__))

def get_response(prompt):
  response = client.chat.completions.create(
    messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
    ],
    model="qwen-plus",
)
  return response.choices[0].message.content
  
def extract_json_from_string(input_string):
    # 使用正则表达式匹配JSON部分
    json_pattern = r"```json\n(.*?)```"
    match = re.search(json_pattern, input_string, re.DOTALL)

    if match:
        json_str = match.group(1).strip()
        # 转换为JSON对象
        json_data = json.loads(json_str)
        return json_data
    else:
        return None

def process_video(input_path, output_dir, video_name):
    # # 1. 移动视频文件
    # video_path = os.path.join(output_dir, 'video.mp4')
    # os.rename(input_path, video_path)
    # # print('1')
    # # 2. 生成缩略图
    # generate_thumbnail(video_path, os.path.join(output_dir, 'thumbnail.jpg'))
    # print('封面图生成成功...')
    # # 3. 转录音频
    # generate_audio(output_dir)
    # print('音频转录成功...')
    # # 4. 转录字幕
    # api = RequestApi(appid="05813e94",
    #                  secret_key="424545dc683a117f387e2251a107e1bc",
    #                  upload_file_path=os.path.join(output_dir, 'audio.mp3'))
    # result = api.get_result()
    
    # # 解析嵌套的 JSON 字符串
    # order_result = json.loads(result['content']['orderResult'])
    # print("Parsed orderResult:", order_result)
    # order_result = convert_to_srt(order_result)

    # # 保存结果到文件
    # with open(os.path.join(output_dir, 'subtitles.srt'), 'w', encoding='utf-8') as f:
    #     f.write(order_result)
    # print('字幕转录成功...')
    # 5. 生成视频图谱
    # generate_video_tree(output_dir)
    # print('视频图谱生成成功...')
    # # 6. 生成教案图谱

    # generate_document_tree(output_dir)
    # # with open(os.path.join(output_dir, 'tree2.json'), 'w', encoding='utf-8') as f:
    # #     json.dump({}, f, indent=4)
    # print('教案图谱生成成功...')
    # 7. 生成报告
    # generate_report(output_dir)
    # print('分析报告生成成功...')
    # 8. 生成新教案
    generate_outline(output_dir)
    print('新教案生成成功...')

    generate_logic_html(output_dir)
    print('逻辑图生成成功')

    generate_timeline_html(output_dir)
    print('时间图生成成功')
  
    print(f"视频处理完成: {video_name}")

if __name__ == '__main__':
    # parser = argparse.ArgumentParser()
    # parser.add_argument('--input', required=True)
    # parser.add_argument('--output', required=True) # 根据用户输入名称新建的一个文件夹data/name
    # parser.add_argument('--name', required=True)
    # args = parser.parse_args()
    
    # os.makedirs(args.output, exist_ok=True)
    # process_video(args.input, args.output, args.name)
    process_video(None, 'backend/data/user1/人工智能', 'video.mp4')
    # process_video(None, 'backend/data/user1/English_translation2', 'video.mp4')
