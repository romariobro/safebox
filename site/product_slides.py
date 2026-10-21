"""Четыре исходных слайда пользователя в продуктовом блоке главной."""
def add_product_slides(html, en=False):
    labels = [('02', 'Почему важна подготовка', 'Why preparation matters'),
              ('04', 'От хаоса к понятной системе', 'From clutter to a clear system'),
              ('08', 'Устройство бокса', 'Inside the box'),
              ('11', 'Форматы хранения SAFEBOX', 'SAFEBOX storage formats')]
    assets = '../site/assets/gallery/' if en else 'assets/gallery/'
    cards = ''
    for number, ru, eng in labels:
        title = eng if en else ru
        caption = title + (' · Original presentation slide in Russian' if en else ' · Исходный слайд презентации')
        cards += f'<button type="button" class="gallery-card image-open" data-gallery-src="{assets}deck-{number}.jpg" data-caption="{caption}"><img src="{assets}deck-{number}.jpg" alt="{caption}" width="600" height="335" loading="lazy"><span class="gallery-caption"><b>{title}</b><span>{"View slide" if en else "Рассмотреть слайд"} ↗</span></span></button>'
    title = 'The product, explained visually.' if en else 'О продукте — в четырёх слайдах.'
    note = ('Original concept presentation in Russian. Diagrams are illustrative, not clinical evidence or a guarantee of response times or outcomes. Medicine labels and storage formats shown are not prescriptions or confirmed package contents.' if en else 'Исходные материалы концепции. Графики — иллюстрации идеи, а не клинические данные, гарантия времени приезда скорой или результата помощи. Названия лекарств и форматы хранения на слайдах не являются назначением или утверждённой комплектацией.')
    block = f'<section class="section product-slides" id="product-slides"><div class="wrap"><div class="section-head"><div><div class="eyebrow">SAFEBOX / {"Presentation" if en else "Презентация"}</div><h2>{title}</h2></div></div><div class="product-slide-grid">{cards}</div><p class="caption">{note}</p></div></section>'
    marker = '<div class="eyebrow">Product gallery' if en else 'id="gallery"'
    position = html.index(marker)
    start = html.rfind('<section', 0, position)
    assert start >= 0
    html = html[:start] + block + html[start:]
    if en:
        html += '<dialog class="gallery-dialog" aria-labelledby="gallery-title"><div class="gallery-toolbar"><h2 id="gallery-title">SAFEBOX presentation</h2><button type="button" class="gallery-close" aria-label="Close image">Close ×</button></div><img class="gallery-full" alt=""><div class="gallery-bottom"><button type="button" class="gallery-prev" aria-label="Previous image">←</button><p class="gallery-description" aria-live="polite"></p><button type="button" class="gallery-next" aria-label="Next image">→</button></div><p class="gallery-count" aria-live="polite"></p></dialog><script src="../site/assets/gallery.js" defer></script>'
    from opening_layout import opening
    return opening(en) + html
