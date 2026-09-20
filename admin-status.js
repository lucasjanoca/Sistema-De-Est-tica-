/* InfoTech.io: estados de confirmação e acesso; não altera permissões do banco. */
(() => {
 'use strict';
 let snapshot=null,loading=false;
 const css=document.createElement('style');
 css.textContent='.it-confirmation{margin-left:5px}.it-confirmation.wait{background:#473719;border-color:#8a6629;color:#ffe6a8}.it-confirmation.off{background:#402633;border-color:#884458;color:#ffd7df}.it-confirmation.ok{background:#173c37;border-color:#276953;color:#94e7bb}.it-member-state{display:flex;gap:5px;flex-wrap:wrap;align-items:center}';
 document.head.append(css);
 function status(label,state){const badge=document.createElement('span');badge.className=`badge it-confirmation ${state}`;badge.textContent=label;return badge;}
 function paint(){
   if(!snapshot)return;
   const companies=snapshot.companies||[],members=snapshot.members||[];
   const rows=[...document.querySelectorAll('#companyRows tr')];
   companies.forEach((company,index)=>{
     const row=rows[index];if(!row)return;
     const badge=row.querySelector('.badge');if(!badge)return;
     const owner=members.find(m=>m.workspace_id===company.id&&m.role==='owner'&&m.email===company.owner_email);
     if(company.status==='active'){
       const pending=!owner||!owner.confirmed;
       const label=pending?'Pendente de confirmação':'Ativa';
       if(badge.textContent!==label)badge.textContent=label;
       badge.classList.toggle('pause',pending);
       badge.classList.toggle('it-confirmation',pending);
       badge.classList.toggle('wait',pending);
     }
   });
   const count=document.getElementById('countActive');
   if(count)count.textContent=String(companies.filter(c=>c.status==='active'&&members.some(m=>m.workspace_id===c.id&&m.role==='owner'&&m.email===c.owner_email&&m.confirmed&&m.active)).length);
   const memberRows=[...document.querySelectorAll('#members > .invite')];
   members.forEach((member,index)=>{
     const row=memberRows[index];if(!row)return;
     const actions=row.querySelector('.actions');if(!actions)return;
     let slot=actions.querySelector('.it-member-state');
     if(!slot){slot=document.createElement('span');slot.className='it-member-state';actions.prepend(slot);}
     const company=companies.find(c=>c.id===member.workspace_id);
     const accessActive=member.active&&company?.status==='active'&&member.confirmed;
     const emailLabel=member.confirmed?'E-mail confirmado':'Pendente de confirmação';
     const accessLabel=accessActive?'Acesso ativo':'Acesso bloqueado';
     if(slot.dataset.email===emailLabel&&slot.dataset.access===accessLabel)return;
     slot.replaceChildren(status(emailLabel,member.confirmed?'ok':'wait'),status(accessLabel,accessActive?'ok':'off'));
     slot.dataset.email=emailLabel;slot.dataset.access=accessLabel;
   });
 }
 async function refreshStatus(){
   if(loading)return;const client=window.__detailnowAdminClient;if(!client)return;
   loading=true;
   try{
     const {data:{user},error:authError}=await client.auth.getUser();
     if(authError||!user){snapshot=null;return;}
     const {data:allowed,error:allowedError}=await client.rpc('detailnow_is_platform_admin');
     if(allowedError||allowed!==true){snapshot=null;return;}
     const {data,error}=await client.rpc('detailnow_admin_overview');
     if(error)throw error;snapshot=data;paint();
   }catch(error){console.warn('Não foi possível atualizar situação das contas:',error?.message||'erro desconhecido');}
   finally{loading=false;}
 }
 document.addEventListener('DOMContentLoaded',()=>{
   const companyRows=document.getElementById('companyRows'),members=document.getElementById('members');
   if(companyRows)new MutationObserver(paint).observe(companyRows,{childList:true});
   if(members)new MutationObserver(paint).observe(members,{childList:true});
   refreshStatus();
   window.addEventListener('focus',refreshStatus);
   document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshStatus();});
   const heading=document.querySelector('.intro');
   if(heading){const button=document.createElement('button');button.type='button';button.className='btn btn-sm btn-quiet';button.textContent='Atualizar status das contas';button.addEventListener('click',refreshStatus);heading.append(button);}
 });
})();