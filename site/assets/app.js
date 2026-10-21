'use strict';

// Данные остаются в браузере; сетевой отправки и медицинского подбора нет.
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav?.classList.contains('open')) {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.focus();
  }
});

function downloadText(filename, text) {
  const blob = new Blob(['\uFEFF' + text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

document.querySelectorAll('.box-diagram').forEach(diagram => {
  diagram.querySelectorAll('.slot').forEach(slot => {
    slot.addEventListener('click', () => {
      diagram.querySelectorAll('.slot').forEach(item => item.setAttribute('aria-pressed', 'false'));
      slot.setAttribute('aria-pressed', 'true');
      diagram.querySelector('.diagram-detail').textContent = slot.dataset.detail;
    });
  });
});
document.querySelectorAll('[data-print]').forEach(button => button.addEventListener('click', () => window.print()));

const kitForm = document.querySelector('#kit-form');
if (kitForm) {
  const tasks = [
    ['place', 'Выбрать место хранения, недоступное детям.'],
    ['inventory', 'Проверить имеющиеся упаковки, инструкции и сроки годности.'],
    ['doctor', 'Согласовать состав аптечки и личные назначения со специалистом.'],
    ['buy', 'Составить список того, что нужно приобрести после согласования.'],
    ['labels', 'Разложить содержимое и подписать разделы.'],
    ['family', 'Показать близким расположение аптечки и материалов.']
  ];
  const childTask = ['pediatrician', 'Отдельно согласовать детские средства и сведения о применении с педиатром.'];
  let saved = {};
  let storageAvailable = true;
  try { saved = JSON.parse(localStorage.getItem('safebox-preparation-v1') || '{}') || {}; }
  catch { storageAvailable = false; }
  if (typeof saved !== 'object' || Array.isArray(saved)) saved = {};
  const checked = new Set(Array.isArray(saved.checked) ? saved.checked.filter(x => typeof x === 'string') : []);
  const requested = new URLSearchParams(location.search).get('kit');
  const kit = ['adult', 'family'].includes(requested) ? requested : (saved.kit === 'family' ? 'family' : 'adult');
  kitForm.querySelector(`input[name="kit"][value="${kit}"]`).checked = true;
  const format = ['Методичка', 'DIY', 'Premium'].includes(saved.format) ? saved.format : 'Методичка';
  Array.from(kitForm.elements.format).find(input => input.value === format).checked = true;
  const currentTasks = () => kitForm.elements.kit.value === 'family' ? [...tasks, childTask] : tasks;
  const title = () => `${kitForm.elements.kit.value === 'family' ? 'Семейная' : 'Взрослая'} · ${kitForm.elements.format.value}`;
  function persist() {
    try {
      localStorage.setItem('safebox-preparation-v1', JSON.stringify({ kit: kitForm.elements.kit.value, format: kitForm.elements.format.value, checked: [...checked] }));
    } catch { storageAvailable = false; }
  }
  function progress() {
    const list = currentTasks();
    document.querySelector('#kit-progress').textContent = `Выполнено ${list.filter(([id]) => checked.has(id)).length} из ${list.length}.` + (storageAvailable ? '' : ' Сохранение в браузере недоступно — скачайте список.');
  }
  function render() {
    document.querySelector('#kit-title').textContent = title();
    const list = document.querySelector('#kit-list');
    list.replaceChildren();
    currentTasks().forEach(([id, text]) => {
      const li = document.createElement('li');
      const label = document.createElement('label');
      label.className = 'check';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = checked.has(id);
      input.addEventListener('change', () => {
        input.checked ? checked.add(id) : checked.delete(id);
        persist(); progress();
      });
      label.append(input, document.createTextNode(text));
      li.append(label); list.append(li);
    });
    persist(); progress();
  }
  kitForm.addEventListener('change', render);
  document.querySelector('#download-kit').addEventListener('click', () => {
    const lines = currentTasks().map(([id, text]) => `[${checked.has(id) ? 'x' : ' '}] ${text}`);
    downloadText('SAFEBOX-план-подготовки.txt', `SAFEBOX — ${title()}\n\n${lines.join('\n')}\n\nЭто организационный список, а не медицинское назначение. Продажи и аптечный заказ пока не подключены.`);
  });
  render();
}

let doctorText = '';
const doctorForm = document.querySelector('#doctor-form');
doctorForm?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(doctorForm);
  const questions = [
    'Какой состав домашней аптечки подходит в моей ситуации?',
    'Какие формы выпуска и количества нужны? Что не следует покупать?',
    'Какие инструкции и индивидуальные схемы необходимо сохранить вместе со средствами?',
    'Зачем каждое средство нужно именно нашей семье? Какие покупки будут лишними?' 
  ];
  if (data.get('who') === 'Для семьи с детьми') questions.push('Как подготовить отдельную детскую часть с учётом возраста и индивидуальных особенностей ребёнка?');
  if (data.has('regular')) questions.push('Как учесть уже назначенные препараты и возможные взаимодействия?');
  if (data.has('allergy')) questions.push('Какие ограничения и известные аллергии важно учесть при составлении списка?');
  if (data.has('travel')) questions.push('Что изменить в списке для поездки и как организовать перевозку?');
  if (data.has('storage')) questions.push('Какие условия хранения и сроки после вскрытия проверить для каждого средства?');
  const reasons = ['Понятный состав — чтобы не дублировать средства и не покупать наугад.'];
  if (data.get('who') === 'Для семьи с детьми') reasons.push('Отдельный детский список — чтобы врач проверил возрастные ограничения и подходящие формы.');
  if (data.has('regular')) reasons.push('Учёт текущих назначений — чтобы согласовать запас и проверить совместимость.');
  if (data.has('allergy')) reasons.push('Проверка ограничений — чтобы специалист исключил неподходящие средства.');
  if (data.has('travel')) reasons.push('Подготовка к поездке — чтобы заранее обсудить доступность и перевозку назначенных средств.');
  if (data.has('storage')) reasons.push('Проверка хранения — чтобы сверить условия и сроки с инструкциями.');
  doctorText = `SAFEBOX — вопросы врачу\n${data.get('who')}\n\n${questions.map((q, i) => `${i + 1}. ${q}`).join('\n\n')}\n\nЗАЧЕМ ЭТО ОБСУЖДАТЬ\n${reasons.join('\n\n')}\n\nПамятка собрана по выбранным темам, без ИИ и без медицинских назначений.`;
  document.querySelector('#doctor-result').textContent = doctorText;
  document.querySelector('#download-doctor').hidden = false;
});
document.querySelector('#download-doctor')?.addEventListener('click', () => downloadText('SAFEBOX-вопросы-врачу.txt', doctorText));

document.querySelectorAll('.draft-form').forEach(form => {
  const topic = new URLSearchParams(location.search).get('topic');
  const mapping = { launch: 'Покупка и запуск', review: 'Отзыв или тестирование', kids: 'Забота о детях' };
  if (form.dataset.kind === 'contact' && mapping[topic]) form.elements.type.value = mapping[topic];
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const labels = { name: 'Имя', company: 'Компания', region: 'Регион', type: 'Тема', email: 'Email', message: 'Сообщение' };
    const text = [...data.entries()].map(([key, value]) => `${labels[key] || key}: ${value}`).join('\n\n');
    downloadText('SAFEBOX-черновик-обращения.txt', `ЧЕРНОВИК — НЕ ОТПРАВЛЕН\n\n${text}\n\nСохранено пользователем локально. Канал приёма обращений пока не подключён.`);
    form.querySelector('.form-status').textContent = 'Черновик подготовлен для скачивания. Обращение не отправлено.';
  });
});

// Печать только бесплатного образца, а не всей страницы продукта.
document.querySelector('#print-guide')?.addEventListener('click', () => {
  document.body.classList.add('print-guide');
  window.print();
});
window.addEventListener('afterprint', () => document.body.classList.remove('print-guide'));
