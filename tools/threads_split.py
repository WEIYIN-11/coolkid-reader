# -*- coding: utf-8 -*-
"""把 reader/chapters/<book>/chNN.md 切成 Threads 連載稿。

規則（與 threads/00_開坑文與發文指南.md 同步）：
- 每則貼文 <= POST_BUDGET 字（Threads 上限 500，留安全邊際）
- 只在段落邊界切；單段超長才在句尾切
- 場景（---）結束即收一則；過短場景往後併
- 一章拆成多個「串」（installment），每串為一天的連載單位
- 章末突破橋段獨立成一則；takeaway-box 變成章末「三件事」收尾貼
- notes-box（雜役筆記）不上 Threads
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent  # reader/
CHAPTERS_DIR = ROOT / "chapters"
OUT_DIR = ROOT / "threads"

POST_BUDGET = 480          # 單則總字數上限（含標頭/頁碼，硬上限 500）
INSTALLMENT_TARGET = 3200  # 單串故事字數理想上限
INSTALLMENT_MIN = 1600     # 低於此值不主動開新串
TAIL_MERGE = 900           # 末串故事低於此值往前併
TINY_SCENE = 120           # 過短場景（非突破段）往後併
SCENE_SEP = "———"

TAG = "#尹知行修行錄"
BREAKTHROUGH_ANCHOR = "自此尹知行修為"

BOOKS = {
    "rag": "我在藏經閣當首席檢索官",
    "crm": "我在商會當首席記事使",
    "agent": "我在雲書司當首席探子使",
    "mcp": "我在驛盟司當首席盟約使",
}


def strip_inline_md(text: str) -> str:
    text = re.sub(r"\*\*(.+?)\*\*", r"\1", text)
    text = re.sub(r"(?<!\*)\*([^*\n]+?)\*(?!\*)", r"\1", text)
    text = re.sub(r"`([^`\n]*)`", r"\1", text)
    # 拆掉 bold 後殘留在中文標點與中文之間的半形空格
    text = re.sub(r"(?<=[。！？」』])[ \t]+(?=[一-鿿「『《（])", "", text)
    # 夾在中文之間的「單一」半形空格也是 bold 殘留（多空格是排版對齊，保留）
    text = re.sub(r"(?<=[一-鿿」』》）！？。，、：；])[ ](?=[一-鿿「『《（])", "", text)
    return text


def clean_paragraph(block: str) -> str:
    """一個 markdown 段落區塊 -> 純文字段落。引用塊去掉 > 前綴、丟掉 code fence 行。"""
    lines = []
    for ln in block.splitlines():
        if re.match(r"^\s*`{1,}\s*$", ln):
            continue
        ln = re.sub(r"^\s*>\s?", "", ln)
        lines.append(ln.rstrip())
    out = "\n".join(lines).strip()
    return strip_inline_md(out)


def split_long_paragraph(par: str, limit: int) -> list[str]:
    """單段超過 limit 時在句尾（。！？」』…）切；無句尾標點時退而在頓逗號切。"""
    if len(par) <= limit:
        return [par]
    pieces, buf = [], ""
    # 切句：句尾標點＋可跟收尾引號
    sentences = re.findall(r"[^。！？!?]*[。！？!?]+[」』）]*|[^。！？!?]+$", par)
    for s in sentences:
        if buf and len(buf) + len(s) > limit:
            pieces.append(buf)
            buf = s
        else:
            buf += s
    if buf:
        pieces.append(buf)
    # 保底：仍超長的片段在 ，、； 處硬切
    final: list[str] = []
    for p in pieces:
        while len(p) > limit:
            cut = max(p.rfind(c, 0, limit) for c in "，、；")
            if cut <= 0:
                cut = limit - 1
            final.append(p[: cut + 1])
            p = p[cut + 1:]
        final.append(p)
    return final


def parse_chapter(path: Path):
    raw = path.read_text(encoding="utf-8")

    m = re.search(r"^#\s+(.+)$", raw, re.M)
    title = m.group(1).strip() if m else path.stem

    m = re.search(r"^>\s*\*(.+?)\*\s*$", raw, re.M)
    realm = m.group(1).strip() if m else ""

    # takeaway-box
    takeaway = ""
    m = re.search(r'<div class="takeaway-box">(.*?)</div>', raw, re.S)
    if m:
        takeaway = m.group(1)

    # 故事正文 = H1 之後，到 notes-box / takeaway-box 之前
    body = raw
    body = re.sub(r"^#\s+.+$", "", body, count=1, flags=re.M)
    body = body.split('<div class="notes-box">')[0]
    body = body.split('<div class="takeaway-box">')[0]
    # 去掉境界副標那一行（單獨的 > *...* 引用）
    body = re.sub(r"^>\s*\*.+?\*\s*$", "", body, flags=re.M)

    # 場景切分
    scenes_raw = re.split(r"^\s*---\s*$", body, flags=re.M)
    scenes = []
    for sc in scenes_raw:
        paras = []
        for block in re.split(r"\n\s*\n", sc):
            p = clean_paragraph(block)
            if p:
                paras.append(p)
        if paras:
            scenes.append(paras)

    return title, realm, scenes, takeaway


def scene_len(paras: list[str]) -> int:
    return sum(len(p) for p in paras) + 2 * max(0, len(paras) - 1)


def merge_tiny_scenes(scenes: list[list[str]]) -> list[list[str]]:
    """過短場景（非突破段）與下一場景合併，中間加分隔線。"""
    out: list[list[str]] = []
    i = 0
    while i < len(scenes):
        sc = scenes[i]
        is_break = any(BREAKTHROUGH_ANCHOR in p for p in sc)
        if (not is_break and scene_len(sc) < TINY_SCENE and i + 1 < len(scenes)):
            nxt = scenes[i + 1]
            merged = sc + [SCENE_SEP] + nxt
            scenes[i + 1] = merged
        else:
            out.append(sc)
        i += 1
    return out


def group_installments(scenes: list[list[str]]) -> list[list[list[str]]]:
    """把場景分組成串。突破段永遠跟在最後一串。"""
    installments: list[list[list[str]]] = []
    cur: list[list[str]] = []
    cur_len = 0
    for sc in scenes:
        is_break = any(BREAKTHROUGH_ANCHOR in p for p in sc)
        sl = scene_len(sc)
        if (not is_break and cur and cur_len >= INSTALLMENT_MIN
                and cur_len + sl > INSTALLMENT_TARGET):
            installments.append(cur)
            cur, cur_len = [], 0
        cur.append(sc)
        cur_len += sl
    if cur:
        installments.append(cur)

    # 末串太短往前併
    if len(installments) >= 2:
        last_len = sum(scene_len(sc) for sc in installments[-1])
        if last_len < TAIL_MERGE:
            installments[-2].extend(installments.pop())
    return installments


def installment_label(idx: int, total: int) -> str:
    if total == 1:
        return ""
    if total == 2:
        return ["（上）", "（下）"][idx]
    if total == 3:
        return ["（上）", "（中）", "（下）"][idx]
    nums = "一二三四五六七八九十"
    return f"（{nums[idx]}）"


def build_posts(scenes: list[list[str]], content_budget: int) -> list[str]:
    """場景列表 -> 貼文內容列表（不含標頭/頁碼）。場景結束即收一則。"""
    posts: list[str] = []
    for sc in scenes:
        buf = ""
        for par in sc:
            for piece in split_long_paragraph(par, content_budget):
                if buf and len(buf) + 2 + len(piece) > content_budget:
                    posts.append(buf)
                    buf = piece
                else:
                    buf = piece if not buf else buf + "\n\n" + piece
        if buf:
            posts.append(buf)
    return posts


def format_takeaway(takeaway: str, chap_no: str, next_line: str) -> list[str]:
    """takeaway-box -> 章末收尾貼（依段落貪婪分則，永不超限）。"""
    body = re.sub(r"^##\s+.*$", "", takeaway, flags=re.M)
    blocks: list[str] = []
    for block in re.split(r"\n\s*\n", body):
        p = clean_paragraph(block)
        if p and not re.match(r"^-{3,}$", p):
            blocks.append(p)
    if next_line:
        blocks.append(next_line)

    budget = POST_BUDGET - 8  # 頁碼行預留
    header = f"〔第 {chap_no} 章　完〕\n這一章你只要記得這三件事"
    posts: list[str] = []
    buf = header
    for p in blocks:
        for piece in split_long_paragraph(p, budget):
            if len(buf) + 2 + len(piece) > budget:
                posts.append(buf)
                buf = piece
            else:
                buf += "\n\n" + piece
    posts.append(buf)
    return posts


def chapter_no_from_title(title: str) -> str:
    m = re.search(r"第\s*(\d+)\s*章", title)
    return m.group(1) if m else "?"


def clean_title_for_header(title: str) -> str:
    t = re.sub(r"（[^）]*）", "", title).strip()
    m = re.match(r"第\s*(\d+)\s*章\s*(.*)$", t)
    if m:
        return f"第 {m.group(1)} 章　{m.group(2).strip()}"
    return re.sub(r"\s+", " ", t)


def process_chapter(book_id: str, book_title: str, path: Path,
                    next_chapter_title: str | None,
                    next_book_title: str | None) -> tuple[str, dict]:
    title, realm, scenes, takeaway = parse_chapter(path)
    chap_no = chapter_no_from_title(title)
    header_title = clean_title_for_header(title)

    scenes = merge_tiny_scenes(scenes)
    installments = group_installments(scenes)
    n_inst = len(installments)

    # 章末「下回」行
    if next_chapter_title:
        nt = clean_title_for_header(next_chapter_title)
        nt = re.sub(r"^第\s*\d+\s*章\s*", "", nt.replace("　", " ")).strip()
        next_line = f"下回　第 {int(chap_no) + 1} 章〈{nt}〉"
    elif next_book_title:
        next_line = f"（本卷終）\n下一世　《{next_book_title}》"
    else:
        next_line = "（本卷終）"

    out_lines: list[str] = []
    total_posts = 0
    max_len = 0
    inst_meta = []

    for ii, inst_scenes in enumerate(installments):
        label = installment_label(ii, n_inst)
        header = f"{book_title}｜{header_title}{label}"
        # 首貼預留：標頭 + 空行 + 尾端 tag 行
        first_overhead = len(header) + 2 + len(TAG) + 2
        body_budget = POST_BUDGET - 8  # 頁碼行預留
        first_budget = POST_BUDGET - first_overhead

        raw_posts = build_posts(inst_scenes, body_budget)
        # 首貼若塞不下標頭，往後推一段
        while raw_posts and len(raw_posts[0]) > first_budget:
            # 把首貼第一段切出去單獨處理：直接縮小首貼 -> 重切該串
            paras0 = raw_posts[0].split("\n\n")
            if len(paras0) == 1:
                break
            moved = paras0.pop()
            raw_posts[0] = "\n\n".join(paras0)
            if len(raw_posts) > 1 and len(moved) + 2 + len(raw_posts[1]) <= body_budget:
                raw_posts[1] = moved + "\n\n" + raw_posts[1]
            else:
                raw_posts.insert(1, moved)

        # 章末（最後一串）：附 takeaway 貼
        extra_posts: list[str] = []
        if ii == n_inst - 1 and takeaway.strip():
            extra_posts = format_takeaway(takeaway, chap_no, next_line)
        elif ii == n_inst - 1:
            raw_posts[-1] += f"\n\n{next_line}"
        else:
            nxt_label = installment_label(ii + 1, n_inst)
            raw_posts[-1] += f"\n\n（待續：{header_title}{nxt_label}）"

        all_posts = raw_posts + extra_posts
        n = len(all_posts)

        formatted: list[str] = []
        for pi, content in enumerate(all_posts):
            if pi == 0:
                head = header
                if ii == 0 and realm:
                    head += f"\n{realm}"
                post = f"{head}\n\n{content}\n\n{TAG}"
            else:
                post = f"{content}\n\n{pi + 1}/{n}"
            formatted.append(post)
            max_len = max(max_len, len(post))

        total_posts += n
        inst_meta.append((label or "（全）", n))

        out_lines.append("=" * 50)
        out_lines.append(f"■ 第 {ii + 1} 串｜{header_title}{label or ''}｜{n} 則")
        out_lines.append("=" * 50)
        for pi, post in enumerate(formatted):
            kind = "首貼" if pi == 0 else "回覆串接"
            out_lines.append(f"\n▼ {pi + 1}/{n}（{kind}，{len(post)} 字）")
            out_lines.append("-" * 40)
            out_lines.append(post)
            out_lines.append("-" * 40)
        out_lines.append("")

    doc = (
        f"# {title} — Threads 連載稿\n\n"
        f"來源：chapters/{book_id}/{path.name}｜"
        f"{n_inst} 串、共 {total_posts} 則、最長一則 {max_len} 字\n\n"
        + "\n".join(out_lines)
    )
    meta = {
        "chapter": title,
        "installments": n_inst,
        "posts": total_posts,
        "max_len": max_len,
        "inst": inst_meta,
    }
    return doc, meta


def main():
    only_books = sys.argv[1:] or ["rag", "crm", "agent"]
    manifest = json.loads((CHAPTERS_DIR / "manifest.json").read_text(encoding="utf-8"))
    books = {b["id"]: b for b in manifest["books"]}

    book_order = [b for b in ["rag", "crm", "agent", "mcp"] if b in books]
    summary = []

    for bid in only_books:
        if bid not in books:
            print(f"!! manifest 沒有 {bid}，跳過")
            continue
        book = books[bid]
        chapters = [c for c in book["chapters"] if c["id"] != "appendix"]
        out_dir = OUT_DIR / bid
        out_dir.mkdir(parents=True, exist_ok=True)

        # 下一本書（給末章「下一世」行）
        nb_title = None
        idx = book_order.index(bid)
        if idx + 1 < len(book_order):
            nb_title = books[book_order[idx + 1]]["title"]

        for ci, ch in enumerate(chapters):
            path = CHAPTERS_DIR / bid / ch["file"]
            next_title = chapters[ci + 1]["title"] if ci + 1 < len(chapters) else None
            doc, meta = process_chapter(
                bid, book["title"], path,
                next_title, nb_title if ci == len(chapters) - 1 else None,
            )
            out = out_dir / f"{ch['id']}.md"
            out.write_text(doc, encoding="utf-8", newline="\n")
            summary.append((bid, ch["id"], meta))
            print(f"{bid}/{ch['id']}: {meta['installments']} 串 "
                  f"{meta['posts']} 則 max={meta['max_len']}")

    over = [s for s in summary if s[2]["max_len"] > 500]
    print(f"\n總計 {len(summary)} 章、"
          f"{sum(s[2]['posts'] for s in summary)} 則貼文")
    if over:
        print("!! 超過 500 字的章：", [(b, c) for b, c, _ in over])
    else:
        print("全部貼文 <= 500 字 OK")


if __name__ == "__main__":
    main()
