// ==UserScript==
// @name         YouTube Download
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hijack YouTube Premium download button to use Cobalt API.
// @author       danielytuk
// @match        https://www.youtube.com/watch?v=*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    // Add custom CSS for the modal to match YouTube's design
    GM_addStyle(`
        .custom-modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 320px;
            padding: 16px;
            background-color: #fff;
            box-shadow: 0 8px 28px rgba(0, 0, 0, 0.3);
            border-radius: 8px;
            font-family: Roboto, Arial, sans-serif;
            color: #0f0f0f;
        }
        .custom-modal.active { display: block; }
        .custom-modal h3 {
            margin: 0 0 16px 0;
            font-size: 16px;
            font-weight: 500;
        }
        .custom-modal button {
            display: block;
            width: 100%;
            margin-bottom: 8px;
            padding: 10px 16px;
            background-color: #ff0000;
            color: #fff;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        .custom-modal button:hover { background-color: #cc0000; }
        .custom-modal button:last-child { margin-bottom: 0; }
    `);
  
    const apiUrl = `https://api.cobalt.tools/api/json?videoId=${videoId}&quality=${quality}&disablemetadata=true&alwaysproxy=true&audiobitrate=256`;
    let modal, lastUrl = window.location.href, isButtonHijacked = false;

    // Utility function to create and show the custom modal
    function showCustomModal() {
        if (modal) return; // Avoid creating multiple modals

        modal = document.createElement('div');
        modal.className = 'custom-modal';

        const title = document.createElement('h3');
        title.textContent = 'Select Download Option';
        modal.appendChild(title);

        const qualityOptions = [
            { label: '720p', quality: '720' },
            { label: '1080p', quality: '1080' },
            //{ label: '2K', quality: '1440' },
            //{ label: '4K', quality: '2160' },
            { label: 'Max', quality: 'max' },
            { label: 'Download Audio', quality: 'audio' }
        ];

        qualityOptions.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option.label;
            button.addEventListener('click', () => {
                downloadVideo(option.quality);
                closeModal();
            });
            modal.appendChild(button);
        });

        document.body.appendChild(modal);
        modal.classList.add('active');

        // Close modal when clicking outside
        document.addEventListener('click', handleOutsideClick);
    }

    // Function to handle the download request
    function downloadVideo(quality) {
        const videoId = new URLSearchParams(window.location.search).get('v');
        if (!videoId) return alert('Unable to extract video ID.');

        GM_xmlhttpRequest({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Cache-Control': 'no-cache',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                url: window.location.href,
                vQuality: quality,
                filenamePattern: 'basic',
                isAudioOnly: quality === 'audio',
                disableMetadata: true,
                alwaysproxy: true,
                audiobitrate: 256,
            }),
            onload(response) {
                const result = JSON.parse(response.responseText);
                if (result?.url) window.open(result.url, '_blank');
                else alert('Failed to retrieve download link.');
            },
            onerror(err) {
                alert('An error occurred while fetching the download link.');
                console.error(err);
            }
        });
    }

    // Function to handle clicks outside the modal
    function handleOutsideClick(event) {
        if (modal && !modal.contains(event.target)) closeModal();
    }

    // Function to close the modal
    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.removeChild(modal);
            modal = null;
            document.removeEventListener('click', handleOutsideClick);
        }
    }

    // Function to hijack the download button click
    function hijackDownloadButton() {
        if (isButtonHijacked) return; // Avoid re-hijacking

        const downloadButton = document.querySelector('#flexible-item-buttons > ytd-download-button-renderer > ytd-button-renderer > yt-button-shape > button');
        if (downloadButton) {
            downloadButton.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                showCustomModal();
            }, true);
            isButtonHijacked = true;
        }
    }

    // Throttled function to handle URL changes
    let urlChangeTimeout;
    function handleUrlChange() {
        clearTimeout(urlChangeTimeout);
        urlChangeTimeout = setTimeout(() => {
            const currentUrl = window.location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                isButtonHijacked = false; // Reset hijacking status
                hijackDownloadButton(); // Re-hijack button when the URL changes
            }
        }, 1500); // Adjust delay as needed
    }

    // Initialize script on page load
    window.addEventListener('load', () => {
        hijackDownloadButton(); // Initial hijack
        new MutationObserver(handleUrlChange).observe(document, { subtree: true, childList: true });
    });
})();
