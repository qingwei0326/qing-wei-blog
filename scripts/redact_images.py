"""把闲鱼订单/百亿补贴/集市截图里的隐私信息打码后输出到 docs/public/images/。"""
from PIL import Image, ImageDraw
from pathlib import Path

SRC_DIR = Path(r'D:\wechat\xwechat_files\wxid_r406l4jfoqgc22_e498\temp\RWTemp\2026-05\9e20f478899dc29eb19741386f9343c8')
DST_DIR = Path(r'C:\Users\青微\Desktop\青微的博客\docs\public\images')
DST_DIR.mkdir(parents=True, exist_ok=True)

# (源文件名, 输出文件名, 敏感矩形列表 [(x1,y1,x2,y2), ...])
JOBS = [
    (
        'ae4b9b5a31ae31444df6aec1bc59940c.jpg',
        'neo7-order-detail.jpg',
        [
            (540, 525, 1175, 580),   # 订单编号
            (415, 725, 1175, 780),   # 支付宝交易号
            (290, 820, 1175, 880),   # 收货地址 line 1 (真名+手机号+地址前半)
            (650, 875, 1180, 950),   # 收货地址 line 2 (地址后半，加宽防漏)
        ],
    ),
    (
        'e000e2ecb94e1c6fc5cdcfb64d0f3351.jpg',
        'neo7-xianyu-market.jpg',
        [],  # 闲鱼集市行情页，无敏感信息
    ),
    (
        '2d0fef05c5d54edbce973c02caed8fd6.jpg',
        'neo7-bbbt-refund.jpg',
        [],  # 百亿补贴翻车单，姓名已显示为昵称、手机号已 ****
    ),
]

for src_name, dst_name, regions in JOBS:
    src = SRC_DIR / src_name
    dst = DST_DIR / dst_name
    im = Image.open(src).convert('RGB')
    if regions:
        draw = ImageDraw.Draw(im)
        for r in regions:
            draw.rectangle(r, fill='black')
    im.save(dst, 'JPEG', quality=92)
    print(f'{src_name}  ->  {dst}  ({im.size}, {len(regions)} redactions)')
