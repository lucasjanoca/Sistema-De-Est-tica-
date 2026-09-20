/* Integra o painel SaaS com a interface; permissões permanecem no Supabase. */
(() => {
 'use strict';
 CLOUD.isPlatformAdmin=false;
 CLOUD.roleByWorkspace={};
 const previousShow=CLOUD.show.bind(CLOUD);
 CLOUD.show=function(message=''){
   previousShow(message);
   if(!this.user)return;
   const root=document.getElementById('authRoot');
   const companyForm=root.querySelector('#cloudCompany');
   if(companyForm){
     companyForm.remove();
     if(!this.workspaces.length){
       const info=document.createElement('p');info.className='auth-message';
       info.textContent='Aguarde um convite da InfoTech.io. Depois entre com este mesmo e-mail confirmado para acessar sua empresa.';
       root.querySelector('.auth-bottom')?.before(info);
     }
   }
   const bottom=root.querySelector('.auth-bottom');
   if(this.isPlatformAdmin&&bottom){
     const link=document.createElement('a');link.href='admin.html';link.className='btn btn-primary';
     link.textContent='🛡 Administrar empresas • InfoTech.io';bottom.before(link);
   }
   if(bottom&&this.active&&this.workspace&&this.roleByWorkspace?.[this.workspace.id]==='owner'){
     const form=document.createElement('form');form.id='ownerInvite';form.className='auth-form';
     form.innerHTML='<label>Convidar funcionário<input type="email" name="email" required placeholder="funcionario@empresa.com"></label><button type="submit" class="btn btn-outline">Preparar convite</button><small>Compartilhe o link de acesso após criar o convite. O envio do e-mail não é automático.</small>';
     bottom.before(form);
   }
 };
 const previousRefresh=CLOUD.refreshUI.bind(CLOUD);
 CLOUD.refreshUI=function(){
   previousRefresh();
   let shortcut=document.getElementById('platformAdminShortcut');
   if(this.user&&this.isPlatformAdmin){
     if(!shortcut){shortcut=document.createElement('a');shortcut.id='platformAdminShortcut';shortcut.href='admin.html';shortcut.className='btn btn-outline btn-sm';shortcut.textContent='🛡 Admin';document.querySelector('.topbar-actions').insertBefore(shortcut,document.getElementById('cloudButton'));}
   }else if(shortcut)shortcut.remove();
 };
 CLOUD.loadWorkspaces=async function(){
   try{const invite=await this.client.rpc('detailnow_claim_invitations');if(invite.error)console.warn('Convites:',invite.error.message);}
   catch(error){console.warn('Convites:',error?.message);}
   try{
     const admin=await this.client.rpc('detailnow_is_platform_admin');
     this.isPlatformAdmin=!admin.error&&admin.data===true;
     const members=await this.client.from('detailnow_memberships').select('workspace_id,role');
     this.roleByWorkspace=Object.fromEntries((members.data||[]).map(m=>[m.workspace_id,m.role]));
     const {data,error}=await this.client.from('detailnow_workspaces').select('id,name,created_at,status').order('created_at',{ascending:true});
     if(error)throw error;
     this.workspaces=data||[];
     const active=this.workspaces.filter(w=>w.status==='active');
     if(!active.length){
       this.workspace=null;this.active=false;db=emptyData();this.refreshUI();render();
       this.show(this.workspaces.length?'Este estabelecimento está suspenso. Entre em contato com a InfoTech.io.':'Sua conta está ativa, mas aguarda convite para um estabelecimento.');return;
     }
     let preferred=null;try{preferred=localStorage.getItem('detailnow_workspace_id');}catch(_){}
     await this.selectWorkspace(active.find(w=>w.id===preferred)?.id||active[0].id);
   }catch(error){this.show(error?.message||'Não foi possível carregar o estabelecimento.');throw error;}
 };
 const previousSelect=CLOUD.selectWorkspace.bind(CLOUD);
 CLOUD.selectWorkspace=async function(id){
   if(this.workspaces.find(w=>w.id===id)?.status!=='active'){this.show('Estabelecimento suspenso ou sem acesso.');return;}
   return previousSelect(id);
 };
 CLOUD.createCompany=function(){this.show('Novas empresas são cadastradas exclusivamente no painel InfoTech.io. Aguarde seu convite.');};
 document.addEventListener('submit',async event=>{
   if(event.target.id!=='ownerInvite')return;
   event.preventDefault();
   if(!event.target.reportValidity()||!CLOUD.workspace)return;
   const email=event.target.elements.email.value.trim();
   try{const {error}=await CLOUD.client.rpc('detailnow_invite_staff',{p_workspace:CLOUD.workspace.id,p_email:email});
     if(error)throw error;
     CLOUD.show(`Convite registrado para ${email}. Envie o link de acesso do sistema; a pessoa deve entrar com o mesmo e-mail confirmado.`);
   }catch(error){CLOUD.show(error?.message||'Falha ao convidar funcionário.');}
 });
 CLOUD.refreshUI();
})();