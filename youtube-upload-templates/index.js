// ==UserScript==
// @name         YouTube Description Templates
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Manage & apply description templates on the video edit page
// @author       danielytuk
// @match        https://studio.youtube.com/*/edit
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

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
        const container = createElement('div', { id: 'template-container', styles: containerStyles });
        const select = createElement('select', { id: 'template-selector', styles: selectStyles });
        const applyButton = createElement('button', { innerText: 'Apply Template', styles: buttonStyles, onClick: applyTemplate });
        const newTemplateButton = createElement('button', { innerText: 'Add New Template', styles: buttonStyles, onClick: showAddTemplateForm });

        // Populate dropdown with existing templates
        const templates = loadTemplates();
        for (let templateName in templates) {
            const option = createElement('option', { value: templateName, innerText: templateName });
            select.appendChild(option);
        }

        const label = createElement('label', { innerText: 'Select Template:', styles: labelStyles });

        container.appendChild(label);
        container.appendChild(select);
        container.appendChild(applyButton);
        container.appendChild(newTemplateButton);

        // Insert UI into the YouTube Studio page
        const parentElement = document.querySelector('#video-metadata-editor > ytcp-video-metadata-editor-sidepanel');
        if (parentElement) parentElement.insertBefore(container, parentElement.firstChild);
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
        document.getElementById('template-container').style.display = 'none';

        const formContainer = createElement('div', { id: 'form-container', styles: containerStyles });
        const form = createElement('form');
        form.appendChild(createFormInput('Template Name:', 'new-template-name', 'text'));
        form.appendChild(createFormTextarea('Description:', 'new-template-description'));
        form.appendChild(createElement('button', { type: 'button', innerText: 'Save Template', styles: buttonStyles, onClick: saveNewTemplate }));
        form.appendChild(createElement('button', { type: 'button', innerText: 'Cancel', styles: cancelButtonStyles, onClick: hideAddTemplateForm }));

        formContainer.appendChild(form);

        const parentElement = document.querySelector('#video-metadata-editor > ytcp-video-metadata-editor-sidepanel');
        if (parentElement) parentElement.insertBefore(formContainer, parentElement.firstChild);
    }

    // Hide the form to add a new template
    function hideAddTemplateForm() {
        document.getElementById('form-container').remove();
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
            const newOption = createElement('option', { value: name, innerText: name });
            select.appendChild(newOption);

            hideAddTemplateForm();
            alert('Template saved successfully!');
        } else {
            alert('Please fill in all fields.');
        }
    }

    // Helper function to create an element with optional styles and event handlers
    function createElement(tag, { id, innerText, styles, onClick, value, type } = {}) {
        const element = document.createElement(tag);
        if (id) element.id = id;
        if (innerText) element.innerText = innerText;
        if (styles) Object.assign(element.style, styles);
        if (onClick) element.addEventListener('click', onClick);
        if (value) element.value = value;
        if (type) element.type = type;
        return element;
    }

    // Helper function to create a labeled input
    function createFormInput(labelText, id, type) {
        const label = createElement('label', { innerText: labelText, styles: labelStyles });
        const input = createElement('input', { id, type, styles: inputStyles });
        const container = createElement('div');
        container.appendChild(label);
        container.appendChild(input);
        return container;
    }

    // Helper function to create a labeled textarea
    function createFormTextarea(labelText, id) {
        const label = createElement('label', { innerText: labelText, styles: labelStyles });
        const textarea = createElement('textarea', { id, styles: textareaStyles });
        const container = createElement('div');
        container.appendChild(label);
        container.appendChild(textarea);
        return container;
    }

    // Styles for various elements
    const containerStyles = {
        background: '#fff',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        padding: '16px',
        marginBottom: '16px',
        fontFamily: 'Roboto, Arial, sans-serif'
    };

    const selectStyles = {
        width: '100%',
        padding: '8px',
        marginBottom: '16px',
        fontSize: '14px',
        border: '1px solid #ccc',
        borderRadius: '4px'
    };

    const buttonStyles = {
        display: 'inline-block',
        padding: '8px 16px',
        fontSize: '14px',
        color: '#fff',
        background: '#1a73e8',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginRight: '10px'
    };

    const cancelButtonStyles = {
        ...buttonStyles,
        background: '#ea4335'
    };

    const labelStyles = {
        display: 'block',
        marginBottom: '8px',
        fontSize: '14px',
        color: '#333'
    };

    const inputStyles = {
        width: '100%',
        padding: '8px',
        marginBottom: '16px',
        fontSize: '14px',
        border: '1px solid #ccc',
        borderRadius: '4px'
    };

    const textareaStyles = {
        width: '100%',
        padding: '8px',
        marginBottom: '16px',
        fontSize: '14px',
        border: '1px solid #ccc',
        borderRadius: '4px'
    };

    // Observe DOM changes to create the template UI when the page loads
    const observer = new MutationObserver(() => {
        if (document.querySelector('#video-metadata-editor > ytcp-video-metadata-editor-sidepanel') && !document.getElementById('template-selector')) createTemplateDropdown();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
