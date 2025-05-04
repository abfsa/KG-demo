import json, pandas as pd
from datetime import timedelta
import plotly.express as px
from pathlib import Path
import os

def hmsms_to_timedelta(t):
    h, m, s_ms = t.split(':')
    s, ms = s_ms.split(',')
    return timedelta(hours=int(h), minutes=int(m), seconds=int(s), milliseconds=int(ms))

def parse_interval(interval):
    a, b = [p.strip() for p in interval.split('-->')]
    return hmsms_to_timedelta(a), hmsms_to_timedelta(b)

rows = []
def walk(node, depth=0, parent=""):
    st, ed = parse_interval(node["time"])
    rows.append({
        "name" : node["name"],
        "path" : parent + node["name"],
        "level": node.get("level"),
        "depth": depth,
        "start": st,
        "end"  : ed
    })
    for c in node.get("child", []):
        walk(c, depth+1, parent + "│   " * depth)

def generate_timeline_html(file_path):
    with open(os.path.join(file_path, 'tree1.json'), encoding="utf-8") as f:
        root = json.load(f)
    walk(root)

    df = pd.DataFrame(rows).sort_values("start")

    origin = pd.Timestamp("1970-01-01")
    df["start_dt"] = origin + df["start"]
    df["end_dt"]   = origin + df["end"]

    fig = px.timeline(
        df,
        x_start="start_dt",
        x_end="end_dt",
        y="path",
        color="level",           # 或 "depth"
        hover_data=["level", "depth"]
    )
    fig.update_yaxes(autorange="reversed")
    fig.update_xaxes(
        title="视频时间 (hh:mm:ss)",
        tickformat="%H:%M:%S"    # 把轴刻度仍然显示成相对时间
    )
    fig.update_layout(
        title="Knowledge Timeline",
        legend_title="难度 level",
        height=800               # 很多条目时可手动调高
    )

    fig.write_html(os.path.join(file_path, "timeline.html"))