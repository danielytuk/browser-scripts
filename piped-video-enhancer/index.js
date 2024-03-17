// ==UserScript==
// @name         Piped Video Enhancer
// @description  Enhances the Piped video player interface by hiding the navbar, extending the video display area, and setting video resolution to 1080p automatically
// @icon         https://cdn.statically.io/gh/TeamPiped/Piped/3a78b19a/public/favicon.ico
// @match        https://piped.lunar.icu/watch?v=*
// @grant        none
// @author       danielytuk
// @version      1.20
// @run-at       document-idle
// ==/UserScript==

(() => {
    'use strict';
    let handleScroll = null;
    const applyCinemaMode = (navbar, videoPlayer) => {
        const toggleNavbar = () => navbar.style.display = window.scrollY ? 'block' : 'none';
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
    const checkForElements = () => {
        const navbar = document.querySelector('nav'), videoPlayer = document.querySelector('.player-container');
        if (navbar && videoPlayer) {
            applyCinemaMode(navbar, videoPlayer);
            select1080pResolution();
    const observer = new MutationObserver(checkForElements);
    observer.observe(document.body, { childList: true, subtree: true });
    const scrollHandler = () => handleScroll && handleScroll();
    window.addEventListener('scroll', scrollHandler);
    window.addEventListener('beforeunload', (event) => {
        if (handleScroll) {
            handleScroll = null;
            window.removeEventListener('scroll', scrollHandler);
            observer.disconnect();
            event.preventDefault();
    });
    window.addEventListener('DOMContentLoaded', checkForElements);
})();
checkForElements);
