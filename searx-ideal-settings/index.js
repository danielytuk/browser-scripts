// ==UserScript==
// @name         Ideal Search Settings for Searx
// @description  Automatically sets ideal search parameters for enhanced search experience
// @version      1.0
// @grant        none
// @run-at       document-start
// ==/UserScript==

(() => {
    'use strict';

    // Add desired query parameters to the URL before visiting the page
    const urlString = new URL(window.location.href);
    urlString.searchParams.set("category_general", "1");
    urlString.searchParams.set("language", "auto");
    urlString.searchParams.set("time_range", "");
    urlString.searchParams.set("safesearch", "0");
    urlString.searchParams.set("theme", "simple");
    window.location.href = urlString.href;
})();
