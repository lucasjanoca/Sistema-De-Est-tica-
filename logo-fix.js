/* Marca final: força o ícone vetorial integrado ao aplicativo. */
(() => {
 'use strict';
 const path='infotech-mark.svg';
 function apply(){document.querySelectorAll('.brand-mark img,.auth-title img').forEach(img=>{if(img.getAttribute('src')!==path){img.src=path;img.alt='InfoTech.io'}})}
 const observer=new MutationObserver(apply);
 observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});
 apply();
})();