// ==UserScript==
// @name         UploadTemplates
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  UploadTemplates let you save and switch between different templates - helping you quickly match each video's metadata to its content.
// @author       danielytuk
// @match        https://studio.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    let observer;
    const THEMES = ['auto', 'light', 'dark'];
    let currentTheme = GM_getValue('themePreference', 'auto');

    function isOnVideoEditPage() {
        return window.location.pathname.includes('/video/') && window.location.pathname.includes('/edit');
    }

    function loadTemplates() {
        const templates = GM_getValue('youtubeTemplates', '{}');
        return JSON.parse(templates);
    }

    function saveTemplates(templates) {
        GM_setValue('youtubeTemplates', JSON.stringify(templates));
    }

    function applyTheme(theme) {
        const root = document.documentElement;
        root.classList.remove('theme-light', 'theme-dark', 'theme-auto');

        if (theme === 'auto') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.classList.add(systemPrefersDark ? 'theme-dark' : 'theme-light');
        } else {
            root.classList.add(`theme-${theme}`);
        }
    }

    function toggleTheme(button) {
        const nextIndex = (THEMES.indexOf(currentTheme) + 1) % THEMES.length;
        currentTheme = THEMES[nextIndex];
        GM_setValue('themePreference', currentTheme);
        applyTheme(currentTheme);
        updateThemeButton(button);
    }

    function updateThemeButton(button) {
        const icons = {
            auto: '🌓',
            light: '☀️',
            dark: '🌙'
        };
        button.textContent = icons[currentTheme] + ' Theme';
        button.title = `Current: ${currentTheme.toUpperCase()}. Click to change.`;
    }

    function createTemplateDropdown() {
        if (document.getElementById('template-container')) return;

        const container = document.createElement('div');
        container.id = 'template-container';
        container.classList.add('template-container');

        const themeButton = document.createElement('button');
        themeButton.id = 'theme-toggle-btn';
        themeButton.classList.add('theme-toggle-btn');
        updateThemeButton(themeButton);
        themeButton.addEventListener('click', () => toggleTheme(themeButton));
        container.appendChild(themeButton);

        const label = document.createElement('label');
        label.innerText = 'Template';
        label.classList.add('template-label');

        const select = document.createElement('select');
        select.id = 'template-selector';
        select.classList.add('template-selector');

        const defaultOption = document.createElement('option');
        defaultOption.disabled = true;
        defaultOption.selected = true;
        defaultOption.innerText = 'Select a template';
        select.appendChild(defaultOption);

        const buttonWrapper = document.createElement('div');
        buttonWrapper.style.display = 'flex';

        const applyButton = document.createElement('button');
        applyButton.innerText = 'Apply';
        applyButton.classList.add('btn', 'apply-btn');

        const newTemplateButton = document.createElement('button');
        newTemplateButton.innerText = 'New template';
        newTemplateButton.classList.add('btn', 'new-template-btn');

        buttonWrapper.appendChild(applyButton);
        buttonWrapper.appendChild(newTemplateButton);

        container.appendChild(label);
        container.appendChild(select);
        container.appendChild(buttonWrapper);

        const parentElement = document.querySelector('#video-metadata-editor > ytcp-video-metadata-editor-sidepanel');
        if (parentElement) parentElement.insertBefore(container, parentElement.firstChild);

        populateTemplates(select);

        container.addEventListener('click', function(event) {
            if (event.target === applyButton) applyTemplate();
            else if (event.target === newTemplateButton) showAddTemplateForm();
        });
    }

    function populateTemplates(select) {
        const templates = loadTemplates();
        for (let templateName in templates) {
            const option = document.createElement('option');
            option.value = templateName;
            option.innerText = templateName;
            select.appendChild(option);
        }
    }

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

    function showAddTemplateForm() {
        if (document.getElementById('form-container')) return;
        document.getElementById('template-container').style.display = 'none';

        const formContainer = document.createElement('div');
        formContainer.id = 'form-container';
        formContainer.classList.add('template-container');
        formContainer.style.marginTop = '24px';

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

    function hideAddTemplateForm() {
        const formContainer = document.getElementById('form-container');
        if (formContainer) formContainer.remove();
        document.getElementById('template-container').style.display = 'block';
    }

    function saveNewTemplate() {
        const name = document.getElementById('new-template-name').value.trim();
        const description = document.getElementById('new-template-description').value.trim();

        if (name && description) {
            const templates = loadTemplates();
            templates[name] = { description };
            saveTemplates(templates);

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

    const observeDOMChanges = () => {
        if (observer) return;

        observer = new MutationObserver(() => {
            if (isOnVideoEditPage() && !document.getElementById('template-container')) {
                createTemplateDropdown();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    observeDOMChanges();
    window.addEventListener('popstate', observeDOMChanges);

    const style = document.createElement('style');
    style.innerHTML = `
        .template-container {
            position: relative;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 16px;
        }

        .theme-toggle-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: transparent;
            border: none;
            cursor: pointer;
            font-size: 16px;
            padding: 2px 6px;
            color: inherit;
        }

        .template-selector, .form-input, .form-textarea {
            width: 100%;
            padding: 10px 16px;
            margin-bottom: 16px;
            font-size: 14px;
            border-radius: 8px;
            border: 1px solid;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 10px 16px;
            font-size: 14px;
            font-weight: 500;
            border: none;
            border-radius: 18px;
            cursor: pointer;
            height: 36px;
            margin-right: 8px;
        }

        .cancel-btn {
            background: transparent;
            border: 1px solid;
        }

        .form-group {
            margin-bottom: 16px;
        }

        .form-label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
        }

        .template-label {
            display: block;
            margin-bottom: 8px;
            font-size: 16px;
            font-weight: 500;
        }

        /* Light Theme */
        .theme-light .template-container {
            background: #ffffff;
        }
        .theme-light .template-selector,
        .theme-light .form-input,
        .theme-light .form-textarea {
            background: #f9f9f9;
            border-color: #ccc;
            color: #111;
        }
        .theme-light .btn {
            color: #fff;
            background: #3ea6ff;
        }
        .theme-light .btn:hover {
            background: #65b5ff;
        }
        .theme-light .cancel-btn {
            color: #3ea6ff;
            border-color: #3ea6ff;
        }
        .theme-light .cancel-btn:hover {
            background: rgba(62, 166, 255, 0.1);
        }
        .theme-light .form-label {
            color: #555;
        }

        /* Dark Theme */
        .theme-dark .template-container {
            background: #212121;
        }
        .theme-dark .template-selector,
        .theme-dark .form-input,
        .theme-dark .form-textarea {
            background: #121212;
            border-color: #303030;
            color: #f1f1f1;
        }
        .theme-dark .btn {
            color: #fff;
            background: #3ea6ff;
        }
        .theme-dark .btn:hover {
            background: #65b5ff;
        }
        .theme-dark .cancel-btn {
            color: #3ea6ff;
            border-color: #3ea6ff;
        }
        .theme-dark .cancel-btn:hover {
            background: rgba(62, 166, 255, 0.1);
        }
        .theme-dark .form-label {
            color: #aaa;
        }
    `;
    document.head.appendChild(style);

    applyTheme(currentTheme);
})();
