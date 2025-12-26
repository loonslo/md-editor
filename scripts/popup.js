// Markdown Editor Chrome Extension - Main Script

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize i18n
  await I18N.init();
  I18N.updateUITexts();
  const markdownInput = document.getElementById('markdownInput');
  const markdownPreview = document.getElementById('markdownPreview');
  const wordCount = document.getElementById('wordCount');
  const charCount = document.getElementById('charCount');

  // Format buttons
  const formatBtn = document.getElementById('formatBtn');
  const copyHtmlBtn = document.getElementById('copyHtmlBtn');
  const copyMarkdownBtn = document.getElementById('copyMarkdownBtn');
  const clearBtn = document.getElementById('clearBtn');
  const exportHtmlBtn = document.getElementById('exportHtmlBtn');
  const exportMdBtn = document.getElementById('exportMdBtn');

  // Editor tools
  const boldBtn = document.getElementById('boldBtn');
  const italicBtn = document.getElementById('italicBtn');
  const linkBtn = document.getElementById('linkBtn');
  const codeBtn = document.getElementById('codeBtn');
  const searchBtn = document.getElementById('searchBtn');
  const themeBtn = document.getElementById('themeBtn');
  const previewThemeBtn = document.getElementById('previewThemeBtn');
  const themeDropdown = document.getElementById('themeDropdown');

  const fullscreenBtn = document.getElementById('fullscreenBtn');

  // Search panel elements
  const searchPanel = document.getElementById('searchPanel');
  const searchInput = document.getElementById('searchInput');
  const replaceInput = document.getElementById('replaceInput');
  const searchCloseBtn = document.getElementById('searchCloseBtn');
  const findNextBtn = document.getElementById('findNextBtn');
  const findPrevBtn = document.getElementById('findPrevBtn');
  const replaceBtn = document.getElementById('replaceBtn');
  const replaceAllBtn = document.getElementById('replaceAllBtn');

  // Editor Manager
  class EditorManager {
    constructor(textarea) {
      this.textarea = textarea;
    }

    insertText(text, offsetStart = 0, offsetEnd = 0) {
      const start = this.textarea.selectionStart;
      const end = this.textarea.selectionEnd;
      const selectedText = this.textarea.value.substring(start, end);

      const before = this.textarea.value.substring(0, start);
      const after = this.textarea.value.substring(end);

      const newText = selectedText || text;

      this.textarea.value = before + newText + after;

      const newCursorPos = start + newText.length + offsetStart;

      setTimeout(() => {
        this.textarea.focus();
        this.textarea.setSelectionRange(newCursorPos, newCursorPos + offsetEnd);
      }, 0);
    }

    wrapSelection(before, after = before) {
      // Save selection before button click changes focus
      const text = this.textarea.value;
      const start = this.textarea.selectionStart;
      const end = this.textarea.selectionEnd;
      const selectedText = text.substring(start, end);

      // Toggle logic for bold: find ** around cursor or selection
      if (before === '**' && after === '**') {
        // Check if selection is exactly **text**
        if (start < end && text.substring(start, end).match(/^\*\*(.+)\*\*$/s)) {
          const unwrapped = text.substring(start, end).replace(/^\*\*(.+)\*\*$/s, '$1');
          this.textarea.value = text.substring(0, start) + unwrapped + text.substring(end);
          setTimeout(() => {
            this.textarea.focus();
            this.textarea.setSelectionRange(start, start + unwrapped.length);
            updatePreview();
            updateStats();
          }, 0);
          return;
        }

        // Find ** before cursor and ** after cursor
        const textBefore = text.substring(0, start);
        const textAfter = text.substring(start);
        const openIndex = textBefore.lastIndexOf('**');
        const closeIndex = textAfter.indexOf('**');

        if (openIndex !== -1 && closeIndex !== -1) {
          // Remove both ** markers
          const beforePart = text.substring(0, openIndex);
          const middlePart = text.substring(openIndex + 2, start);
          const afterPart = text.substring(start + closeIndex + 2);
          this.textarea.value = beforePart + middlePart + afterPart;
          const newPos = beforePart.length + middlePart.length;
          setTimeout(() => {
            this.textarea.focus();
            this.textarea.setSelectionRange(newPos, newPos);
            updatePreview();
            updateStats();
          }, 0);
          return;
        }
      }

      // Toggle logic for italic: find * around cursor or selection
      if (before === '*' && after === '*') {
        // Check if selection is exactly *text* (but not **text**)
        if (start < end) {
          const sel = text.substring(start, end);
          if (/^\*(.+)\*$/.test(sel) && !sel.startsWith('**')) {
            const unwrapped = sel.replace(/^\*(.+)\*$/, '$1');
            this.textarea.value = text.substring(0, start) + unwrapped + text.substring(end);
            setTimeout(() => {
              this.textarea.focus();
              this.textarea.setSelectionRange(start, start + unwrapped.length);
              updatePreview();
              updateStats();
            }, 0);
            return;
          }
        }

        // Find * before cursor and * after cursor (avoiding **)
        const textBefore = text.substring(0, start);
        let openIndex = -1;
        for (let i = textBefore.length - 1; i >= 0; i--) {
          if (textBefore.substring(i).startsWith('**')) {
            i -= 1; // Skip **
            continue;
          }
          if (textBefore[i] === '*') {
            openIndex = i;
            break;
          }
        }

        let closeIndex = -1;
        for (let i = 0; i < textAfter.length; i++) {
          if (textAfter.substring(i).startsWith('**')) {
            i += 1; // Skip **
            continue;
          }
          if (textAfter[i] === '*') {
            closeIndex = i;
            break;
          }
        }

        if (openIndex !== -1 && closeIndex !== -1) {
          const beforePart = text.substring(0, openIndex);
          const middlePart = text.substring(openIndex + 1, start);
          const afterPart = text.substring(start + closeIndex + 1);
          this.textarea.value = beforePart + middlePart + afterPart;
          const newPos = beforePart.length + middlePart.length;
          setTimeout(() => {
            this.textarea.focus();
            this.textarea.setSelectionRange(newPos, newPos);
            updatePreview();
            updateStats();
          }, 0);
          return;
        }
      }

      // Add formatting
      const newText = before + selectedText + after;
      const cursorPos = start + before.length + selectedText.length;

      this.textarea.value =
        text.substring(0, start) +
        newText +
        text.substring(end);

      setTimeout(() => {
        this.textarea.focus();
        this.textarea.setSelectionRange(cursorPos, cursorPos);
        updatePreview();
        updateStats();
      }, 0);
    }

    applyFormatting(type, savedStart, savedEnd) {
      // Use saved selection if provided (from button click)
      const start = savedStart !== undefined ? savedStart : this.textarea.selectionStart;
      const end = savedEnd !== undefined ? savedEnd : this.textarea.selectionEnd;
      const text = this.textarea.value;
      const selectedText = text.substring(start, end);

      switch (type) {
        case 'bold':
          // Toggle bold: **text** <-> text
          if (/^\*\*(.+)\*\*$/.test(selectedText)) {
            // Remove **
            const unwrapped = selectedText.replace(/^\*\*(.+)\*\*$/, '$1');
            this.textarea.value = text.substring(0, start) + unwrapped + text.substring(end);
          } else {
            // Add **
            this.textarea.value = text.substring(0, start) + '**' + selectedText + '**' + text.substring(end);
          }
          setTimeout(() => {
            this.textarea.focus();
            if (selectedText) {
              this.textarea.setSelectionRange(start, start + (selectedText.startsWith('**') ? selectedText.length - 4 : selectedText.length + 4));
            } else {
              const newPos = text.substring(0, start).replace(/\*\*/g, '').length + 2;
              this.textarea.setSelectionRange(newPos, newPos);
            }
            updatePreview();
            updateStats();
          }, 0);
          break;
        case 'italic':
          // Toggle italic: *text* <-> text
          if (/^\*(.+)\*$/.test(selectedText) && !selectedText.startsWith('**')) {
            // Remove *
            const unwrapped = selectedText.replace(/^\*(.+)\*$/, '$1');
            this.textarea.value = text.substring(0, start) + unwrapped + text.substring(end);
          } else {
            // Add *
            this.textarea.value = text.substring(0, start) + '*' + selectedText + '*' + text.substring(end);
          }
          setTimeout(() => {
            this.textarea.focus();
            if (selectedText) {
              this.textarea.setSelectionRange(start, start + (selectedText.startsWith('*') ? selectedText.length - 2 : selectedText.length + 2));
            } else {
              const newPos = text.substring(0, start).replace(/\*\*/g, '').length + 1;
              this.textarea.setSelectionRange(newPos, newPos);
            }
            updatePreview();
            updateStats();
          }, 0);
          break;
        case 'code':
          this.wrapSelection('`', '`');
          break;
        case 'link':
          const url = prompt(I18N.t('enterUrlPrompt'));
          if (url) {
            const selectedText = this.textarea.value.substring(
              this.textarea.selectionStart,
              this.textarea.selectionEnd
            ) || url;
            this.insertText(`[${selectedText}](${url})`);
          }
          break;
        case 'codeblock':
          this.insertText('\n```\n\n```\n\n');
          break;
      }
      updatePreview();
      updateStats();
    }

    getLineAtCursor() {
      const cursorPos = this.textarea.selectionStart;
      const textUntilCursor = this.textarea.value.substring(0, cursorPos);
      const lineStart = textUntilCursor.lastIndexOf('\n') + 1;
      const lineEnd = this.textarea.value.indexOf('\n', cursorPos);
      const line = this.textarea.value.substring(
        lineStart,
        lineEnd === -1 ? this.textarea.value.length : lineEnd
      );
      return line;
    }

    addListItem(type = 'ul') {
      const line = this.getLineAtCursor();
      const marker = type === 'ol' ? '1. ' : '- ';
      const isListItem = line.startsWith('- ') || line.match(/^\d+\. /);

      if (isListItem) {
        this.insertText('\n' + marker);
      } else {
        this.insertText(marker);
      }
      updatePreview();
      updateStats();
    }

    formatMarkdown() {
      let text = this.textarea.value;

      // Format headers
      text = text.replace(/(^|\n)(#{4})([^\s#\n]+)/g, '$1$2 $3');
      text = text.replace(/(^|\n)(#{3})([^\s#\n]+)/g, '$1$2 $3');
      text = text.replace(/(^|\n)(#{2})([^\s#\n]+)/g, '$1$2 $3');
      text = text.replace(/(^|\n)(#{1})([^\s#\n]+)/g, '$1$2 $3');

      // Format bold
      text = text.replace(/\*\*([^*]+)\*\*/g, '**$1**');

      // Format italic
      text = text.replace(/(\s)\*([^*\n]+)\*/g, '$1* $2 *');

      // Format code blocks
      text = text.replace(/```(\w+)?\n?/g, (match) => {
        if (match.endsWith('\n')) return match;
        return match + '\n';
      });

      // Format lists
      text = text.replace(/^(\s*)-\s*([^\s-])/gm, '$1- $2');
      text = text.replace(/^(\s*)(\d+)([^\d\.])/gm, '$1$2. $3');

      // Format links
      text = text.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '[$1]($2)');

      this.textarea.value = text;
      updatePreview();
      updateStats();
    }

    clear() {
      if (confirm(I18N.t('confirmClear'))) {
        this.textarea.value = '';
        updatePreview();
        updateStats();
        saveToStorage();
      }
    }

    // Search functionality
    findText(searchText, backward = false) {
      const text = this.textarea.value;
      const startPos = backward ? this.textarea.selectionStart - 1 : this.textarea.selectionStart;
      const flags = backward ? 'g' : 'g';

      // Escape special regex characters
      const escapedSearch = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedSearch, flags);

      let match;
      let foundPos = -1;

      if (backward) {
        // Find all matches and get the last one before cursor
        const matches = [];
        while ((match = regex.exec(text)) !== null) {
          if (match.index < startPos) {
            matches.push(match.index);
          }
        }
        if (matches.length > 0) {
          foundPos = matches[matches.length - 1];
        }
      } else {
        regex.lastIndex = startPos;
        match = regex.exec(text);
        if (match) {
          foundPos = match.index;
        }
      }

      if (foundPos !== -1) {
        this.textarea.focus();
        this.textarea.setSelectionRange(foundPos, foundPos + searchText.length);
        return true;
      }
      return false;
    }

    replaceText(searchText, replaceText) {
      const start = this.textarea.selectionStart;
      const end = this.textarea.selectionEnd;
      const selectedText = this.textarea.value.substring(start, end);

      if (selectedText === searchText) {
        const before = this.textarea.value.substring(0, start);
        const after = this.textarea.value.substring(end);
        this.textarea.value = before + replaceText + after;
        this.textarea.setSelectionRange(start, start + replaceText.length);
        return true;
      }
      return false;
    }

    replaceAll(searchText, replaceText) {
      const text = this.textarea.value;
      const escapedSearch = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedSearch, 'g');
      this.textarea.value = text.replace(regex, replaceText);
      return (text.match(regex) || []).length;
    }
  }

  // Preview Manager with XSS protection
  class PreviewManager {
    constructor(element, textarea) {
      this.element = element;
      this.textarea = textarea;
      this.debounceTimer = null;
      this.isSyncingScroll = false;
    }

    // Simple HTML sanitizer for XSS protection
    sanitizeHtml(html) {
      // Replace potentially dangerous characters
      return html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    }

    update(markdown) {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }

      this.debounceTimer = setTimeout(() => {
        try {
          const html = marked.parse(markdown || '');
          // Sanitize the HTML if DOMPurify is available
          let safeHtml = html;
          if (typeof DOMPurify !== 'undefined') {
            safeHtml = DOMPurify.sanitize(html, {
              ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'span', 'div', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
              ALLOWED_ATTR: ['href', 'title', 'class', 'id', 'target', 'style']
            });
          }
          this.element.innerHTML = safeHtml || '<p><em>' + I18N.t('inputPlaceholder') + '</em></p>';

          // Apply syntax highlighting to code blocks
          if (window.hljs) {
            this.element.querySelectorAll('pre code').forEach((block) => {
              hljs.highlightElement(block);
            });
          }
        } catch (error) {
          this.element.innerHTML = '<p style="color: #e74c3c;">' + I18N.t('parseError') + ': ' + error.message + '</p>';
        }
      }, 100); // Reduced delay for faster response
    }

    initScrollSync() {
      this.textarea.addEventListener('scroll', () => {
        if (this.isSyncingScroll) return;

        const editorScrollPercentage = this.textarea.scrollTop / (this.textarea.scrollHeight - this.textarea.clientHeight);

        this.isSyncingScroll = true;
        this.element.scrollTop = editorScrollPercentage * (this.element.scrollHeight - this.element.clientHeight);
        this.isSyncingScroll = false;
      });
    }
  }

  // Copy Manager
  class CopyManager {
    async copyHTML() {
      const html = markdownPreview.innerHTML;
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([html], { type: 'text/html' }),
            'text/plain': new Blob([html], { type: 'text/plain' })
          })
        ]);
        showToast(I18N.t('copiedToClipboard'));
      } catch (err) {
        console.error('Copy failed:', err);
        showToast(I18N.t('copyFailed'), 'error');
      }
    }

    async copyMarkdown() {
      const markdown = markdownInput.value;
      try {
        await navigator.clipboard.writeText(markdown);
        showToast(I18N.t('copiedToClipboard'));
      } catch (err) {
        console.error('Copy failed:', err);
        showToast(I18N.t('copyFailed'), 'error');
      }
    }

    async copyRichText() {
      const html = markdownPreview.innerHTML;
      const markdown = markdownInput.value;

      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([html], { type: 'text/html' }),
            'text/markdown': new Blob([markdown], { type: 'text/markdown' }),
            'text/plain': new Blob([markdown], { type: 'text/plain' })
          })
        ]);
        showToast(I18N.t('copiedToClipboard'));
      } catch (err) {
        console.error('Copy failed:', err);
        showToast(I18N.t('copyFailed'), 'error');
      }
    }
  }

  // Export Manager
  class ExportManager {
    async exportToHtml() {
      const html = marked.parse(markdownInput.value);
      const fullHtml = `<!DOCTYPE html>
<html lang="${I18N.currentLang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Export</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
    pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
    code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; }
    blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 20px; color: #666; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
  </style>
</head>
<body>
${html}
</body>
</html>`;

      const blob = new Blob([fullHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'markdown-export.html';
      a.click();
      URL.revokeObjectURL(url);
      showToast(I18N.t('exportedHtml'));
    }

    async exportToMd() {
      const blob = new Blob([markdownInput.value], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'markdown-export.md';
      a.click();
      URL.revokeObjectURL(url);
      showToast(I18N.t('exportedMd'));
    }
  }

  // Theme Manager
  class ThemeManager {
    constructor() {
      this.themes = ['light', 'dark'];
      this.currentTheme = localStorage.getItem('markdown-editor-theme') || 'light';
      this.init();
    }

    init() {
      document.body.setAttribute('data-theme', this.currentTheme);
      this.updateButtonIcon();
    }

    toggle() {
      const currentIndex = this.themes.indexOf(this.currentTheme);
      this.currentTheme = this.themes[(currentIndex + 1) % this.themes.length];
      document.body.setAttribute('data-theme', this.currentTheme);
      localStorage.setItem('markdown-editor-theme', this.currentTheme);
      this.updateButtonIcon();
      showToast(I18N.t('themeChanged') + ': ' + I18N.t(this.currentTheme + 'Theme'));
    }

    updateButtonIcon() {
      if (themeBtn) {
        themeBtn.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
      }
    }
  }

  // Preview Theme Manager
  class PreviewThemeManager {
    constructor() {
      this.themes = ['default', 'github', 'vuepress', 'minimal', 'technical'];
      this.currentTheme = localStorage.getItem('markdown-editor-preview-theme') || 'default';
      this.previewElement = markdownPreview;
      this.init();
    }

    init() {
      this.applyTheme(this.currentTheme);
    }

    applyTheme(theme) {
      // Remove all theme classes
      this.themes.forEach(t => {
        this.previewElement.classList.remove('theme-' + t);
      });
      // Add new theme class
      this.previewElement.classList.add('theme-' + theme);
      this.currentTheme = theme;
      localStorage.setItem('markdown-editor-preview-theme', theme);
      this.updateActiveButton();
    }

    updateActiveButton() {
      if (themeDropdown) {
        themeDropdown.querySelectorAll('button').forEach(btn => {
          btn.classList.remove('active');
          if (btn.dataset.theme === this.currentTheme) {
            btn.classList.add('active');
          }
        });
      }
    }

    toggle() {
      if (themeDropdown) {
        themeDropdown.classList.toggle('show');
      }
    }

    hide() {
      if (themeDropdown) {
        themeDropdown.classList.remove('show');
      }
    }
  }

  // Storage Manager
  class StorageManager {
    async save(data) {
      try {
        await chrome.storage.local.set({
          markdownContent: data.markdown || '',
          preferences: data.preferences || {}
        });
      } catch (err) {
        console.error('Save failed:', err);
        showToast(I18N.t('saveFailed'), 'error');
      }
    }

    async load() {
      try {
        const result = await chrome.storage.local.get(['markdownContent', 'preferences']);
        return {
          markdown: result.markdownContent || '',
          preferences: result.preferences || {}
        };
      } catch (err) {
        console.error('Load failed:', err);
        return { markdown: '', preferences: {} };
      }
    }

    async clear() {
      try {
        await chrome.storage.local.remove(['markdownContent']);
      } catch (err) {
        console.error('Clear failed:', err);
      }
    }
  }

  // Initialize managers
  const editor = new EditorManager(markdownInput);
  const preview = new PreviewManager(markdownPreview, markdownInput);
  const copyManager = new CopyManager();
  const exportManager = new ExportManager();
  const themeManager = new ThemeManager();
  const previewThemeManager = new PreviewThemeManager();
  const storage = new StorageManager();

  // Initialize scroll sync
  preview.initScrollSync();

  // Utility Functions
  function updateStats() {
    const text = markdownInput.value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;

    wordCount.textContent = I18N.t('wordCount') + ': ' + words;
    charCount.textContent = I18N.t('charCount') + ': ' + chars;
  }

  function updatePreview() {
    preview.update(markdownInput.value);
  }

  function saveToStorage() {
    storage.save({
      markdown: markdownInput.value,
      preferences: {
        theme: themeManager.currentTheme,
        previewTheme: previewThemeManager.currentTheme
      }
    });
  }

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    if (type === 'error') {
      toast.style.background = '#e74c3c';
    }
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // Search panel functions
  function toggleSearchPanel() {
    if (searchPanel) {
      const isVisible = searchPanel.style.display !== 'none';
      searchPanel.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        searchInput.focus();
      }
    }
  }

  function closeSearchPanel() {
    if (searchPanel) {
      searchPanel.style.display = 'none';
      searchInput.value = '';
      replaceInput.value = '';
      // Clear search highlight
      markdownInput.value = markdownInput.value;
    }
  }

  // Event Listeners

  // Input event with debounced preview update
  markdownInput.addEventListener('input', () => {
    updatePreview();
    updateStats();
    saveToStorage();
  });

  // Format buttons
  formatBtn.addEventListener('click', () => {
    editor.formatMarkdown();
    saveToStorage();
  });

  copyHtmlBtn.addEventListener('click', () => {
    copyManager.copyHTML();
  });

  copyMarkdownBtn.addEventListener('click', () => {
    copyManager.copyMarkdown();
  });

  clearBtn.addEventListener('click', () => {
    editor.clear();
  });

  // Export buttons
  if (exportHtmlBtn) {
    exportHtmlBtn.addEventListener('click', () => {
      exportManager.exportToHtml();
      saveToStorage();
    });
  }

  if (exportMdBtn) {
    exportMdBtn.addEventListener('click', () => {
      exportManager.exportToMd();
      saveToStorage();
    });
  }

  // Editor tool buttons
  boldBtn.addEventListener('click', () => {
    const start = markdownInput.selectionStart;
    const end = markdownInput.selectionEnd;
    editor.applyFormatting('bold', start, end);
    saveToStorage();
  });

  italicBtn.addEventListener('click', () => {
    const start = markdownInput.selectionStart;
    const end = markdownInput.selectionEnd;
    editor.applyFormatting('italic', start, end);
    saveToStorage();
  });

  linkBtn.addEventListener('click', () => {
    editor.applyFormatting('link');
    saveToStorage();
  });

  codeBtn.addEventListener('click', () => {
    editor.applyFormatting('codeblock');
    saveToStorage();
  });

  // Search button
  if (searchBtn) {
    searchBtn.addEventListener('click', toggleSearchPanel);
  }

  // Search panel controls
  if (searchCloseBtn) {
    searchCloseBtn.addEventListener('click', closeSearchPanel);
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      editor.findText(searchInput.value);
    });
  }

  if (findNextBtn) {
    findNextBtn.addEventListener('click', () => {
      editor.findText(searchInput.value, false);
    });
  }

  if (findPrevBtn) {
    findPrevBtn.addEventListener('click', () => {
      editor.findText(searchInput.value, true);
    });
  }

  if (replaceBtn) {
    replaceBtn.addEventListener('click', () => {
      editor.replaceText(searchInput.value, replaceInput.value);
    });
  }

  if (replaceAllBtn) {
    replaceAllBtn.addEventListener('click', () => {
      const count = editor.replaceAll(searchInput.value, replaceInput.value);
      showToast(I18N.t('replacedCount').replace('{count}', count));
      updatePreview();
    });
  }

  // Theme button
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      themeManager.toggle();
      saveToStorage();
    });
  }

  // Preview Theme button
  if (previewThemeBtn) {
    previewThemeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      previewThemeManager.toggle();
    });
  }

  // Theme dropdown selection
  if (themeDropdown) {
    themeDropdown.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const theme = btn.dataset.theme;
        previewThemeManager.applyTheme(theme);
        showToast(I18N.t('previewThemeChanged') + I18N.t('theme' + theme.charAt(0).toUpperCase() + theme.slice(1)));
        saveToStorage();
        previewThemeManager.hide();
      });
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    previewThemeManager.hide();
  });

  // Fullscreen toggle
  fullscreenBtn.addEventListener('click', () => {
    saveToStorage();
    const fullscreenUrl = chrome.runtime.getURL('fullscreen.html');
    chrome.tabs.create({ url: fullscreenUrl });
    window.close();
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          editor.applyFormatting('bold');
          saveToStorage();
          break;
        case 'i':
          e.preventDefault();
          editor.applyFormatting('italic');
          saveToStorage();
          break;
        case 'k':
          e.preventDefault();
          editor.applyFormatting('link');
          saveToStorage();
          break;
        case 's':
          e.preventDefault();
          saveToStorage();
          showToast(I18N.t('autoSaved'));
          break;
        case 'f':
          e.preventDefault();
          toggleSearchPanel();
          break;
      }
    }
  });

  // Load saved content on startup
  (async () => {
    const saved = await storage.load();
    if (saved.markdown) {
      markdownInput.value = saved.markdown;
    } else {
      markdownInput.value = I18N.getWelcomeText();
    }

    // Apply saved preview theme from preferences
    if (saved.preferences && saved.preferences.previewTheme) {
      previewThemeManager.applyTheme(saved.preferences.previewTheme);
    }

    updatePreview();
    updateStats();
  })();

  // Save before unload
  window.addEventListener('beforeunload', () => {
    saveToStorage();
  });

  // Resizer for panel width adjustment
  class Resizer {
    constructor() {
      this.resizer = document.querySelector('.resizer');
      this.editorPanel = document.querySelector('.editor-panel');
      this.previewPanel = document.querySelector('.preview-panel');
      this.container = document.querySelector('.editor-container');

      if (!this.resizer || !this.editorPanel || !this.previewPanel || !this.container) {
        console.warn('Resizer elements not found');
        return;
      }

      this.init();
    }

    init() {
      this.isResizing = false;
      this.startX = 0;
      this.startEditorWidth = 0;
      this.startPreviewWidth = 0;

      this.resizer.addEventListener('mousedown', (e) => {
        this.isResizing = true;
        this.startX = e.clientX;
        this.startEditorWidth = this.editorPanel.offsetWidth;
        this.startPreviewWidth = this.previewPanel.offsetWidth;

        this.resizer.classList.add('dragging');
        document.body.classList.add('resizing');

        e.preventDefault();
        e.stopPropagation();
      });

      document.addEventListener('mousemove', (e) => {
        if (!this.isResizing) return;

        const deltaX = e.clientX - this.startX;
        const containerWidth = this.container.offsetWidth;
        const newEditorWidth = this.startEditorWidth + deltaX;
        const newPreviewWidth = this.startPreviewWidth - deltaX;

        const editorPercentage = (newEditorWidth / containerWidth) * 100;
        const previewPercentage = (newPreviewWidth / containerWidth) * 100;

        const minEditorPercent = 20;
        const minPreviewPercent = 20;

        if (editorPercentage >= minEditorPercent && previewPercentage >= minPreviewPercent) {
          this.editorPanel.style.setProperty('width', editorPercentage + '%', 'important');
          this.previewPanel.style.setProperty('width', previewPercentage + '%', 'important');
          this.editorPanel.style.setProperty('flex', 'none', 'important');
          this.previewPanel.style.setProperty('flex', 'none', 'important');
          this.editorPanel.style.setProperty('flex-grow', '0', 'important');
          this.previewPanel.style.setProperty('flex-grow', '0', 'important');
          this.editorPanel.style.setProperty('flex-shrink', '0', 'important');
          this.previewPanel.style.setProperty('flex-shrink', '0', 'important');
        }
      });

      document.addEventListener('mouseup', () => {
        if (this.isResizing) {
          this.isResizing = false;
          this.resizer.classList.remove('dragging');
          document.body.classList.remove('resizing');

          const editorWidth = this.editorPanel.offsetWidth;
          const containerWidth = this.container.offsetWidth;
          const ratio = (editorWidth / containerWidth * 100).toFixed(2);
          localStorage.setItem('markdown-editor-split-ratio', ratio);
        }
      });

      this.restoreSplitRatio();
    }

    restoreSplitRatio() {
      const savedRatio = localStorage.getItem('markdown-editor-split-ratio');
      if (savedRatio) {
        const ratio = parseFloat(savedRatio);
        const clampedRatio = Math.max(20, Math.min(80, ratio));
        this.editorPanel.style.setProperty('width', clampedRatio + '%', 'important');
        this.previewPanel.style.setProperty('width', (100 - clampedRatio) + '%', 'important');
        this.editorPanel.style.setProperty('flex', 'none', 'important');
        this.previewPanel.style.setProperty('flex', 'none', 'important');
        this.editorPanel.style.setProperty('flex-grow', '0', 'important');
        this.previewPanel.style.setProperty('flex-grow', '0', 'important');
        this.editorPanel.style.setProperty('flex-shrink', '0', 'important');
        this.previewPanel.style.setProperty('flex-shrink', '0', 'important');
      }
    }
  }

  new Resizer();

  console.log('Markdown Editor initialized successfully');
});
