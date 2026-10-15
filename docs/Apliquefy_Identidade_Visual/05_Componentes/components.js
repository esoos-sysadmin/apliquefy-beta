/* Offline demonstration only. No network requests, storage, tracking, or real submissions. */
(() => {
  const toast = document.getElementById('toast');
  function notify(text) { if (!toast) return; document.getElementById('toast-text').textContent=text; toast.hidden=false; }
  document.getElementById('toast-close')?.addEventListener('click',()=>{toast.hidden=true;});
  document.querySelectorAll('[data-demo]').forEach(b=>b.addEventListener('click',()=>notify(b.dataset.demo)));
  document.querySelectorAll('button[role="switch"]').forEach(b=>b.addEventListener('click',()=>{b.setAttribute('aria-checked',String(b.getAttribute('aria-checked')!=='true'));}));
  document.querySelectorAll('.chip').forEach(b=>b.addEventListener('click',()=>{b.setAttribute('aria-pressed',String(b.getAttribute('aria-pressed')!=='true'));}));
  document.querySelectorAll('[data-save]').forEach(b=>b.addEventListener('click',()=>{const saved=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(saved));notify(saved?'Vaga salva.':'Vaga removida dos salvos.');}));
  document.querySelectorAll('[role="tablist"]').forEach(list=>{
    const tabs=[...list.querySelectorAll('[role="tab"]')];
    function activate(tab,focus=false){tabs.forEach(t=>{const on=t===tab;t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!on;});if(focus)tab.focus();}
    tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>activate(tab));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(index+1)%tabs.length;if(e.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();activate(tabs[next],true);}});});
  });
  const pageButtons=[...document.querySelectorAll('[data-page]')];let page=1;
  function setPage(n){page=Math.max(1,Math.min(5,n));pageButtons.forEach(b=>{if(Number(b.dataset.page)===page)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});document.querySelector('[data-page-prev]').disabled=page===1;document.querySelector('[data-page-next]').disabled=page===5;document.getElementById('page-status').textContent=`Página ${page} de 5`;}
  pageButtons.forEach(b=>b.addEventListener('click',()=>setPage(Number(b.dataset.page))));
  document.querySelector('[data-page-prev]')?.addEventListener('click',()=>setPage(page-1));
  document.querySelector('[data-page-next]')?.addEventListener('click',()=>setPage(page+1));
  const form=document.getElementById('demo-form');
  form?.addEventListener('submit',e=>{e.preventDefault();const input=document.getElementById('demo-name'),control=document.getElementById('demo-name-control'),help=document.getElementById('demo-name-help');if(!input.value.trim()){input.setAttribute('aria-invalid','true');control.classList.add('error');help.className='error-text';help.textContent='Digite um nome fictício para continuar.';input.focus();return;}input.removeAttribute('aria-invalid');control.classList.remove('error');help.className='help';help.textContent='Use um nome fictício para testar.';notify('Formulário validado neste exemplo. Nenhum dado foi enviado.');});
  document.getElementById('pause-search')?.addEventListener('click',e=>{const b=e.currentTarget,paused=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(paused));b.querySelector('span').textContent=paused?'Retomar candidaturas':'Pausar candidaturas';document.getElementById('search-status').textContent=paused?'Candidaturas pausadas.':'Suas preferências';notify(paused?'Candidaturas pausadas.':'Candidaturas retomadas.');});
  document.getElementById('mobile-menu-toggle')?.addEventListener('click',e=>{const b=e.currentTarget,open=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',String(open));document.getElementById('mobile-menu-panel').hidden=!open;b.setAttribute('aria-label',open?'Fechar navegação':'Abrir navegação');});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(toast)toast.hidden=true;const menu=document.getElementById('mobile-menu-panel'),toggle=document.getElementById('mobile-menu-toggle');if(menu&&!menu.hidden){menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir navegação');toggle.focus();}}});
})();
