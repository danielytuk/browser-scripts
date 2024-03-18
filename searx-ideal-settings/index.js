// ==UserScript==
// @name         Ideal Search Settings for Searx
// @description  Automatically sets ideal search parameters for enhanced search experience. Make sure you change "HTTP Method" to GET in Preferences.
// @author       danielytuk
// @version      1.3
// @grant        none
// @match        https://baresearch.org/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://copp.gg/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://darmarit.org/searx/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://etsi.me/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://freesearch.club/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://northboot.xyz/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://nyc1.sx.ggtyler.dev/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://ooglester.com/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://opnxng.com/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://paulgo.io/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://priv.au/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://s.mble.dk/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://s.trung.fun/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://search.broker/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://search.bus-hit.me/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://search.colbster937.dev/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://search.datura.network/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://search.demoniak.ch/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://search.gcomm.ch/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://search.hbubli.cc/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://search.im-in.space/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://search.in.projectsegfau.lt/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://search.inetol.net/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://search.leptons.xyz/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://search.mdosch.de/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://search.nadeko.net/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://search.ononoki.org/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://search.privacyredirect.com/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://search.projectsegfau.lt/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://search.rhscz.eu/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://search.rowie.at/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://search.sapti.me/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://search.smnz.de/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://search.starless.one/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://search.upinmars.com/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://searx.aleteoryx.me/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://searx.ankha.ac/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://searx.ari.lt/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://searx.baczek.me/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://searx.be/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://searx.catfluori.de/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://searx.daetalytica.io/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://searx.ee/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://searx.foss.family/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://searx.headpat.exchange/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://searx.juancord.xyz/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://searx.kutay.dev/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://searx.lunar.icu/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://searx.namejeff.xyz/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://searx.nobulart.com/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://searx.oakleycord.dev/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://searx.ox2.fr/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://searx.perennialte.ch/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://searx.rhscz.eu/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://searx.sev.monster/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://searx.si/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://searx.techsaviours.org/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://searx.tuxcloud.net/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://searx.work/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://searx.zhenyapav.com/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://searxng.brihx.fr/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://searxng.ca/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://searxng.ch/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://searxng.online/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://searxng.site/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://sex.finaltek.net/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://sx.catgirl.cloud/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://sx.thatxtreme.dev/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://twinkpad.pl/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://www.gruble.de/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://www.jabber-germany.de/searx/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
// @match        https://xo.wtf/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple
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
