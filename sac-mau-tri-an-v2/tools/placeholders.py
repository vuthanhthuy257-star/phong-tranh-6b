import json
from pathlib import Path
root=Path(__file__).resolve().parents[1]/'dist'
colors=[('#ede6d8','#716344'),('#e1e6dc','#506453'),('#eeded7','#965c50'),('#e0e5e6','#4f6870')]
def svg(title,num,side=''):
 bg,ink=colors[(int(num)-1)%4]
 return f'''<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1100" viewBox="0 0 900 1100"><rect width="900" height="1100" fill="{bg}"/><rect x="34" y="34" width="832" height="1032" fill="none" stroke="{ink}" stroke-opacity=".3"/><path d="M360 255h180m-90-90v180" fill="none" stroke="{ink}" stroke-width="1"/><circle cx="450" cy="255" r="82" fill="none" stroke="{ink}" stroke-opacity=".35"/><g text-anchor="middle" fill="{ink}" font-family="Georgia,serif"><text x="450" y="540" font-size="45">{title}</text><text x="450" y="700" font-size="140">{num}</text></g><g text-anchor="middle" fill="{ink}" font-family="Arial,sans-serif"><text x="450" y="790" font-size="25">{side or 'VỊ TRÍ TRƯNG BÀY'}</text><text x="450" y="978" font-size="23">ẢNH GIỮ CHỖ · CHƯA CÓ TÁC PHẨM THẬT</text></g></svg>'''
paintings=[]; cards=[]
slots=[('tay',i) for i in range(1,7)]+[('dong',i) for i in range(1,7)]+[('bac',i) for i in range(1,5)]+[('nam',i) for i in range(1,5)]
for i,(wall,slot) in enumerate(slots,1):
 n=f'{i:02}'; name=f'assets/paintings/tranh-{n}.svg'; (root/name).write_text(svg('Tranh',n),encoding='utf-8')
 paintings.append(dict(id=f'tranh-{n}',title=f'Tranh {n}',author='Chưa cập nhật tác giả',image=name,thumbnail=name,placeholder=True,position=dict(wall=wall,slot=slot)))
slots=[('tay',i) for i in range(1,5)]+[('dong',i) for i in range(1,5)]+[('bac',i) for i in range(1,3)]
for i,(wall,slot) in enumerate(slots,1):
 n=f'{i:02}'; front=f'assets/cards/thiep-{n}-ngoai.svg'; inside=f'assets/cards/thiep-{n}-trong.svg'
 (root/front).write_text(svg('Thiệp',n,'MẶT NGOÀI'),encoding='utf-8'); (root/inside).write_text(svg('Thiệp',n,'MẶT TRONG · CHỜ BỔ SUNG LỜI CHÚC'),encoding='utf-8')
 cards.append(dict(id=f'thiep-{n}',title=f'Thiệp {n}',author='Chưa cập nhật tác giả',frontImage=front,insideImage=inside,thumbnail=front,placeholder=True,position=dict(wall=wall,slot=slot)))
(root/'data/artworks.json').write_text(json.dumps(dict(paintings=paintings,cards=cards),ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
