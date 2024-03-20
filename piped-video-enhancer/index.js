// ==UserScript==
// @name         Piped Video Enhancer
// @description  Enhances the Piped video player interface by hiding the navbar, extending the video display area, and setting video resolution to 1080p automatically
// @icon         https://cdn.statically.io/gh/TeamPiped/Piped/3a78b19a/public/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @grant        none
// @author       danielytuk
// @version      1.26
// @run-at       document-idle
// @match        https://piped.lunar.icu/watch?v=*
// @match        https://piped.projectsegfau.lt/watch?v=*
// @match        https://piped.in.projectsegfau.lt/watch?v=*
// @match        https://piped.us.projectsegfau.lt/watch?v=*
// @match        https://piped.privacydev.net/watch?v=*
// @match        https://piped.smnz.de/watch?v=*
// @match        https://piped.adminforge.de/watch?v=*
// @match        https://piped.astartes.nl/watch?v=*
// @match        https://piped.drgns.space/watch?v=*
// @match        https://pi.ggtyler.dev/watch?v=*
// ==/UserScript==

/*
    Code ran through ChatGPT 4 multiple times to optimise using proper practices.
    If you can improve the code further, so it's more optimised.
    Feel free to open a pull request.
*/
(() => {
    'use strict';
    let handleScroll = null;
    let checkElementsTimeout = null;
    const applyCinemaMode = (navbar, videoPlayer) => {
        const toggleNavbar = () => navbar.style.display = window.scrollY ? 'block' : 'none';
        Object.assign(videoPlayer.style, { width: '100%', height: 'calc(100vh - 50px)', maxHeight: '131vh' });
        toggleNavbar();
        handleScroll = toggleNavbar;
    };
    const select1080pResolution = () => {
        const resolutionsMenu = document.querySelector(".shaka-resolutions");
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
        const navbar = document.querySelector('nav');
        const videoPlayer = document.querySelector('.player-container');
        if (navbar && videoPlayer) {
            applyCinemaMode(navbar, videoPlayer);
            select1080pResolution();
        } else {
            checkElementsTimeout = requestAnimationFrame(checkForElements);
    const observer = new MutationObserver(() => {
        cancelAnimationFrame(checkElementsTimeout);
        checkForElements();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const scrollHandler = () => {
        if (!handleScroll) return;
        handleScroll();
    const debounceScroll = () => {
        if (handleScroll) return;
        handleScroll = () => {
            requestAnimationFrame(scrollHandler);
        };
    window.addEventListener('scroll', debounceScroll);
    window.addEventListener('beforeunload', (event) => {
        if (handleScroll) {
            handleScroll = null;
            window.removeEventListener('scroll', debounceScroll);
            observer.disconnect();
            cancelAnimationFrame(checkElementsTimeout);
            event.preventDefault();
    const waitForVueElements = () => {
        if (document.querySelector('.shaka-resolutions') && document.querySelector('.player-container')) {
            checkForElements();
            checkElementsTimeout = requestAnimationFrame(waitForVueElements);
    window.addEventListener('DOMContentLoaded', waitForVueElements);
})();
