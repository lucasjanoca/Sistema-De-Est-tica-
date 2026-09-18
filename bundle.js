/* DetailNow by InfoTech.io | static deployment loader. */
(async()=>{
 async function text(file){const response=await fetch(file,{cache:'no-store'});if(!response.ok)throw new Error('Arquivo do aplicativo não encontrado: '+file);return response.text()}
 async function unpack(base64){const bytes=Uint8Array.from(atob(base64),c=>c.charCodeAt(0));return new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text()}
 try{
  const style=document.createElement('style');style.textContent=await unpack(await text('style.b64'));document.head.appendChild(style);
  const parts=await Promise.all(['code-1.b64','code-2.b64','code-3.b64'].map(text));const source=await unpack(parts.join(''));
  const url=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));const script=document.createElement('script');script.src=url;script.onload=()=>URL.revokeObjectURL(url);script.onerror=()=>{URL.revokeObjectURL(url);throw Error('Falha ao carregar o aplicativo')};document.head.appendChild(script);
 }catch(error){console.error(error);const root=document.querySelector('#authRoot');if(root)root.textContent='Erro ao carregar DetailNow. Confira sua conexão e atualize a página.'}
})();
