'use strict';
document.querySelectorAll('.offer-form').forEach(form=>{
  const en=form.dataset.language==='en';
  const requested=new URLSearchParams(location.search).get('offer');
  const inputs=[...form.querySelectorAll('input[name="offer"]')];
  inputs.forEach(input=>{if(input.value===requested)input.checked=true;});
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const selected=inputs.filter(x=>x.checked);
    const status=form.querySelector('.form-status');
    if(!selected.length){status.textContent=en?'Select at least one offer.':'Выберите хотя бы одно предложение.';return;}
    if(selected.some(x=>x.value==='training')&&!form.elements.city.value){status.textContent=en?'Choose a training city.':'Выберите город обучения.';form.elements.city.focus();return;}
    const lines=selected.map(x=>x.closest('label').querySelector('b').textContent);
    if(selected.some(x=>x.value==='training'))lines.push((en?'Training city: ':'Город обучения: ')+form.elements.city.value);
    if(selected.some(x=>x.value==='medicines'))lines.push((en?'Service: ':'Сервис: ')+form.elements.service.value);
    const text=(en?'SAFEBOX — SELECTION, NOT AN ORDER':'SAFEBOX — ПОДБОРКА, НЕ ЗАКАЗ')+'\n\n'+lines.join('\n')+'\n\n'+(en?'Total: quotation required. Medicines, delivery and service fees are separate. Not submitted; training is not booked.':'Итого: требует расчёта. Лекарства, доставка и сервис рассчитываются отдельно. Не отправлено; запись на обучение не подтверждена.');
    const url=URL.createObjectURL(new Blob(['\uFEFF'+text],{type:'text/plain;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download='SAFEBOX-selection.txt';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
    status.textContent=en?'Selection prepared for download. Nothing has been submitted.':'Подборка подготовлена для скачивания. Ничего не отправлено.';
  });
});
