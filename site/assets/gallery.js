'use strict';
// Просмотр исходных иллюстраций без загрузки сторонних библиотек.
const galleryTriggers = [...document.querySelectorAll('[data-gallery-src]')];
const galleryDialog = document.querySelector('.gallery-dialog');
if (galleryDialog && galleryTriggers.length) {
  let currentImage = 0;
  let opener = null;
  const showImage = index => {
    currentImage = (index + galleryTriggers.length) % galleryTriggers.length;
    const item = galleryTriggers[currentImage];
    const image = galleryDialog.querySelector('.gallery-full');
    image.src = item.dataset.gallerySrc;
    image.alt = item.querySelector('img').alt;
    galleryDialog.querySelector('.gallery-description').textContent = item.dataset.caption;
    galleryDialog.querySelector('.gallery-count').textContent = `${currentImage + 1} / ${galleryTriggers.length}`;
  };
  galleryTriggers.forEach((trigger, index) => trigger.addEventListener('click', () => {
    opener = trigger;
    showImage(index);
    galleryDialog.showModal();
  }));
  galleryDialog.querySelector('.gallery-close').addEventListener('click', () => galleryDialog.close());
  galleryDialog.querySelector('.gallery-prev').addEventListener('click', () => showImage(currentImage - 1));
  galleryDialog.querySelector('.gallery-next').addEventListener('click', () => showImage(currentImage + 1));
  galleryDialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showImage(currentImage + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  galleryDialog.addEventListener('click', event => {
    if (event.target !== galleryDialog) return;
    const r = galleryDialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) galleryDialog.close();
  });
  galleryDialog.addEventListener('close', () => opener?.focus());
}
