// ==UserScript==
// @name         Piped Video Enhancer
// @description  Enhances the Piped video player interface by hiding the navbar, extending the video display area, and setting video resolution to 1080p automatically
// @icon         https://cdn.statically.io/gh/TeamPiped/Piped/3a78b19a/public/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @grant        none
// @author       danielytuk
// @version      1.42
// @run-at       document-idle
// @downloadURL  https://cdn.jsdelivr.net/gh/danielytuk/browser-scripts@raw/main/piped-video-enhancer/index.js
// @match        https://piped.projectsegfau.lt/watch?v=*
// @match        https://piped.us.projectsegfau.lt/watch?v=*
// @match        https://piped.smnz.de/watch?v=*
// @match        https://piped.adminforge.de/watch?v=*
// @match        https://piped.astartes.nl/watch?v=*
// @match        https://piped.drgns.space/watch?v=*
// @match        https://piped.ngn.tf/watch?v=*
// @match        https://piped.privacydev.net/watch?v=*
// @match        https://piped.ducks.party/watch?v=*
// ==/UserScript==

(async()=>{
"use strict";
let hS,h;
const aCinemaMode=[v=>{
    v.style.width="100%";
    v.style.height="calc(100vh-50px)";
    v.style.maxHeight="131vh";
    n.style.display=w.scrollY?"block":"none";
    w.addEventListener("scroll",()=>n.style.display=w.scrollY?"block":"none")
},s1080pR=()=>{
    const r=d.querySelectorAll(".shaka-resolution");
    r.forEach(t=>t.getAttribute("data-value")==="1080"&&t.click())
},cFE=()=>{
    const n=d.querySelector("nav"),v=d.querySelector(".player-container");
    if(n&&v)aCinemaMode(n,v),s1080pR()
    else requestAnimationFrame(cFE)
},d=document,w=window,n=d.querySelector("nav"),v=d.querySelector(".player-container");
if(n&&v)aCinemaMode(n,v);
s1080pR();
const dBS=()=>{
    hS=()=>requestAnimationFrame(hS);
    w.addEventListener("scroll",h=hS)
};
w.addEventListener("beforeunload",()=>{
    h=null;
    w.removeEventListener("scroll",h);
    d.querySelector(".shaka-resolutions")?d.disconnect():""
},0);
w.addEventListener("DOMContentLoaded",cFE);
dBS()
})();
