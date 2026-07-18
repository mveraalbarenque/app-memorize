#!/usr/bin/env python3
"""
Crop each SVG to its actual content bounds by computing bounding boxes
from path data and updating viewBox accordingly.

Usage:
  python scripts/crop_svg.py <path/to/svg/files/*.svg>
"""

import sys
import re
import os
import math

def iter_path_points(d):
    tokens = re.findall(r'[MmZzLlHhVvCcSsQqTtAa]|[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?', d)
    i = 0
    cx = cy = 0.0
    cmd = None

    def read(n):
        nonlocal i
        pts = []
        while len(pts) < n and i < len(tokens):
            try:
                pts.append(float(tokens[i]))
                i += 1
            except ValueError:
                break
        return pts

    while i < len(tokens):
        t = tokens[i]
        if t in 'MmZzLlHhVvCcSsQqTtAa':
            cmd, absolute = t, t.isupper()
            i += 1
        elif re.match(r'^[-0-9.]', t):
            pass
        else:
            i += 1
            continue

        if cmd is None:
            break

        if cmd in 'Zz':
            yield cx, cy
            continue

        if cmd in 'Mm':
            pts = read(2)
            if len(pts) < 2:
                break
            cx = pts[0] if absolute else cx + pts[0]
            cy = pts[1] if absolute else cy + pts[1]
            yield cx, cy
            cmd = 'L' if absolute else 'l'
            while i < len(tokens):
                pts = read(2)
                if len(pts) < 2:
                    break
                cx = pts[0] if absolute else cx + pts[0]
                cy = pts[1] if absolute else cy + pts[1]
                yield cx, cy

        elif cmd in 'Ll':
            pts = read(2)
            if len(pts) >= 2:
                cx = pts[0] if absolute else cx + pts[0]
                cy = pts[1] if absolute else cy + pts[1]
                yield cx, cy

        elif cmd in 'Hh':
            v = read(1)
            if v:
                cx = v[0] if absolute else cx + v[0]
                yield cx, cy

        elif cmd in 'Vv':
            v = read(1)
            if v:
                cy = v[0] if absolute else cy + v[0]
                yield cx, cy

        elif cmd in 'Cc':
            pts = read(6)
            if len(pts) >= 6:
                cx = pts[4] if absolute else cx + pts[4]
                cy = pts[5] if absolute else cy + pts[5]
                yield cx, cy

        elif cmd in 'Ss':
            pts = read(4)
            if len(pts) >= 4:
                cx = pts[2] if absolute else cx + pts[2]
                cy = pts[3] if absolute else cy + pts[3]
                yield cx, cy

        elif cmd in 'Qq':
            pts = read(4)
            if len(pts) >= 4:
                cx = pts[2] if absolute else cx + pts[2]
                cy = pts[3] if absolute else cy + pts[3]
                yield cx, cy

        elif cmd in 'Tt':
            pts = read(2)
            if len(pts) >= 2:
                cx = pts[0] if absolute else cx + pts[0]
                cy = pts[1] if absolute else cy + pts[1]
                yield cx, cy

        elif cmd in 'Aa':
            pts = read(7)
            if len(pts) >= 7:
                cx = pts[5] if absolute else cx + pts[5]
                cy = pts[6] if absolute else cy + pts[6]
                yield cx, cy

        else:
            i += 1


PADDING = 20

def crop_svg(path):
    with open(path) as f:
        content = f.read()

    viewbox_match = re.search(r'viewBox="([^"]*)"', content)
    if not viewbox_match:
        print(f"  SKIP (no viewBox): {path}")
        return
    orig_vb = viewbox_match.group(0)

    ds = re.findall(r'd="([^"]*)"', content)
    if not ds:
        print(f"  SKIP (no paths): {path}")
        return

    min_x, min_y, max_x, max_y = math.inf, math.inf, -math.inf, -math.inf
    for d in ds:
        for x, y in iter_path_points(d):
            if x < min_x: min_x = x
            if y < min_y: min_y = y
            if x > max_x: max_x = x
            if y > max_y: max_y = y

    if min_x == math.inf:
        print(f"  SKIP (no coords): {path}")
        return

    min_x = math.floor(min_x) - PADDING
    min_y = math.floor(min_y) - PADDING
    max_x = math.ceil(max_x) + PADDING
    max_y = math.ceil(max_y) + PADDING
    w = max_x - min_x
    h = max_y - min_y
    new_vb = f'viewBox="{min_x} {min_y} {w} {h}"'

    content = re.sub(r'width="[^"]*"', f'width="{w}"', content)
    content = re.sub(r'height="[^"]*"', f'height="{h}"', content)
    content = content.replace(orig_vb, new_vb)

    with open(path, 'w') as f:
        f.write(content)

    print(f"  {os.path.basename(path)}: {orig_vb} → {new_vb}  ({w}×{h})")


if __name__ == '__main__':
    files = sys.argv[1:]
    if not files:
        print("Usage: crop_svg.py <file1.svg> [file2.svg ...]")
        sys.exit(1)
    for f in files:
        crop_svg(f)
    print(f"\nDone — {len(files)} files processed.")
