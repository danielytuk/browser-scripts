// ==UserScript==
// @name         Piped Video Enhancer
// @description  Enhances the Piped video player interface by hiding the navbar, extending the video display area, and setting video resolution to 1080p automatically
// @icon         https://cdn.statically.io/gh/TeamPiped/Piped/3a78b19a/public/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @grant        none
// @author       danielytuk
// @version      1.38
// @run-at       document-idle
// @match        https://piped.lunar.icu/watch?v=*
// @match        https://piped.projectsegfau.lt/watch?v=*
// @match        https://piped.us.projectsegfau.lt/watch?v=*
// @match        https://piped.smnz.de/watch?v=*
// @match        https://piped.adminforge.de/watch?v=*
// @match        https://piped.astartes.nl/watch?v=*
// @match        https://piped.drgns.space/watch?v=*
// @match        https://piped.ngn.tf/watch?v=*
// @match        https://piped.privacydev.net/watch?v=*
// @match        https://piped.ducks.party/watch?v=*
// @downloadURL  https://cdn.jsdelivr.net/gh/danielytuk/browser-scripts@raw/main/piped-video-enhancer/index.js
// ==/UserScript==

(async () => {
    'use strict';
    let handleScroll, handler;
    const applyCinemaMode = (navbar, videoPlayer) => {
        Object.assign(videoPlayer.style, { width: '100%', height: 'calc(100vh - 50px)', maxHeight: '131vh' });
        navbar.style.display = window.scrollY ? 'block' : 'none';
        window.addEventListener('scroll', () => navbar.style.display = window.scrollY ? 'block' : 'none');
    };
    const select1080pResolution = () => {
        const resolutionsMenu = document.querySelector(".shaka-resolutions");
        const select1080p = () => resolutionsMenu.querySelector('.explicit-resolution[data-value="1080"]')?.click();
        resolutionsMenu && resolutionsMenu.querySelector && resolutionsMenu.querySelector('.shaka-resolutions-button')?.addEventListener('click', select1080p);
    };
    const checkForElements = () => {
        const navbar = document.querySelector('nav');
        const videoPlayer = document.querySelector('.player-container');
        if (navbar && videoPlayer) {
            applyCinemaMode(navbar, videoPlayer);
            select1080pResolution();
        } else {
            window.requestAnimationFrame(checkForElements);
        }
    };
    const observer = new MutationObserver(checkForElements);
    observer.observe(document.body, { childList: true, subtree: true });
    const debounceScroll = () => {
        handleScroll = () => {
            requestAnimationFrame(scrollHandler);
        };
        window.addEventListener('scroll', handler = handleScroll);
    };
    window.addEventListener('beforeunload', (event) => {
        handleScroll = null;
        window.removeEventListener('scroll', handler);
        observer.disconnect();
        event.preventDefault();
    });
    window.addEventListener('DOMContentLoaded', checkForElements);
    debounceScroll();
})();
