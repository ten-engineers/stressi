if(!self.define){let e,s={};const n=(n,i)=>(n=new URL(n+".js",i).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(i,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(s[o])return;let c={};const t=e=>n(e,o),l={module:{uri:o},exports:c,require:t};s[o]=Promise.all(i.map((e=>l[e]||t(e)))).then((e=>(r(...e),c)))}}define(["./workbox-e20531c6"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/browser-bDRLhZDD.js",revision:null},{url:"assets/index-BGNC1S8Z.js",revision:null},{url:"assets/index-Da2vrl0k.css",revision:null},{url:"assets/workbox-window.prod.es5-DL_hIMXg.js",revision:null},{url:"index.html",revision:"ef0a62ade9f400b5fe85ba34c6533c49"},{url:"icon-192x192.png",revision:"c9465f79f2ed8e429178b519e69046cb"},{url:"icon-512x512-maskable.png",revision:"1aff6a719927ccfc80415d441aee7d7b"},{url:"icon-512x512.png",revision:"1aff6a719927ccfc80415d441aee7d7b"},{url:"manifest.webmanifest",revision:"a964fc42dc8155d6b7708f359294bf6e"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute((({request:e})=>"document"===e.destination||"script"===e.destination||"style"===e.destination),new e.NetworkFirst({cacheName:"offline-cache",plugins:[new e.ExpirationPlugin({maxEntries:50,maxAgeSeconds:2592e3})]}),"GET"),e.registerRoute((({request:e})=>"image"===e.destination),new e.CacheFirst({cacheName:"image-cache",plugins:[new e.ExpirationPlugin({maxEntries:50,maxAgeSeconds:2592e3})]}),"GET")}));
