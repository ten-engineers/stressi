if(!self.define){let e,n={};const s=(s,i)=>(s=new URL(s+".js",i).href,n[s]||new Promise((n=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=n,document.head.appendChild(e)}else e=s,importScripts(s),n()})).then((()=>{let e=n[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(i,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(n[t])return;let c={};const o=e=>s(e,t),l={module:{uri:t},exports:c,require:o};n[t]=Promise.all(i.map((e=>l[e]||o(e)))).then((e=>(r(...e),c)))}}define(["./workbox-e20531c6"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-Da2vrl0k.css",revision:null},{url:"assets/index-O5GfnQyl.js",revision:null},{url:"assets/workbox-window.prod.es5-DL_hIMXg.js",revision:null},{url:"index.html",revision:"cc1b3b811ab7758928a47dc72b3da436"},{url:"manifest-icon-192.maskable.png",revision:"c9465f79f2ed8e429178b519e69046cb"},{url:"manifest-icon-512.maskable.png",revision:"1aff6a719927ccfc80415d441aee7d7b"},{url:"manifest.webmanifest",revision:"4f8ac231abad691c4e7f300d9dd45da3"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute((({request:e})=>"document"===e.destination||"script"===e.destination||"style"===e.destination),new e.NetworkFirst({cacheName:"offline-cache",plugins:[new e.ExpirationPlugin({maxEntries:50,maxAgeSeconds:2592e3})]}),"GET"),e.registerRoute((({request:e})=>"image"===e.destination),new e.CacheFirst({cacheName:"image-cache",plugins:[new e.ExpirationPlugin({maxEntries:50,maxAgeSeconds:2592e3})]}),"GET")}));
