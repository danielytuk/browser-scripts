// ==UserScript==
// @name         YouTube Description Templates
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Manage & apply description templates on the video edit page with performance improvements
// @author       danielytuk
// @match        https://studio.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    let observer;

    // Function to check if we're on the video edit page
    function isOnVideoEditPage() {
        return window.location.pathname.includes('/video/') && window.location.pathname.includes('/edit');
    }

    // Load saved templates using GM_getValue
    function loadTemplates() {
        const templates = GM_getValue('youtubeTemplates', '{}');
        return JSON.parse(templates);
    }

    // Save templates using GM_setValue
    function saveTemplates(templates) {
        GM_setValue('youtubeTemplates', JSON.stringify(templates));
    }

    // Create and display the template management UI
    function createTemplateDropdown() {
        if (document.getElementById('template-container')) return; // Avoid duplicate UI creation

        const container = document.createElement('div');
        container.id = 'template-container';
        container.classList.add('template-container');

        const select = document.createElement('select');
        select.id = 'template-selector';
        select.classList.add('template-selector');

        const applyButton = document.createElement('button');
        applyButton.innerText = 'Apply Template';
        applyButton.classList.add('btn', 'apply-btn');

        const newTemplateButton = document.createElement('button');
        newTemplateButton.innerText = 'Add New Template';
        newTemplateButton.classList.add('btn', 'new-template-btn');

        const label = document.createElement('label');
        label.innerText = 'Select Template:';
        label.classList.add('template-label');

        const fragment = document.createDocumentFragment();
        fragment.appendChild(label);
        fragment.appendChild(select);
        fragment.appendChild(applyButton);
        fragment.appendChild(newTemplateButton);
        container.appendChild(fragment);

        // Insert UI into the YouTube Studio page
        const parentElement = document.querySelector('#video-metadata-editor > ytcp-video-metadata-editor-sidepanel');
        if (parentElement) parentElement.insertBefore(container, parentElement.firstChild);

        populateTemplates(select);

        // Event delegation for buttons
        container.addEventListener('click', function(event) {
            if (event.target === applyButton) applyTemplate();
            else if (event.target === newTemplateButton) showAddTemplateForm();
        });
    }

    // Populate dropdown with existing templates
    function populateTemplates(select) {
        const templates = loadTemplates();
        for (let templateName in templates) {
            const option = document.createElement('option');
            option.value = templateName;
            option.innerText = templateName;
            select.appendChild(option);
        }
    }

    // Apply the selected template to the description box
    function applyTemplate() {
        const selectedTemplate = document.getElementById('template-selector').value;
        const templates = loadTemplates();
        const template = templates[selectedTemplate];

        if (template) {
            const descBox = document.querySelector('#textbox[aria-label="Tell viewers about your video (type @ to mention a channel)"]');
            if (descBox) {
                descBox.innerText = template.description;
                descBox.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
    }

    // Show the form to add a new template
    function showAddTemplateForm() {
        if (document.getElementById('form-container')) return; // Avoid duplicate form creation
        document.getElementById('template-container').style.display = 'none';

        const formContainer = document.createElement('div');
        formContainer.id = 'form-container';
        formContainer.classList.add('template-container');

        const form = document.createElement('form');
        form.appendChild(createFormInput('Template Name:', 'new-template-name', 'text'));
        form.appendChild(createFormTextarea('Description:', 'new-template-description'));

        const saveButton = document.createElement('button');
        saveButton.type = 'button';
        saveButton.innerText = 'Save Template';
        saveButton.classList.add('btn', 'save-btn');

        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.innerText = 'Cancel';
        cancelButton.classList.add('btn', 'cancel-btn');

        form.appendChild(saveButton);
        form.appendChild(cancelButton);

        formContainer.appendChild(form);

        const parentElement = document.querySelector('#video-metadata-editor > ytcp-video-metadata-editor-sidepanel');
        if (parentElement) parentElement.insertBefore(formContainer, parentElement.firstChild);

        formContainer.addEventListener('click', function(event) {
            if (event.target === saveButton) saveNewTemplate();
            else if (event.target === cancelButton) hideAddTemplateForm();
        });
    }

    // Hide the form to add a new template
    function hideAddTemplateForm() {
        const formContainer = document.getElementById('form-container');
        if (formContainer) formContainer.remove();
        document.getElementById('template-container').style.display = 'block';
    }

    // Save a new template and update the UI dynamically
    function saveNewTemplate() {
        const name = document.getElementById('new-template-name').value.trim();
        const description = document.getElementById('new-template-description').value.trim();

        if (name && description) {
            const templates = loadTemplates();
            templates[name] = { description };
            saveTemplates(templates);

            // Update dropdown without reloading
            const select = document.getElementById('template-selector');
            const newOption = document.createElement('option');
            newOption.value = name;
            newOption.innerText = name;
            select.appendChild(newOption);

            hideAddTemplateForm();
            alert('Template saved successfully!');
        } else {
            alert('Please fill in all fields.');
        }
    }

    // Helper function to create a labeled input
    function createFormInput(labelText, id, type) {
        const container = document.createElement('div');
        container.classList.add('form-group');

        const label = document.createElement('label');
        label.innerText = labelText;
        label.classList.add('form-label');

        const input = document.createElement('input');
        input.id = id;
        input.type = type;
        input.classList.add('form-input');

        container.appendChild(label);
        container.appendChild(input);

        return container;
    }

    // Helper function to create a labeled textarea
    function createFormTextarea(labelText, id) {
        const container = document.createElement('div');
        container.classList.add('form-group');

        const label = document.createElement('label');
        label.innerText = labelText;
        label.classList.add('form-label');

        const textarea = document.createElement('textarea');
        textarea.id = id;
        textarea.classList.add('form-textarea');

        container.appendChild(label);
        container.appendChild(textarea);

        return container;
    }

    // Observe DOM changes and URL changes to handle navigation in the SPA
    const observeDOMChanges = () => {
        if (observer) return;

        observer = new MutationObserver(() => {
            if (isOnVideoEditPage() && !document.getElementById('template-container')) createTemplateDropdown();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    // Initialize and observe
    observeDOMChanges();
    window.addEventListener('popstate', observeDOMChanges);

    // Add some basic CSS for the new UI elements
    const style = document.createElement('style');
    style.innerHTML = `
        .template-container {
            background: #fff;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 16px;
            margin-bottom: 16px;
            font-family: 'Roboto', Arial, sans-serif;
        }
        .template-selector, .form-input, .form-textarea {
            width: 100%;
            padding: 8px;
            margin-bottom: 16px;
            font-size: 14px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        .btn {
            display: inline-block;
            padding: 8px 16px;
            font-size: 14px;
            color: #fff;
            background: #1a73e8;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            margin-right: 10px;
        }
        .cancel-btn {
            background: #ea4335;
        }
        .form-group {
            margin-bottom: 16px;
        }
        .form-label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            color: #333;
        }
    `;
    document.head.appendChild(style);
})();
