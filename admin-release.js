/* InfoTech.io | correções do painel: criação segura e exclusão com exportação. */
(() => {
 'use strict';
 const $ = id => document.getElementById(id);
 const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
 const url = 'https://yncspxfsvlqdnodlsosb.supabase.co';
 const key = 'sb_publishable_jALAHHuvrV5oxj2mugWTCQ_stD_vFyN';
 let client, working = false, backup = null;
 const style = document.createElement('style');
 style.textContent = `#companyForm,#staffForm{display:none!important}.it-access{display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:24px}.it-access form{margin-top:12px}.it-help{font-size:12px;color:#c4d7ee;margin-top:12px}.it-danger{background:#421f2a!important;border-color:#b35c71!important;color:#ffe1e7!important}@media(max-width:760px){.it-access{grid-template-columns:1fr}.it-access .card{padding:16px}}`;
 document.head.appendChild(style);
 const flash = (text, error = false) => { $('feedback').innerHTML = `<div class="note ${error?'error':'success'}">${escapeHtml(text)}</div>`; };
 async function rpc(name, args = {}) { const {data,error} = await client.rpc(name,args); if(error)throw Error(error.message || 'Falha no banco.'); return data; }
 async function authorized() {
  const {data,error} = await client.auth.getUser();
  if(error || !data?.user)throw Error('Entre novamente na sua conta administrativa.');
  if(await rpc('detailnow_is_platform_admin') !== true)throw Error('Acesso reservado à administração InfoTech.io.');
 }
 async function createAccount(email,password) {
  const {data,error} = await client.functions.invoke('detailnow-admin-create-account',{body:{email,password}});
  if(error){
   let reason = '';
   try {const response = error.context; if(response?.json){const payload=await response.clone().json(); reason=String(payload.error || payload.message || '').slice(0,300);} }catch(_){}
   throw Error(reason || `Não foi possível criar a conta (${error.context?.status || 'erro de conexão'}). Tente novamente.`);
  }
  if(!data || data.error)throw Error(data?.error || 'O servidor não confirmou o cadastro.');
  return data;
 }
 function finish(text) {sessionStorage.setItem('it-admin-notice',text); location.reload();}
 async function perform(fn) {
  if(working)return;
  working=true;
  document.querySelectorAll('[data-it-submit],[data-it-action]').forEach(b=>b.disabled=true);
  try {await authorized();await fn();} catch(error){flash(error?.message || 'Não foi possível concluir.',true);}
  finally {working=false;document.querySelectorAll('[data-it-submit],[data-it-action]').forEach(b=>b.disabled=false);}
 }
 const forms = `<section class="it-access" id="itAccess"><article class="card"><div class="eyebrow">CADASTRO DE EMPRESAS</div><h3>Nova empresa e proprietário</h3><form id="itCompanyForm"><label>Nome do estabelecimento<input name="name" required minlength="2" maxlength="90" placeholder="Ex.: Oliveira Estética Automotiva"></label><label>E-mail do CEO<input name="email" type="email" autocomplete="off" required placeholder="proprietario@gmail.com"></label><label>Senha inicial<input name="password" type="password" autocomplete="new-password" minlength="10" maxlength="128" required placeholder="Mínimo de 10 caracteres"></label><button data-it-submit class="btn btn-primary" type="submit">Criar empresa e conta</button></form><p class="it-help">Se a conta já existir, a senha atual será mantida. O e-mail deverá estar confirmado para a pessoa entrar.</p></article><article class="card"><div class="eyebrow">EQUIPE</div><h3>Cadastrar funcionário</h3><form id="itStaffForm"><label>Estabelecimento<select id="itStaffCompany" name="workspace" required></select></label><label>E-mail do funcionário<input name="email" type="email" autocomplete="off" required placeholder="funcionario@gmail.com"></label><label>Senha inicial<input name="password" type="password" autocomplete="new-password" minlength="10" maxlength="128" required placeholder="Mínimo de 10 caracteres"></label><button data-it-submit class="btn btn-primary" type="submit">Criar funcionário</button></form><p class="it-help">A conta ficará vinculada somente à empresa selecionada. O funcionário não poderá alterar os preços padrão.</p></article></section>`;
 function install() {
  const first = $('adminApp')?.querySelector('section.section.layout');
  if(first && !$('itAccess')){first.insertAdjacentHTML('beforebegin',forms);first.classList.add('hidden');}
  const invites = $('companyInvites')?.closest('section.section.layout'); if(invites)invites.classList.add('hidden');
  const invitesMetric = $('countInvites')?.closest('.metric'); if(invitesMetric)invitesMetric.classList.add('hidden');
  const company = $('itCompanyForm');
  company?.addEventListener('submit',event=>{
   event.preventDefault();if(!company.reportValidity())return;
   perform(async()=>{
    const name=company.elements.name.value.trim(),email=company.elements.email.value.trim().toLowerCase(),password=company.elements.password.value;
    const account=await createAccount(email,password);
    try {await rpc('detailnow_admin_provision_company',{p_name:name,p_email:email});}
    catch(error){throw Error(`A conta foi verificada/criada, mas não foi vinculada à empresa: ${error.message}. Repita o cadastro; a senha de uma conta existente não será alterada.`);}
    finish(account.confirmationSent?'Empresa e CEO cadastrados. Foi solicitado o envio de um e-mail de confirmação.':account.confirmed?'Empresa e CEO cadastrados. Conta existente e confirmada.':'Empresa e CEO cadastrados, mas a confirmação do e-mail ainda está pendente. Verifique a configuração de envio no Supabase e repita a operação de reenvio, se necessário.');
   });
  });
  const staff = $('itStaffForm');
  staff?.addEventListener('submit',event=>{
   event.preventDefault();if(!staff.reportValidity())return;
   perform(async()=>{
    const email=staff.elements.email.value.trim().toLowerCase(),password=staff.elements.password.value,workspace=staff.elements.workspace.value;
    if(!workspace)throw Error('Selecione uma empresa ativa.');
    const account=await createAccount(email,password);
    try {await rpc('detailnow_admin_provision_staff',{p_workspace:workspace,p_email:email});}
    catch(error){throw Error(`A conta foi verificada/criada, mas não foi vinculada como funcionário: ${error.message}. Repita o cadastro sem criar outra conta.`);}
    finish(account.confirmationSent?'Funcionário cadastrado. Foi solicitado o envio de um e-mail de confirmação.':account.confirmed?'Funcionário cadastrado. Conta existente e confirmada.':'Funcionário cadastrado, mas o e-mail ainda precisa ser confirmado. Verifique o SMTP do Supabase.');
   });
  });
  $('itStaffCompany')?.addEventListener('focus',()=>{loadCompanies().catch(()=>{});});
 }
 async function loadCompanies(){
  await authorized();
  const {companies=[]} = await rpc('detailnow_admin_overview');
  const selector = $('itStaffCompany');if(!selector)return;
  const current=selector.value;
  selector.innerHTML=companies.filter(c=>c.status==='active').map(c=>`<option value="${escapeHtml(c.id)}">${escapeHtml(c.name)}</option>`).join('') || '<option value="">Nenhuma empresa ativa</option>';
  if([...selector.options].some(option=>option.value===current))selector.value=current;
 }
 function addDeleteButtons(){
  for(const row of $('companyRows')?.querySelectorAll('tr') || []){
   const status = row.querySelector('button[data-action="status"]');
   if(!status || row.querySelector('[data-it-action="delete"]'))continue;
   const company=row.querySelector('td strong')?.textContent?.trim() || '';
   const button=document.createElement('button');
   button.type='button';button.className='btn btn-sm it-danger';button.textContent='Excluir';
   button.dataset.itAction='delete';button.dataset.workspace=status.dataset.id;button.dataset.company=company;
   status.parentElement?.appendChild(button);
  }
 }
 function downloadBackup(data,name,id){
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const href=URL.createObjectURL(blob),anchor=document.createElement('a');
  anchor.href=href;anchor.download=`infotech-backup-${name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9-]/gi,'-').slice(0,35)}-${id.slice(0,8)}.json`;
  document.body.appendChild(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(href),60000);
 }
 async function deleteCompany(button){
  const id=button.dataset.workspace,name=button.dataset.company;
  if(!id||!name)throw Error('Empresa inválida. Atualize a página.');
  const preview=await rpc('detailnow_admin_delete_preview',{p_workspace:id});
  if(preview.status!=='suspended')throw Error('Primeiro clique em Suspender para bloquear o acesso. Depois clique em Excluir para fazer o backup e confirmar a exclusão definitiva.');
  if(!backup || backup.id!==id || backup.revision!==preview.revision){
   backup=null;
   const okay=confirm(`Excluir ${name}? Antes da exclusão definitiva, será exportada uma cópia com ${preview.clients} clientes, ${preview.orders} atendimentos, ${preview.members} usuários vinculados e ${preview.backups} backups. A conta de login será mantida no Supabase compartilhado. Deseja gerar a cópia?`);
   if(!okay)return;
   const data=await rpc('detailnow_admin_export_company',{p_workspace:id,p_reason:'Backup prévio solicitado antes da exclusão de empresa'});
   if(!data?.export_id)throw Error('A exportação não foi confirmada pelo servidor. Nenhum dado foi excluído.');
   downloadBackup(data,name,id);
   backup={id,name,exportId:data.export_id,revision:preview.revision};
   button.textContent='Confirmar exclusão';
   flash('O backup foi preparado para download. Confira se o arquivo JSON foi salvo. Somente depois clique em “Confirmar exclusão” para continuar.');
   return;
  }
  const entered=prompt(`EXCLUSÃO DEFINITIVA de ${name}. Confirme que salvou o backup e digite exatamente o nome da empresa:`, '');
  if(entered===null)return;
  if(entered.trim()!==name)throw Error('Nome diferente. A empresa permanece intacta.');
  if(!confirm(`Última confirmação: APAGAR DEFINITIVAMENTE os dados de ${name}? Esta operação não pode ser desfeita no painel. O arquivo de backup deve estar salvo.`))return;
  try {await rpc('detailnow_admin_delete_company',{p_workspace:id,p_confirm_name:name,p_export_id:backup.exportId,p_confirm_delete:true});}
  catch(error){backup=null;button.textContent='Excluir';throw Error(`${error.message} Nenhum dado foi excluído por esta tentativa; gere um backup atualizado antes de tentar novamente.`);}
  backup=null;finish('A empresa foi excluída definitivamente após exportação e confirmação. A conta de login no Supabase compartilhado foi preservada.');
 }
 document.addEventListener('DOMContentLoaded',()=>{
  install();
  if(!window.supabase?.createClient)return;
  // Reuse the dashboard's Supabase instance to avoid competing token refreshes and anonymous RPCs.
  client=window.__detailnowAdminClient || window.supabase.createClient(url,key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  const notice=sessionStorage.getItem('it-admin-notice');if(notice){sessionStorage.removeItem('it-admin-notice');flash(notice);}
  const rows=$('companyRows');if(rows){new MutationObserver(addDeleteButtons).observe(rows,{childList:true});addDeleteButtons();}
  loadCompanies().catch(()=>{});
  client.auth.onAuthStateChange((event,session)=>{if(session)setTimeout(()=>loadCompanies().catch(()=>{}),150);});
 });
 document.addEventListener('click',event=>{
  const button=event.target.closest('button[data-it-action="delete"]');if(!button)return;
  event.preventDefault();event.stopImmediatePropagation();
  perform(()=>deleteCompany(button));
 },true);
})();