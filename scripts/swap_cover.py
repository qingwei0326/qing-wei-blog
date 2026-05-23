"""把 .tmp-covers 里的候选图替换成 docs/public/images/博客封面.png。"""
from pathlib import Path
import shutil
from PIL import Image

target = Path(r'C:\Users\青微\Desktop\青微的博客\docs\public\images\博客封面.png')
backup = target.with_name('博客封面.bak.png')
src = Path(r'C:\Users\青微\Desktop\青微的博客\.tmp-covers\D-gray-blue.jpg')

if target.exists() and not backup.exists():
    shutil.copy(target, backup)
    print(f'backup -> {backup.name}')

im = Image.open(src).convert('RGB')
im.save(target, 'PNG', optimize=True)
print(f'swapped: {target.name}  size={im.size}')
