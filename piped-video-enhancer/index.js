// ==UserScript==
// @name         Piped Video Enhancer
// @description  Enhances the Piped video player interface by hiding the navbar, extending the video display area, and setting video resolution to 1080p automatically
// @icon         https://cdn.statically.io/gh/TeamPiped/Piped/3a78b19a/public/favicon.ico
// @grant        none
// @author       danielytuk
// @version      1.82
// @run-at       document-idle
// @downloadURL  https://cdn.jsdelivr.net/gh/danielytuk/browser-scripts/piped-video-enhancer/index.js
// @match        https://piped.lunar.icu/watch?v=*
// @match        https://piped.projectsegfau.lt/watch?v=*
// @match        https://piped.privacydev.net/watch?v=*
// @match        https://piped.smnz.de/watch?v=*
// @match        https://piped.adminforge.de/watch?v=*
// @match        https://piped.yt/watch?v=*
// @match        https://piped.drgns.space/watch?v=*
// @match        https://pi.ggtyler.dev/watch?v=*
// @match        https://auth.minionflo.net/if/flow/login/?next=%2Fapplication%2Fo%2Fauthorize%2F%3Fclient_id%3DitqJeMzh8MceyJQ6xj9uVmYk2roNRA6SdKR1TFeZ%26redirect_uri%3Dhttps%253A%252F%252Fpiped.minionflo.net%252Foutpost.goauthentik.io%252Fcallback%253FX-authentik-auth-callback%253Dtrue%26response_type%3Dcode%26scope%3Dopenid%2Bemail%2Bprofile%2Bak_proxy%26state%3De4YnEuNCFDv5BBgAFVn78Rs1eBgXSBtN29eenuxal-g/watch?v=*
// @match        https://yt.cdsp.cz/watch?v=*
// @match        https://piped.reallyaweso.me/watch?v=*
// @match        https://auth.minionflo.net/if/flow/login/?next=%2Fapplication%2Fo%2Fauthorize%2F%3Fclient_id%3DitqJeMzh8MceyJQ6xj9uVmYk2roNRA6SdKR1TFeZ%26redirect_uri%3Dhttps%253A%252F%252Fpiped.minionflo.net%252Foutpost.goauthentik.io%252Fcallback%253FX-authentik-auth-callback%253Dtrue%26response_type%3Dcode%26scope%3Dopenid%2Bemail%2Bprofile%2Bak_proxy%26state%3DsaEo-6XEO3cY1mu09WO0NqAlaweCasu0XKFuecye6pA/watch?v=*
// @match        https://piped.ducks.party/watch?v=*
// ==/UserScript==

(async () => {
    "use strict";
    const applyCinemaMode = () => {
        const videoElement = document.querySelector(".player-container");
        const navbar = document.querySelector("nav");
        if (videoElement) {
            videoElement.style.width = "100%";
            videoElement.style.height = "calc(100vh - 50px)";
            videoElement.style.maxHeight = "131vh";
        }
        if (navbar) {
            navbar.style.display = window.scrollY ? "block" : "none";
            window.addEventListener("scroll", () => navbar.style.display = window.scrollY ? "block" : "none");
    };
    const set1080pResolution = () => {
        const resolutions = document.querySelectorAll(".shaka-resolution");
        resolutions.forEach(resolution => {
            if (resolution.getAttribute("data-value") === "1080") {
                resolution.click();
            }
        });
    const checkForElements = () => {
        const video = document.querySelector(".player-container");
        if (navbar && video) {
            applyCinemaMode();
            set1080pResolution();
        } else {
            requestAnimationFrame(checkForElements);
    const debounceScroll = () => {
        let scrollHandler;
        const scrollListener = () => {
            if (!scrollHandler) {
                scrollHandler = () => {
                    requestAnimationFrame(() => {
                        scrollHandler = null;
                        applyCinemaMode();
                    });
                };
                requestAnimationFrame(scrollHandler);
        };
        window.addEventListener("scroll", scrollListener);
    const disconnectBeforeUnload = () => {
        window.addEventListener("beforeunload", () => {
            window.removeEventListener("scroll", debounceScroll);
            document.defaultView.disconnect();
        }, 0);
    window.addEventListener("DOMContentLoaded", () => {
        checkForElements();
        debounceScroll();
        disconnectBeforeUnload();
    });
})();
  disconnectBeforeUnload();
