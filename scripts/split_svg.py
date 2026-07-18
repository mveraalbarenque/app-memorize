#!/usr/bin/env python3
"""
Split a multi-character SVG into individual SVG files.

Usage:
  python scripts/split_svg.py <input.svg> [output_dir]

Each top-level <g> in the SVG becomes its own file.
"""

import sys
import os
import re

def split_svg(input_path, output_dir=None):
    if not os.path.isfile(input_path):
        print(f"Error: '{input_path}' not found")
        sys.exit(1)

    with open(input_path) as f:
        svg = f.read()

    # Extract <svg> attributes (width, height, viewBox, xmlns)
    m = re.search(r'<svg\s+([^>]*)>', svg)
    if not m:
        print("Error: no <svg> tag found")
        sys.exit(1)
    svg_attrs = m.group(0)  # e.g. <svg width="2100" ...>

    # Extract <defs> block (if any)
    defs_m = re.search(r'<defs>.*?</defs>', svg, re.DOTALL)
    defs_block = defs_m.group(0) if defs_m else ''

    # Find top-level <g> elements by tracking nesting depth
    start_pos = defs_m.end() if defs_m else m.end()
    depth = 0
    groups = []
    current = None

    i = start_pos
    while i < len(svg):
        if svg[i] == '<':
            # Closing tag </...>
            if i + 1 < len(svg) and svg[i + 1] == '/':
                tag_end = svg.find('>', i)
                if tag_end == -1:
                    break
                tag_name = svg[i + 2:tag_end].split()[0].rstrip('>')
                if depth == 1 and tag_name == 'g' and current is not None:
                    groups.append(svg[current:tag_end + 1])
                    current = None
                if tag_name != '!--':  # don't count comments
                    depth -= 1
                i = tag_end + 1
            # Opening tag <...>
            elif svg[i + 1] not in '/?!':
                tag_end = svg.find('>', i)
                if tag_end == -1:
                    break
                # Self-closing <.../>
                if svg[tag_end - 1] == '/':
                    i = tag_end + 1
                    continue
                tag_content = svg[i + 1:tag_end]
                tag_name = tag_content.split()[0].split('\n')[0].strip()
                if tag_name == 'g' and depth == 0:
                    current = i
                depth += 1
                i = tag_end + 1
            else:
                # Comment or processing instruction
                end = svg.find('>', i)
                if end == -1:
                    break
                i = end + 1
        else:
            i += 1

    if not groups:
        print("Error: no top-level <g> elements found")
        sys.exit(1)

    # Determine output directory
    if output_dir is None:
        base = os.path.splitext(os.path.basename(input_path))[0]
        output_dir = os.path.join(os.path.dirname(input_path) or '.', base)
    os.makedirs(output_dir, exist_ok=True)

    print(f"Found {len(groups)} character groups\n")

    for idx, content in enumerate(groups, 1):
        name = f"character_{idx:02d}"
        out = (
            f'<svg {svg_attrs[5:-1]}>\n'  # strip <svg and >
            f'{defs_block}\n'
            f'{content}\n'
            f'</svg>'
        )
        path = os.path.join(output_dir, f"{name}.svg")
        with open(path, 'w') as f:
            f.write(out)
        kb = len(out) / 1024
        print(f"  [{idx}] {name}.svg  ({kb:.1f} KB)")

    print(f"\nDone → {output_dir}/")


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    split_svg(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None)
