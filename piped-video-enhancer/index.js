// ==UserScript==
// @name         Piped Video Enhancer
// @description  Enhances the Piped video player interface by hiding the navbar, extending the video display area, and setting video resolution to 1080p automatically
// @icon         https://cdn.statically.io/gh/TeamPiped/Piped/3a78b19a/public/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @grant        none
// @author       danielytuk
// @version      1.22
// @run-at       document-idle
// @match        https://piped.lunar.icu/watch?v=*
// @match        https://piped.projectsegfau.lt/watch?v=*
// @match        https://piped.privacydev.net/watch?v=*
// @match        https://piped.smnz.de/watch?v=*
// @match        https://piped.adminforge.de/watch?v=*
// @match        https://piped.astartes.nl/watch?v=*
// @match        https://piped.drgns.space/watch?v=*
// @match        https://piped.ngn.tf/watch?v=*
// @match        https://piped.us.projectsegfau.lt/watch?v=*
// @match        https://piped.ducks.party/watch?v=*
// ==/UserScript==

/*
    Code ran through ChatGPT 4 to optimise using proper practices.
    If you can improve the code further, so it's more optimised.
    Feel free to open a pull request.
*/

(() => {
    'use strict';
    let handleScroll = null;
    const debounce = (func, delay) => {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    };

    // Cached references to DOM elements
    const navbar = document.querySelector('nav');
    const videoPlayer = document.querySelector('.player-container');

    // Function to apply cinema mode
    const toggleNavbar = () => {
        navbar.style.display = window.scrollY ? 'block' : 'none';
    };

    const applyCinemaMode = () => {
        Object.assign(videoPlayer.style, { width: '100%', height: 'calc(100vh - 50px)', maxHeight: '131vh' });
        toggleNavbar();
        handleScroll = toggleNavbar;
    };

    const select1080pResolution = () => {
        const resolutionsMenu = document.querySelector("#app > div > div.w-full > div:nth-child(1) > div:nth-child(1) > div > div.shaka-controls-container > div.shaka-no-propagation.shaka-show-controls-on-mouse-over.shaka-settings-menu.shaka-resolutions");
        const resolutionButtons = document.querySelectorAll('.explicit-resolution');
        if (resolutionsMenu && resolutionButtons.length > 0) {
            for (const button of resolutionButtons) {
                if (button.innerText === '1080p') {
                    button.click();
                    break;
                }
            }
        }
    };

    const checkForElements = () => {
        if (navbar && videoPlayer) {
            applyCinemaMode();
            select1080pResolution();
        }
    };

    const observer = new MutationObserver(debounce(checkForElements, 100)); // Throttle checkForElements
    observer.observe(document.body, { childList: true, subtree: true });

    const scrollHandler = () => handleScroll && handleScroll();
    window.addEventListener('scroll', debounce(scrollHandler, 100)); // Debounce scroll event

    window.addEventListener('beforeunload', (event) => {
        if (handleScroll) {
            handleScroll = null;
            window.removeEventListener('scroll', scrollHandler);
            observer.disconnect();
            event.preventDefault();
        }
    });

    window.addEventListener('DOMContentLoaded', checkForElements);
})();
