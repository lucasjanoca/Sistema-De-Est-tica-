/* InfoTech.io | painel central; a autorização DE VERDADE vive nas RPCs do Supabase. */
(() => {
 'use strict';
 const config={url:'https://yncspxfsvlqdnodlsosb.supabase.co',key:'sb_publishable_jALAHHuvrV5oxj2mugWTCQ_stD_vFyN'};
 const $=id=>document.getElementById(id);
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let client,overview={companies:[],companies_pending:[],staff_pending:[],members:[],activity:[]},busy=false;
 const appUrl=new URL('index.html',document.baseURI).href;
 const companyName=id=>(overview.companies||[]).find(w=>w.id===id)?.name||'Empresa';
 function message(text,kind='info'){$('feedback').innerHTML=`<div class="note ${kind==='error'?'error':kind==='success'?'success':''}">${esc(text)}</div>`;}
 function showLogin(text){$('adminApp').classList.add('hidden');$('authScreen').classList.remove('hidden');$('logout').classList.add('hidden');if(text)message(text,'error');}
 function showAdmin(){$('authScreen').classList.add('hidden');$('adminApp').classList.remove('hidden');$('logout').classList.remove('hidden');}
 async function rpc(name,args={}){const {data,error}=await client.rpc(name,args);if(error)throw error;return data;}
 async function refresh(){overview=await rpc('detailnow_admin_overview');render();}
 async function validate(){const {data,error}=await client.auth.getUser();if(error||!data?.user){showLogin();return;}const allowed=await rpc('detailnow_is_platform_admin');if(!allowed){showLogin('Esta conta não possui autorização administrativa.');return;}showAdmin();await refresh();}
 function date(value){return value?new Date(value).toLocaleDateString('pt-BR'):'—';}
 function inviteMail(email,kind,name){const subject=kind==='company'?`Convite para acessar ${name} no InfoTech.io`:`Seu acesso a ${name} no InfoTech.io`;const body=`Olá!\n\nSeu acesso ao sistema InfoTech.io para ${name} foi preparado.\n\nAcesse: ${appUrl}\nEntre ou crie uma conta usando exatamente este e-mail (${email}), confirme o e-mail de cadastro e entre novamente. O estabelecimento será vinculado automaticamente.\n\nAtenção: não envie sua senha para ninguém.\n\nInfoTech.io`;
 return 'mailto:'+encodeURIComponent(email)+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);}
 function pendingItem(item,kind){const name=kind==='company'?item.name:companyName(item.workspace_id);const link=inviteMail(item.email,kind,name);return `<div class="invite"><div><strong>${esc(name)}</strong><small>${esc(item.email)}</small><small>Válido até ${date(item.expires_at)}</small></div><div class="actions"><a class="linkbtn btn-sm" href="${esc(link)}">Abrir e-mail</a><button type="button" class="btn btn-sm btn-danger" data-action="revoke" data-kind="${kind}" data-id="${esc(item.id)}">Revogar</button></div></div>`;}
 function render(){
  const companies=overview.companies||[],cp=overview.companies_pending||[],sp=overview.staff_pending||[];
  $('countCompanies').textContent=companies.length;$('countActive').textContent=companies.filter(c=>c.status==='active').length;$('countInvites').textContent=cp.length+sp.length;
  $('staffWorkspace').innerHTML=companies.filter(c=>c.status==='active').map(c=>`<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('')||'<option value="">Cadastre uma empresa ativa primeiro</option>';
  $('companyRows').innerHTML=companies.map(c=>`<tr><td><strong>${esc(c.name)}</strong><small>Desde ${date(c.created_at)}</small></td><td>${esc(c.owner_email||'Aguardando')}</td><td>${Number(c.members_count)||0}</td><td>${Number(c.orders_count)||0}</td><td><span class="badge ${c.status==='active'?'':'pause'}">${c.status==='active'?'Ativa':'Suspensa'}</span><div class="actions" style="margin-top:7px"><button class="btn btn-sm ${c.status==='active'?'btn-danger':''}" type="button" data-action="status" data-id="${esc(c.id)}" data-next="${c.status==='active'?'suspended':'active'}">${c.status==='active'?'Suspender':'Reativar'}</button></div></td></tr>`).join('')||'<tr><td colspan="5" class="empty">Nenhuma empresa cadastrada.</td></tr>';
  $('companyInvites').className=cp.length?'':'empty';$('companyInvites').innerHTML=cp.map(i=>pendingItem(i,'company')).join('')||'Nenhum convite pendente.';
  $('staffInvites').className=sp.length?'':'empty';$('staffInvites').innerHTML=sp.map(i=>pendingItem(i,'staff')).join('')||'Nenhum convite pendente.';
  const members=overview.members||[];
  $('members').className=members.length?'':'empty';$('members').innerHTML=members.map(m=>`<div class="invite"><div><strong>${esc(m.email)}</strong><small>${esc(companyName(m.workspace_id))}</small></div><div class="actions"><span class="badge">${m.role==='owner'?'Proprietário':'Funcionário'}</span>${m.role==='editor'?`<button type="button" class="btn btn-danger btn-sm" data-action="remove-staff" data-id="${esc(m.workspace_id)}" data-email="${esc(m.email)}">Remover</button>`:''}</div></div>`).join('')||'Nenhum usuário encontrado.';
  const activity=overview.activity||[];$('activity').innerHTML=activity.map(a=>`<div>${date(a.created_at)} • ${esc(({'company_invited':'Convite de empresa','staff_invited':'Convite de funcionário','company_status':'Alteração do status','invitation_revoked':'Convite revogado','company_invitation_accepted':'Empresa ativada','staff_invitation_accepted':'Funcionário ativado','staff_removed':'Funcionário removido'})[a.action]||a.action)}${a.workspace_id?' • '+esc(companyName(a.workspace_id)):''}</div>`).join('')||'<div>Sem registros.</div>';
 }
 async function perform(fn){if(busy)return;busy=true;document.querySelectorAll('button[type="submit"],button[data-action]').forEach(b=>b.disabled=true);try{await fn();await refresh();}catch(error){message(error?.message||'Falha no Supabase.','error');}finally{busy=false;document.querySelectorAll('button[type="submit"],button[data-action]').forEach(b=>b.disabled=false);}}
 document.addEventListener('DOMContentLoaded',async()=>{
  if(!window.supabase?.createClient){showLogin('Não foi possível carregar o Supabase. Atualize a página.');return;}
  client=window.supabase.createClient(config.url,config.key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  try{await validate();}catch(error){showLogin(error?.message||'Falha ao verificar permissões.');}
  $('loginForm').addEventListener('submit',event=>{event.preventDefault();perform(async()=>{const form=event.target;const {error}=await client.auth.signInWithPassword({email:form.elements.email.value.trim(),password:form.elements.password.value});if(error)throw error;await validate();message('Acesso administrativo verificado.','success');});});
  $('logout').addEventListener('click',()=>perform(async()=>{const {error}=await client.auth.signOut();if(error)throw error;showLogin();message('Você saiu da conta.','success');}));
  $('companyForm').addEventListener('submit',event=>{event.preventDefault();perform(async()=>{const form=event.target;const name=form.elements.name.value.trim(),email=form.elements.email.value.trim();await rpc('detailnow_admin_invite_company',{p_name:name,p_email:email});form.reset();message('Empresa reservada. Clique em “Abrir e-mail” no convite para enviá-lo ao proprietário.','success');});});
  $('staffForm').addEventListener('submit',event=>{event.preventDefault();perform(async()=>{const form=event.target;await rpc('detailnow_invite_staff',{p_workspace:form.elements.workspace.value,p_email:form.elements.email.value.trim()});form.elements.email.value='';message('Funcionário convidado. Envie o convite por e-mail na lista abaixo.','success');});});
  document.addEventListener('click',event=>{const button=event.target.closest('button[data-action]');if(!button)return;
   const action=button.dataset.action;
   if(action==='status'){const next=button.dataset.next,id=button.dataset.id;const name=companyName(id);if(!confirm(`${next==='suspended'?'Suspender':'Reativar'} ${name}? ${next==='suspended'?'Os funcionários perderão acesso aos dados enquanto estiver suspensa.':'O acesso será restaurado.'}`))return;perform(async()=>{await rpc('detailnow_admin_set_company_status',{p_workspace:id,p_status:next});message(`Status de ${name} atualizado.`, 'success');});}
   if(action==='revoke'){if(!confirm('Revogar este convite? O usuário não conseguirá usá-lo.'))return;perform(async()=>{await rpc('detailnow_admin_revoke_invitation',{p_id:button.dataset.id,p_kind:button.dataset.kind});message('Convite revogado.','success');});}
   if(action==='remove-staff'){const email=button.dataset.email,company=companyName(button.dataset.id);if(!confirm(`Remover o funcionário ${email} de ${company}? O acesso será revogado.`))return;perform(async()=>{await rpc('detailnow_remove_staff',{p_workspace:button.dataset.id,p_email:email});message('Acesso do funcionário revogado.','success');});}
  });
 });
})();