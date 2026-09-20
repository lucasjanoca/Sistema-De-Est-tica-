/* InfoTech.io: login Google, identidade visual e uma empresa por conta.
   Complemento carregado junto ao aplicativo; preserva empresas legadas existentes. */
(() => {
  'use strict';
  const logo = 'https://raw.githubusercontent.com/lucasjanoca/InfoTech.io/main/assets/brand/logo-192.webp';
  function useOfficialLogo(root=document) {
    root.querySelectorAll('img[src="infotech-mark.svg"]').forEach(img => {
      img.alt = 'Logo oficial InfoTech.io';
      img.addEventListener('error', () => {img.src='infotech-mark.svg';}, {once:true});
      img.src = logo;
    });
  }
  const oldShow = CLOUD.show.bind(CLOUD);
  CLOUD.show = function(message='') {
    oldShow(message);
    const root = document.getElementById('authRoot');
    const heading = root.querySelector('.auth-title');
    if(heading) {
      heading.querySelector('b').textContent='InfoTech.io';
      heading.querySelector('small').textContent='Sistema de gestão para estéticas automotivas';
    }
    useOfficialLogo(root);
    const login = root.querySelector('#cloudLogin');
    if(login) {
      const divider=document.createElement('div');
      divider.className='google-divider';
      divider.textContent='ou';
      const button=document.createElement('button');
      button.type='button';
      button.className='btn google-login';
      button.dataset.cloudAction='google';
      button.textContent='Entrar com Google';
      login.after(divider,button);
    }
    if(this.user) {
      const companyForm=root.querySelector('#cloudCompany');
      if(this.workspaces.length && companyForm) companyForm.remove();
      const companies=root.querySelector('.workspace-list');
      if(companies && this.workspaces.length===1) {
        const current=document.createElement('div');
        current.className='workspace-current';
        current.textContent='Empresa vinculada: '+this.workspaces[0].name;
        companies.replaceWith(current);
      } else if(companies && this.workspaces.length>1) {
        // A conta já possuía duas empresas antes da regra nova. Não excluir nem ocultar dados.
        const warning=document.createElement('p');
        warning.className='auth-message legacy-company-warning';
        warning.textContent='Esta conta já tem mais de uma empresa cadastrada. Os dados existentes foram preservados; escolha uma empresa abaixo. Novos cadastros de empresa nesta conta estão bloqueados.';
        companies.before(warning);
      }
      if(!this.workspaces.length && companyForm) {
        const label=companyForm.querySelector('label');
        if(label)label.firstChild.textContent='Nome da sua empresa';
        const create=companyForm.querySelector('button[type="submit"]');
        if(create)create.textContent='Criar minha empresa';
      }
    }
  };
  const oldRefresh=CLOUD.refreshUI.bind(CLOUD);
  CLOUD.refreshUI=function() {
    oldRefresh();
    document.getElementById('workspaceSwitch').hidden=true;
    const footer=document.getElementById('appFooter');
    footer.textContent=footer.textContent.replaceAll('DetailNow by InfoTech.io','InfoTech.io').replaceAll('DetailNow • by InfoTech.io','InfoTech.io');
    useOfficialLogo();
  };
  const oldCreateCompany=CLOUD.createCompany.bind(CLOUD);
  CLOUD.createCompany=function(form) {
    if(this.workspaces.length) {
      this.show('Cada conta pode criar somente uma empresa. Para outro estabelecimento, utilize outra conta.');
      return;
    }
    return oldCreateCompany(form);
  };
  CLOUD.loginWithGoogle=async function() {
    if(!this.client){this.show('Serviço de acesso indisponível. Tente novamente.');return;}
    try {
      const {error}=await this.client.auth.signInWithOAuth({
        provider:'google',
        options:{redirectTo:location.origin+location.pathname}
      });
      if(error)throw error;
    } catch(error) {
      this.show('Não foi possível entrar com Google: '+(error?.message||'verifique a configuração do provedor Google no Supabase.'));
    }
  };
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-cloud-action="google"]');
    if(!button)return;
    event.preventDefault();
    button.disabled=true;
    button.textContent='Abrindo Google…';
    CLOUD.loginWithGoogle();
  },true);
  const oldRender=render;
  render=function(...args){
    const result=oldRender(...args);
    const kicker=document.querySelector('.welcome-kicker');
    if(kicker)kicker.textContent='INFOTECH.IO / GESTÃO AUTOMOTIVA';
    return result;
  };
  const style=document.createElement('style');
  style.textContent='.google-divider{text-align:center;color:#8da1ba;font-size:11px;margin:13px 0 10px}.google-login{display:flex;width:100%;background:#fff;color:#26354b;border:1px solid #cfd8e4;font-weight:800}.google-login:before{content:"G";display:grid;place-items:center;font-weight:900;font-size:16px;width:23px;height:23px;border-radius:50%;color:#4285f4;background:#eff5ff}.google-login:hover{background:#f2f6fc}.workspace-current{border:1px solid #36557c;border-radius:9px;background:#14263f;padding:14px;margin:14px 0;color:#d8e8ff;font-size:12px;font-weight:700}.legacy-company-warning{margin-top:14px}.brand-mark{background:#111d30}.brand-mark img,.auth-title img{object-fit:contain;background:#111d30}';
  document.head.appendChild(style);
  CLOUD.refreshUI();
  if(!CLOUD.active && document.getElementById('authRoot').querySelector('.auth-panel'))CLOUD.show();
})();