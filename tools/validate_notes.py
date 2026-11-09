"""Validate STACK NOTE content using only the Python standard library.

Usage from repository root: python tools/validate_notes.py
"""
from __future__ import annotations

import datetime
import json
import re
import sys
from pathlib import Path

FILE = Path(__file__).resolve().parents[1] / 'data' / 'notes.json'
CATEGORIES = {'人工智慧': 'ai', '資料結構': 'ds', '作業系統': 'os', '量子計算': 'quantum'}
REQUIRED = {'id', 'title', 'category', 'categoryKey', 'summary', 'tags', 'readMinutes', 'updated', 'sections'}


def validate() -> list[str]:
    issues = []
    try:
        data = json.loads(FILE.read_text(encoding='utf-8'))
    except (OSError, json.JSONDecodeError) as error:
        return [f'Cannot read notes.json: {error}']
    if not isinstance(data, list):
        return ['The top-level JSON value must be a list.']
    ids = set()
    for index, note in enumerate(data, 1):
        where = f'note {index}'
        if not isinstance(note, dict):
            issues.append(f'{where}: must be an object')
            continue
        missing = REQUIRED - note.keys()
        if missing:
            issues.append(f'{where}: missing fields {sorted(missing)}')
            continue
        uid = note['id']
        if not isinstance(uid, str) or not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', uid):
            issues.append(f'{where}: id must be lowercase kebab-case')
        elif uid in ids:
            issues.append(f'{where}: duplicate id {uid}')
        else:
            ids.add(uid)
        for key in ('title', 'summary'):
            if not isinstance(note[key], str) or not note[key].strip():
                issues.append(f'{where}: {key} must be nonempty text')
        if isinstance(note['title'], str) and len(note['title']) > 50:
            issues.append(f'{where}: title is longer than 50 characters')
        if CATEGORIES.get(note['category']) != note['categoryKey']:
            issues.append(f'{where}: category and categoryKey do not match')
        if not isinstance(note['readMinutes'], int) or isinstance(note['readMinutes'], bool) or note['readMinutes'] <= 0:
            issues.append(f'{where}: readMinutes must be a positive integer')
        tags = note['tags']
        if not isinstance(tags, list) or not 1 <= len(tags) <= 5 or not all(isinstance(t, str) and t.strip() for t in tags):
            issues.append(f'{where}: tags must contain 1–5 nonempty strings')
        date = note['updated']
        try:
            if not isinstance(date, str) or datetime.date.fromisoformat(date).isoformat() != date:
                raise ValueError('invalid format')
        except ValueError:
            issues.append(f'{where}: updated must be YYYY-MM-DD')
        sections = note['sections']
        if not isinstance(sections, list) or len(sections) < 3:
            issues.append(f'{where}: sections must contain at least 3 items')
            continue
        for n, section in enumerate(sections, 1):
            location = f'{where} section {n}'
            if not isinstance(section, dict):
                issues.append(f'{location}: must be an object')
                continue
            heading = section.get('heading')
            paragraphs = section.get('paragraphs')
            bullets = section.get('bullets')
            if not isinstance(heading, str) or not heading.strip():
                issues.append(f'{location}: heading required')
            if not isinstance(paragraphs, list) or not paragraphs or not all(isinstance(p, str) and p.strip() for p in paragraphs):
                issues.append(f'{location}: paragraphs must be nonempty string list')
            if not isinstance(bullets, list) or not all(isinstance(p, str) and p.strip() for p in bullets):
                issues.append(f'{location}: bullets must be a string list (possibly empty)')
    return issues


if __name__ == '__main__':
    errors = validate()
    if errors:
        for error in errors:
            print('ERROR:', error)
        sys.exit(1)
    print('PASS: all notes are valid; IDs and categories are consistent.')
