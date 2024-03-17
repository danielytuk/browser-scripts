// ==UserScript==
// @name         Piped Video Enhancer
// @description  Enhances the Piped video player interface by hiding the navbar and extending the video display area
// @author       danielytuk
// @version      1.8
// @grant        none
// @run-at       document-idle
// @icon         https://cdn.statically.io/gh/TeamPiped/Piped/3a78b19a/public/favicon.ico
// @match        https://worker-snowy-cake-fcf5.cueisdi.workers.dev/watch?v=*
// @match        https://piped-instances.kavin.rocks/watch?v=*
// ==/UserScript==

(() => {
    'use strict';

    let handleScroll = null;

    const applyCinemaMode = (navbar, videoPlayer) => {
        const toggleNavbar = () => navbar.style.display = window.scrollY === 0 ? "none" : "block";
        Object.assign(videoPlayer.style, { width: "100%", height: "calc(100vh - 50px)", maxHeight: "131vh" });
        toggleNavbar();
        window.addEventListener('scroll', handleScroll);
    };

    const checkForElements = () => {
        const [navbar, videoPlayer] = [document.querySelector('nav'), document.querySelector('.player-container')];
        if (navbar && videoPlayer) {
            handleScroll = () => navbar.style.display = window.scrollY === 0 ? "none" : "block";
            applyCinemaMode(navbar, videoPlayer);
        } else setTimeout(checkForElements, 1000);
    };

    window.addEventListener('beforeunload', (event) => {
        if (handleScroll) {
            window.removeEventListener('scroll', handleScroll);
            event.preventDefault(); // Prevent the default behavior (page reload)
        }
    });

    checkForElements();
})();
