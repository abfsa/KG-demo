import json
from pyvis.network import Network
from pathlib import Path
import os

def generate_logic_html(file_path):
    with open(os.path.join(file_path, 'report.json'), "r", encoding="utf‑8") as f:
        data = json.load(f)
    data = data["response2"]
    nodes = data["node"]+data["example"]; edges = data["edge"]

    net = Network(height="750px", width="100%", bgcolor="#ffffff", directed=True)

    for n in nodes:
        color = "#6baed6" if n["type"] == "knowledge" else "#fcbfdc"
        size  = 20 if n["type"] == "knowledge" else 15
        title = f"ID: {n['id']}<br>Level: {n.get('level','-')}"
        net.add_node(n["id"], label=n["name"], title=title,
                     color=color, shape="box", size=size)

    edge_style = {
        "层级关系": dict(color="#3182bd", width=2,  dashes=True,  arrows="to"),
        "序列关系": dict(color="#2ca25f", width=2,  dashes=False, arrows="to"),
        "并列关系": dict(color="#756bb1", width=1,  dashes=[2, 2], arrows=""),
        "因果关系": dict(color="#e34a33", width=3,  dashes=False, arrows="to"),
        "支持关系": dict(color="#636363", width=1.5, dashes=False, arrows="to"),
    }

    # 给未知/拼写错误的关系一个默认灰色样式，避免 KeyError
    default_style = dict(color="gray", width=1, dashes=False, arrows="to")


    for e in edges:
        style = edge_style.get(e["relation"], default_style)
        net.add_edge(
            e["from"],
            e["to"],
            label=e["relation"],           # 悬停/连线标签
            color=style["color"],
            width=style["width"],
            dashes=style["dashes"],
            arrows=style["arrows"],
            smooth=dict(type="dynamic")    # 自动曲线，减少重叠
        )

    legend_y = -len(nodes)*30 - 100
    for i, (rel, sty) in enumerate(edge_style.items()):
        dummy_id = f"legend_{i}"
        net.add_node(dummy_id, label=rel, shape="text", x=0, y=legend_y-40*i,
                     physics=False, font=dict(color=sty["color"]))

    # net.prep_notebook()        # 先加载模板
    net.save_graph(os.path.join(file_path, 'logic.html'))    # notebook=True(默认) 现在也可以
    #net.show(out_file.name)      # PyVis 会在当前目录写同名文件