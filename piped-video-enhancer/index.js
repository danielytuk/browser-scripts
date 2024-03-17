// ==UserScript==
// @name         Piped Video Enhancer
// @description  Enhances the Piped video player interface by hiding the navbar and extending the video display area
// @author       danielytuk
// @version      1.0
// @grant        none
// @match        https://piped.smnz.de/watch?v=*
 https://pipedapi.syncpundit.io *://https://pipedapi.darkness.services *://https://pipedapi.us.projectsegfau.lt *://https://pipedapi.kavin.rocks *://https://pipedapi.ducks.party *://https://pipedapi.astartes.nl *://https://pipedapi.smnz.de *://https://pipedapi-libre.kavin.rocks *://https://pipedapi.drgns.space *://https://piapi.ggtyler.dev *://https://pipedapi.r4fo.com *://https://pipedapi.coldforge.xyz *://https://pipedapi.adminforge.de *://https://piped-api.lunar.icu *://https://pipedapi.ngn.tf *://https://api.piped.privacydev.net *://https://api.piped.projectsegfau.lt/watch?v=*
 https://pipedapi.astartes.nl *://https://pipedapi.us.projectsegfau.lt *://https://pipedapi.syncpundit.io *://https://pipedapi.drgns.space *://https://pipedapi.ducks.party *://https://pipedapi.ngn.tf *://https://pipedapi-libre.kavin.rocks *://https://pipedapi.darkness.services *://https://pipedapi.smnz.de *://https://api.piped.projectsegfau.lt *://https://piapi.ggtyler.dev *://https://pipedapi.coldforge.xyz *://https://pipedapi.adminforge.de *://https://pipedapi.r4fo.com *://https://piped-api.lunar.icu *://https://pipedapi.kavin.rocks *://https://pipedapi.leptons.xyz/watch?v=*
// @run-at       document-idle
// @icon         https://cdn.statically.io/gh/TeamPiped/Piped/3a78b19a/public/favicon.ico
// ==/UserScript==
// @match        https://pipedapi.kavin.rocks/watch?v=*
// @match        https://pipedapi.syncpundit.io/watch?v=*
// @match        https://piped-api.lunar.icu/watch?v=*
// @match        https://pipedapi.r4fo.com/watch?v=*
// @match        https://pipedapi.darkness.services/watch?v=*
// @match        https://pipedapi-libre.kavin.rocks/watch?v=*
// @match        https://api.piped.projectsegfau.lt/watch?v=*
// @match        https://pipedapi.us.projectsegfau.lt/watch?v=*
// @match        https://api.piped.privacydev.net/watch?v=*
// @match        https://pipedapi.smnz.de/watch?v=*
// @match        https://pipedapi.adminforge.de/watch?v=*
// @match        https://pipedapi.astartes.nl/watch?v=*
// @match        https://pipedapi.drgns.space/watch?v=*
// @match        https://pipedapi.ducks.party/watch?v=*
// @match        https://pipedapi.ngn.tf/watch?v=*
// @match        https://pipedapi.coldforge.xyz/watch?v=*
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
// @match https://piapi.ggtyler.dev/watch?v=*
