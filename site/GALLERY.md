# Галерея и новая главная — 19 октября 2026

Графическое обновление 21 октября: тема главной в assets/reference.css;
семейная сцена из assets/family.png, портрет из предоставленного референса
assets/reference-layout.png (кадрирование через CSS, исходник не изменён).
Добавлены контурные SVG-иконки, синие/зелёные карточки выбора и фотобаннер.

Просмотрены все 25 изображений верхнего уровня папки Safebox и подпапки competitors,
а также 15 слайдов SAFEBOX_Emergency_Interface.pdf. Обзорные листы и перечень исходников
сохранены в исходной папке Safebox/analysis-preview.

## Материалы лендинга

| Исходник | Файл сайта | Роль |
|---|---|---|
| Untitled 2 234.png | assets/gallery/open-kit.png | Первый экран, сравнение, галерея |
| Untitled 12.png / ранее скопированный рендер | assets/box.png | Классический корпус в галерее |
| Untitled 3.png | assets/gallery/compact.png | Компактный формат |
| Untitled4.png | assets/gallery/fridge.png | Концепт холодильного модуля |
| Современная аптечка для нужных моментов.png | assets/family.png | Иллюстрация к истории |
| competitors/images.jpg | assets/gallery/standard-case.jpg | Коллаж обычных форматов |
| competitors/images2.jpg | assets/gallery/standard-pouch.jpg | Коллаж обычных форматов |
| competitors/PI_Asset_2494371.webp | assets/gallery/standard-kit.webp | Коллаж обычных форматов |
| competitors/shopping 2.webp | assets/gallery/standard-bag.webp | Коллаж обычных форматов |
| SAFEBOX_Emergency_Interface.pdf, страница 8 | assets/gallery/presentation-08.jpg | Слайд об устройстве Premium-бокса |

Исходники скопированы без ретуши; PDF-страница отрендерена в JPEG. Коллаж и кадрирование
выполнены CSS. Дубли рендеров, подборки логотипов и скриншот магазина не дублируются на
лендинге. Изображения с неподтверждёнными графиками эффективности, обещаниями спасения
или универсальными схемами применения лекарств не использованы как аргументы.

## Редактирование

- Первые пять экранов: home-opening.html.
- Галерея: home-gallery.html; просмотр: assets/gallery.js.
- Форматы продукта, FAQ и диалог галереи: home-ending.html.
- Лёгкий фоновый рисунок: assets/care-lines.svg, прозрачность в assets/home.css.
- Остальные блоки главной и другие страницы: build.py.
- После изменений: python site/build.py из корня репозитория.

Проверены 12 страниц, ссылки и локальные изображения; на главной 15 секций.
Браузерная проверка: десктоп, мобильная ширина 375 px, меню, модальное окно,
следующее изображение, Escape, загрузка коллажа и слайда. Публичной публикации не было.
