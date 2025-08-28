// ==UserScript==
// @name         YouTube One-Ear/Mono Audio Fix (Stereo-Safe, Optimized)
// @namespace    danielytuk
// @version      1.0
// @description  Preserve stereo and fix mono/one-ear audio.
// @match        *://www.youtube.com/watch?v=*
// @grant        none
// @license      CC BY-NC 4.0
// ==/UserScript==
 
(() => {
    
    // CHATGPT USED FOR COMMENTS.
    
    // A single AudioContext is reused for all videos.
    // AudioContext is the Web Audio API engine that lets us route/process audio.
    let audioCtx;
 
    // WeakSet ensures we only fix each <video> element once.
    // It automatically releases memory when video elements are removed.
    const processedVideos = new WeakSet();
 
    /**
     * Helper function to calculate RMS (Root Mean Square) volume of a signal buffer.
     * RMS is a good way to detect whether a channel is effectively "silent."
     * The buffer values are between 0–255, centered around 128.
     */
    const calculateRMS = buffer => {
        const sum = buffer.reduce((acc, value) => {
            const normalized = (value - 128) / 128; // convert to range [-1, 1]
            return acc + normalized ** 2;
        }, 0);
        return Math.sqrt(sum / buffer.length);
    };
 
    /**
     * Core setup for a video element
     * - Creates the audio graph
     * - Monitors left/right channels
     * - Decides whether to merge channels (mono fix) or leave stereo untouched
     */
    const setupVideo = video => {
        if (!video || processedVideos.has(video)) return;
 
        // Create AudioContext if not yet created
        audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === "suspended") {
            audioCtx.resume(); // resume if browser had auto-suspended it
        }
 
        // Create audio nodes
        const sourceNode   = audioCtx.createMediaElementSource(video); // video element → audio graph
        const splitterNode = audioCtx.createChannelSplitter(2);        // splits into L/R
        const mergerNode   = audioCtx.createChannelMerger(2);          // combines back into stereo
        const gainNode     = audioCtx.createGain();                    // used only if we need mono merge
        const analyserL    = audioCtx.createAnalyser();                // analyser for left channel
        const analyserR    = audioCtx.createAnalyser();                // analyser for right channel
 
        // Keep analysers lightweight
        analyserL.fftSize = 32;
        analyserR.fftSize = 32;
 
        // GainNode default = no change
        gainNode.gain.value = 1;
 
        // Build the base routing
        sourceNode.connect(splitterNode);     // send video audio → splitter
        mergerNode.connect(audioCtx.destination); // final output → speakers
        splitterNode.connect(analyserL, 0);   // monitor left channel
        splitterNode.connect(analyserR, 1);   // monitor right channel
 
        // Mark this video as processed
        processedVideos.add(video);
 
        /**
         * Periodically check channel levels
         * - If one channel is silent → merge both into mono (fix one-ear problem)
         * - If both channels active → preserve original stereo
         */
        const checkAudio = () => {
            // Create small buffers to hold analyser time-domain data
            const bufferL = new Uint8Array(analyserL.fftSize);
            const bufferR = new Uint8Array(analyserR.fftSize);
 
            // Fill buffers with current waveform samples
            analyserL.getByteTimeDomainData(bufferL);
            analyserR.getByteTimeDomainData(bufferR);
 
            // Calculate RMS volume of each channel
            const rmsL = calculateRMS(bufferL);
            const rmsR = calculateRMS(bufferR);
 
            // Decide if a channel is effectively "silent"
            const leftSilent  = rmsL < 0.02;
            const rightSilent = rmsR < 0.02;
 
            // Clear any old routing before re-routing
            try { splitterNode.disconnect(); } catch {}
            try { gainNode.disconnect(); } catch {}
 
            if (leftSilent || rightSilent) {
                // 🔊 Case 1: One channel is silent
                // → Route both channels into the gain node
                // → Then merge them back into both left & right outputs
                splitterNode.connect(gainNode, 0);
                splitterNode.connect(gainNode, 1);
                gainNode.connect(mergerNode, 0, 0);
                gainNode.connect(mergerNode, 0, 1);
            } else {
                // 🎵 Case 2: Both channels active (true stereo)
                // → Bypass the gain node entirely
                // → Preserve original left/right separation
                splitterNode.connect(mergerNode, 0, 0);
                splitterNode.connect(mergerNode, 1, 1);
            }
 
            // Re-run this check every 1.5 seconds while video is playing
            if (!video.paused && !video.ended) {
                setTimeout(checkAudio, 1500);
            }
        };
 
        // Start the first check
        checkAudio();
    };
 
    /**
     * Watch the page for dynamically added <video> elements
     * (important because YouTube is a Single-Page App and replaces video elements often)
     */
    new MutationObserver(() => {
        document.querySelectorAll("video").forEach(setupVideo);
    }).observe(document.body, { childList: true, subtree: true });
 
    // Also process any videos that already exist on initial load
    document.querySelectorAll("video").forEach(setupVideo);
})();
