if(!self.define){let e,n={};const s=(s,i)=>(s=new URL(s+".js",i).href,n[s]||new Promise((n=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=n,document.head.appendChild(e)}else e=s,importScripts(s),n()})).then((()=>{let e=n[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(i,r)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(n[c])return;let o={};const t=e=>s(e,c),l={module:{uri:c},exports:o,require:t};n[c]=Promise.all(i.map((e=>l[e]||t(e)))).then((e=>(r(...e),o)))}}define(["./workbox-e20531c6"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-Da2vrl0k.css",revision:null},{url:"assets/index-Dty3_81Z.js",revision:null},{url:"assets/workbox-window.prod.es5-DL_hIMXg.js",revision:null},{url:"index.html",revision:"8978d42c99696b1dbd7dfa11c6730867"},{url:"icon-192x192.png",revision:"03bdab1532d5fc98d81c3468580ce910"},{url:"icon-512x512-maskable.png",revision:"0211a3adaae9a2a8c2064ea46d9c64c3"},{url:"icon-512x512.png",revision:"b611ac14f3edce371ff05a8dabe99eb8"},{url:"manifest.webmanifest",revision:"a964fc42dc8155d6b7708f359294bf6e"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute((({request:e})=>"document"===e.destination||"script"===e.destination||"style"===e.destination),new e.NetworkFirst({cacheName:"offline-cache",plugins:[new e.ExpirationPlugin({maxEntries:50,maxAgeSeconds:2592e3})]}),"GET"),e.registerRoute((({request:e})=>"image"===e.destination),new e.CacheFirst({cacheName:"image-cache",plugins:[new e.ExpirationPlugin({maxEntries:50,maxAgeSeconds:2592e3})]}),"GET")}));
