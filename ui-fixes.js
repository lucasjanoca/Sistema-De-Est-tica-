/* InfoTech.io: menu da equipe, formulários e tabelas sem corte em telas pequenas. */
(() => {
 'use strict';
 const allowed=new Set(['dashboard','orders','budgets']);
 const employee=()=>CLOUD.active&&CLOUD.workspace&&CLOUD.roleByWorkspace?.[CLOUD.workspace.id]==='editor';
 const style=document.createElement('style');
 style.textContent=`
 *,*::before,*::after{box-sizing:border-box}
 html,body,.app-shell{width:100%;max-width:100%;margin:0}
 .main-content{width:0;flex:1 1 0;min-width:0}
 .page-content,#app,.topbar,.topbar-start,.topbar-actions,.page-heading,.heading-actions,
 .metric-grid,.dashboard-grid,.finance-grid,.cards-grid,.order-cards,.agenda-grid,.report-cards,
 .panel,.hero,.hero-copy,.metric,.order-card,.mini-row,.mini-info,.panel-title,.form-grid,
 .field,.detail-grid,.detail-cell,.toolbar,.table-scroll,.modal,.modal-head,.modal-body,
 .modal-footer,.right-actions,.auth-panel,.it-services{min-width:0;max-width:100%}
 .page-content,.mini-info,.order-card,.panel,.detail-cell{overflow-wrap:anywhere}
 .field input,.field select,.field textarea,.search input,.it-service-row input,
 .it-service-row select{min-width:0;max-width:100%}
 .table-scroll{width:100%;max-width:100%;overflow-x:auto}
 .modal-backdrop{overflow:hidden}
 .modal,.modal.wide{display:flex;flex-direction:column;min-height:0;overflow:hidden;
   max-height:min(92dvh,900px);max-width:calc(100vw - 24px)}
 .modal-head,.modal-footer{flex:0 0 auto;min-width:0}
 .modal-body{flex:1 1 auto;min-height:0;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain}
 .modal-footer{position:relative;z-index:2}
 .it-employee-home .metric-grid{grid-template-columns:repeat(3,minmax(0,1fr))}
 @media(max-width:1100px){
   .metric-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
   .dashboard-grid,.finance-grid{grid-template-columns:minmax(0,1fr)}
   .cards-grid,.order-cards,.agenda-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
   .topbar,.topbar-start,.topbar-actions{gap:8px}
 }
 @media(max-width:760px){
   .app-shell{display:block}.main-content{width:100%}
   .sidebar{position:fixed;width:min(265px,85vw);max-width:85vw}
   .topbar{height:auto;min-height:60px;width:100%;padding:10px 12px!important;gap:8px}
   .topbar-start{flex:1 1 auto}.topbar-actions{flex:0 0 auto;gap:5px}
   .topbar-date,.top-new{display:none!important}
   .breadcrumbs{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
   .page-content{width:100%;padding:16px 12px calc(85px + env(safe-area-inset-bottom))!important}
   .page-heading{flex-direction:column;align-items:stretch!important;gap:12px}
   .page-heading>div,.heading-actions{width:100%;max-width:100%}
   .heading-actions{justify-content:stretch}.heading-actions .btn{flex:1 1 auto;min-width:0}
   .metric-grid,.it-employee-home .metric-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
   .cards-grid,.order-cards,.agenda-grid,.report-cards{grid-template-columns:minmax(0,1fr)}
   .modal-backdrop{inset:0;padding:8px 8px calc(8px + env(safe-area-inset-bottom));
     align-items:center;justify-content:center;overflow:hidden}
   .modal,.modal.wide{width:100%!important;max-width:100%!important;
     max-height:calc(100dvh - 16px - env(safe-area-inset-bottom));border-radius:13px}
   .modal-head,.modal-body{padding:14px!important}
   .modal-footer{padding:12px!important;display:flex;flex-direction:column;align-items:stretch;gap:8px}
   .modal-footer>.muted{display:none}
   .modal-footer .right-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));width:100%;gap:8px}
   .modal-footer .right-actions .btn{width:100%;min-width:0;white-space:normal;text-align:center}
   .form-grid{grid-template-columns:minmax(0,1fr)!important;gap:12px}
   .field.full,.form-grid>.full{grid-column:1/-1}
   .form-section,.order-total,.panel-title,.split-top,.detail-service,.mini-row,
   .order-card-head,.order-card-foot{flex-wrap:wrap}
   .detail-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
   .table-scroll{overflow:visible}
   .table-scroll table,.table-scroll tbody,.table-scroll tr,.table-scroll td{
     display:block;width:100%;min-width:0;max-width:100%}
   .table-scroll thead{display:none}
   .table-scroll tr{background:var(--panel,#fff);border:1px solid var(--border,#304661);
     border-radius:10px;margin-bottom:10px;padding:5px 9px}
   .table-scroll td{display:grid;grid-template-columns:minmax(70px,36%) minmax(0,1fr);
     align-items:start;gap:8px;border-bottom:1px solid var(--border,#304661);
     padding:10px 3px;overflow-wrap:anywhere;text-align:left!important;white-space:normal!important}
   .table-scroll td:last-child{border-bottom:0}
   .table-scroll td::before{content:attr(data-it-label);font-size:10px;font-weight:800;
     text-transform:uppercase;color:var(--muted,#93a3b5);overflow-wrap:anywhere}
   .table-scroll td>*{min-width:0;max-width:100%}
   .bar-row{grid-template-columns:minmax(52px,20%) minmax(0,1fr) minmax(64px,27%)}
   .service-line{grid-template-columns:20px minmax(0,1fr) minmax(70px,90px);padding:8px;gap:6px}
   .service-line input[type=number]{min-width:0;width:100%}
   .mobile-nav{width:100%;grid-template-columns:repeat(5,minmax(0,1fr))}
   .mobile-link{min-width:0;overflow-wrap:anywhere}
   .auth-panel{width:100%;max-width:calc(100vw - 20px)}
 }
 @media(max-width:400px){
   .metric-grid,.it-employee-home .metric-grid,.detail-grid{grid-template-columns:minmax(0,1fr)}
   .topbar-actions .account-btn{padding:7px 9px!important;min-height:36px;font-size:11px}
   .modal-footer .right-actions{grid-template-columns:minmax(0,1fr)}
   .modal-footer .right-actions .btn{min-height:42px}
   .it-service-row{grid-template-columns:minmax(0,1fr)!important}
 }`;
 document.head.appendChild(style);
 function labels(root){
   root?.querySelectorAll('.table-scroll table').forEach(table=>{
     const headings=[...table.querySelectorAll('thead th')].map(x=>x.textContent.trim());
     table.querySelectorAll('tbody tr').forEach(tr=>[...tr.children].forEach((td,i)=>{
       if(td.tagName==='TD'&&!td.dataset.itLabel)td.dataset.itLabel=headings[i]||'Informação';
     }));
   });
 }
 const beforeNav=renderNav;
 renderNav=function(...args){
   if(!employee())return beforeNav(...args);
   if(!allowed.has(page))page='dashboard';
   const nav=NAV.filter(x=>allowed.has(x.id));
   document.getElementById('sidebarNav').innerHTML=nav.map(n=>`<button class="nav-item ${page===n.id?'active':''}" data-action="go" data-page="${n.id}">${icon(n.icon)}<span>${e(n.name)}</span></button>`).join('');
   document.getElementById('mobileNav').innerHTML=nav.map(n=>`<button class="mobile-link ${page===n.id?'active':''}" data-action="go" data-page="${n.id}">${icon(n.icon)}<span>${e(n.name)}</span></button>`).join('');
   document.getElementById('breadcrumb').textContent=nav.find(n=>n.id===page)?.name||'Visão Geral';
   document.getElementById('topDate').textContent=new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'});
 };
 const beforeDashboard=dashboardView;
 dashboardView=function(...args){
   if(!employee())return beforeDashboard(...args);
   const today=db.orders.filter(o=>!['orcamento','cancelado'].includes(o.status)&&o.scheduledDate===iso());
   const working=db.orders.filter(o=>o.status==='em_andamento');
   const quotes=db.orders.filter(o=>o.status==='orcamento');
   return `<div class="it-employee-home">${pageHead('EQUIPE','Visão Geral','Atendimentos e orçamentos do estabelecimento.')}
    <div class="metric-grid">${metricCard('Atendimentos hoje',today.length,'Programação do dia','car','blue')}
    ${metricCard('Em execução',working.length,'Serviços em andamento','clock','orange')}
    ${metricCard('Orçamentos',quotes.length,'Propostas cadastradas','clipboard','blue')}</div>
    <section class="panel"><div class="panel-title"><h3>Atendimentos de hoje</h3><button class="link-button" data-action="go" data-page="orders">Ver atendimentos →</button></div>${orderTable(today)}</section></div>`;
 };
 const beforeRender=render;
 render=function(...args){if(employee()&&!allowed.has(page))page='dashboard';const output=beforeRender(...args);labels(document.getElementById('app'));return output;};
 const beforeOpen=openModal;
 openModal=function(which,id){
   if(employee()&&!['orderForm','orderDetail'].includes(which)){
     notice('Acesso restrito à Visão Geral, Atendimentos e Orçamento.','error');return;
   }
   return beforeOpen(which,id);
 };
 const beforeModal=renderModal;
 renderModal=function(...args){
   const output=beforeModal(...args),root=document.getElementById('modalRoot');
   labels(root);
   if(root.querySelector('#billForm')&&!employee()){
     const footer=root.querySelector('.modal-footer');
     if(footer){
       let button=footer.querySelector('button[form="billForm"][type="submit"]');
       if(!button){button=document.createElement('button');button.type='submit';button.setAttribute('form','billForm');button.className='btn btn-primary';(footer.querySelector('.right-actions')||footer).append(button);}
       button.hidden=false;button.disabled=false;button.textContent='Salvar conta';
     }
   }
   return output;
 };
 document.addEventListener('click',ev=>{
   if(!employee())return;
   const btn=ev.target.closest('[data-action]');if(!btn)return;
   const blocked=(btn.dataset.action==='go'&&!allowed.has(btn.dataset.page||'dashboard'))||
     ['new-client','new-bill','new-expense','pay-bill','payment','export','export-report','download-report'].includes(btn.dataset.action);
   if(blocked){ev.preventDefault();ev.stopImmediatePropagation();notice('Esta função está disponível somente para o proprietário.','error');}
 },true);
 document.addEventListener('submit',ev=>{
   if(employee()&&['clientForm','expenseForm','billForm','paymentForm','it-catalog-form'].includes(ev.target.id)){
     ev.preventDefault();ev.stopImmediatePropagation();notice('Esta função está disponível somente para o proprietário.','error');
   }
 },true);
 CLOUD.refreshUI();render();
})();