'use strict';
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav?.classList.contains('open')) {
    nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.focus();
  }
});
function download(name, text) {
  const url = URL.createObjectURL(new Blob(['\uFEFF' + text], {type:'text/plain;charset=utf-8'}));
  const link = document.createElement('a'); link.href = url; link.download = name;
  document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500);
}
const kit = document.querySelector('#en-kit');
if (kit) {
  let saved = {}, storage = true;
  try { saved = JSON.parse(localStorage.getItem('safebox-preparation-en-v1') || '{}') || {}; } catch { storage = false; }
  const checked = new Set(Array.isArray(saved.checked) ? saved.checked : []);
  const requested = new URLSearchParams(location.search).get('kit');
  kit.elements.kit.value = ['adult','family'].includes(requested) ? requested : saved.kit === 'family' ? 'family' : 'adult';
  kit.elements.format.value = ['Guide','DIY','Premium'].includes(saved.format) ? saved.format : 'Guide';
  const base = [['place','Choose a storage location inaccessible to children.'],['inventory','Check existing packs, instructions and expiry dates.'],['doctor','Agree on the contents and individual prescriptions with a professional.'],['buy','Make a purchase list after the contents have been agreed.'],['labels','Organise and label the sections.'],['family','Show other adults where the kit and information are kept.']];
  const tasks = () => kit.elements.kit.value === 'family' ? [...base,['children','Review the children’s supplies and instructions with a paediatrician.']] : base;
  const title = () => `${kit.elements.kit.value === 'family' ? 'Family' : 'Adult'} · ${kit.elements.format.value}`;
  function progress() {
    try { localStorage.setItem('safebox-preparation-en-v1', JSON.stringify({kit:kit.elements.kit.value,format:kit.elements.format.value,checked:[...checked]})); } catch { storage = false; }
    document.querySelector('#en-kit-progress').textContent = `${tasks().filter(([id])=>checked.has(id)).length} of ${tasks().length} completed.` + (storage ? '' : ' Browser storage unavailable. Download your checklist.');
  }
  function render() {
    document.querySelector('#en-kit-title').textContent = title();
    const list = document.querySelector('#en-kit-list'); list.replaceChildren();
    tasks().forEach(([id,text]) => {
      const label = document.createElement('label'); label.className='check';
      const input = document.createElement('input'); input.type='checkbox'; input.checked=checked.has(id);
      input.addEventListener('change',()=>{ input.checked ? checked.add(id) : checked.delete(id); progress(); });
      label.append(input, document.createTextNode(text)); list.append(label);
    }); progress();
  }
  kit.addEventListener('change',render);
  document.querySelector('#en-kit-download').addEventListener('click',()=>download('SAFEBOX-preparation.txt',`SAFEBOX — ${title()}\n\n${tasks().map(([id,t])=>`[${checked.has(id)?'x':' '}] ${t}`).join('\n')}\n\nAn organisational checklist, not a prescription. Sales and pharmacy ordering are not connected.`));
  render();
}
let doctorText='';
document.querySelector('#en-doctor')?.addEventListener('submit',event=>{
  event.preventDefault(); const data=new FormData(event.currentTarget);
  const items=['Which supplies suit our household, and why? — To avoid unnecessary or duplicate purchases.','Which forms and quantities should we keep? — To agree on a practical list.','Which current individual instructions should stay beside the supplies? — To keep the relevant information accessible.'];
  if(data.get('who')==='For a family with children') items.push('Which supplies suit the children’s ages? — To have a paediatrician check age restrictions and appropriate forms.');
  if(data.has('regular')) items.push('How should current prescriptions be reflected? — To review stock and possible interactions with the clinician.');
  if(data.has('allergy')) items.push('Which allergies and restrictions must be considered? — To rule out unsuitable products with the clinician.');
  if(data.has('travel')) items.push('What should change for travel? — To discuss availability and transport of prescribed supplies.');
  if(data.has('storage')) items.push('Which storage and after-opening limits apply? — To check each product against its instructions.');
  doctorText=`SAFEBOX — questions for your doctor\n${data.get('who')}\n\n${items.map((x,i)=>`${i+1}. ${x}`).join('\n\n')}\n\nPrepared from your selected topics. No AI, diagnosis or prescription.`;
  document.querySelector('#en-doctor-result').textContent=doctorText;
  document.querySelector('#en-doctor-download').hidden=false;
});
document.querySelector('#en-doctor-download')?.addEventListener('click',()=>download('SAFEBOX-doctor-questions.txt',doctorText));
document.querySelectorAll('.english-draft').forEach(form=>{
  const topic=new URLSearchParams(location.search).get('topic');
  const mapping={review:'Feedback or testing',kids:'Caring for children',launch:'Purchase and launch'};
  if(mapping[topic] && [...form.elements.subject.options].some(x=>x.value===mapping[topic])) form.elements.subject.value=mapping[topic];
  form.addEventListener('submit',event=>{
    event.preventDefault(); const labels={name:'Name',company:'Company',region:'Region',subject:'Subject',email:'Email',message:'Message'};
    download('SAFEBOX-enquiry-draft.txt','DRAFT — NOT SENT\n\n'+[...new FormData(form)].map(([k,v])=>`${labels[k]}: ${v}`).join('\n\n')+'\n\nSaved locally. Online submission is not connected.');
    form.querySelector('.form-status').textContent='Draft prepared for download. Your enquiry has not been sent.';
  });
});
document.querySelector('#print-guide')?.addEventListener('click',()=>{document.body.classList.add('print-guide');window.print();});
window.addEventListener('afterprint',()=>document.body.classList.remove('print-guide'));
