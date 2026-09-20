/* InfoTech.io | static loader for compact application build. */
(async()=>{
 async function text(file){const response=await fetch(file,{cache:'no-store'});if(!response.ok)throw new Error('Arquivo do aplicativo não encontrado: '+file);return response.text()}
 async function unpack(base64){const bytes=Uint8Array.from(atob(base64),c=>c.charCodeAt(0));return new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text()}
 try{
  const style=document.createElement('style');style.textContent=await unpack(await text('style.b64'));document.head.appendChild(style);
  const parts=await Promise.all(['code-1.b64','code-2.b64','code-3.b64'].map(text));
  let source=await unpack(parts.join(''));
  source=source
    .replace('<div class="note">Os números seguem os registros lançados. Um serviço não pago entra em <b>“a receber”</b> e só aumenta o caixa quando o pagamento é registrado. O saldo exibido não inclui saldo bancário anterior nem apura lucro contábil.</div>','')
    .replace('<div class="note info-note mt-16">A mensagem ao cliente é apenas preparada no WhatsApp. O envio exige confirmação manual e o telefone precisa estar cadastrado.</div>','')
    .replaceAll('DetailNow by InfoTech.io','InfoTech.io')
    .replaceAll('DetailNow • by InfoTech.io','InfoTech.io • Gestão automotiva')
    .replaceAll('RELATÓRIO DETAILNOW','RELATÓRIO INFOTECH.IO')
    .replaceAll('DETAILNOW / INFOTECH.IO','INFOTECH.IO / GESTÃO AUTOMOTIVA')
    .replaceAll('O link precisa voltar para este endereço do DetailNow.','O link precisa voltar para este endereço do sistema.');
  const extensions=await Promise.all(['infotech-custom.js','admin-extension.js'].map(text));
  const url=URL.createObjectURL(new Blob([[source,...extensions].join('\n;\n')],{type:'text/javascript'}));
  const script=document.createElement('script');script.src=url;
  script.onload=()=>URL.revokeObjectURL(url);
  script.onerror=()=>{URL.revokeObjectURL(url);throw Error('Falha ao carregar o aplicativo')};
  document.head.appendChild(script);
 }catch(error){console.error(error);const root=document.querySelector('#authRoot');if(root)root.textContent='Erro ao carregar InfoTech.io. Confira sua conexão e atualize a página.'}
})();