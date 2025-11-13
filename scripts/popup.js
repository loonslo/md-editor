// Markdown Editor Chrome Extension - Main Script

// Initialize i18n
await I18N.init();
I18N.updateUITexts();

document.addEventListener('DOMContentLoaded', () => {
  const markdownInput = document.getElementById('markdownInput');
  const markdownPreview = document.getElementById('markdownPreview');
  const wordCount = document.getElementById('wordCount');
  const charCount = document.getElementById('charCount');

  // Format buttons
  const formatBtn = document.getElementById('formatBtn');
  const copyHtmlBtn = document.getElementById('copyHtmlBtn');
  const copyMarkdownBtn = document.getElementById('copyMarkdownBtn');
  const clearBtn = document.getElementById('clearBtn');

  // Editor tools
  const boldBtn = document.getElementById('boldBtn');
  const italicBtn = document.getElementById('italicBtn');
  const linkBtn = document.getElementById('linkBtn');
  const codeBtn = document.getElementById('codeBtn');

  const fullscreenBtn = document.getElementById('fullscreenBtn');

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

      // 确保DOM更新后再设置光标位置
      setTimeout(() => {
        this.textarea.focus();
        this.textarea.setSelectionRange(newCursorPos, newCursorPos + offsetEnd);
      }, 0);
    }

    wrapSelection(before, after = before) {
      const start = this.textarea.selectionStart;
      const end = this.textarea.selectionEnd;
      const selectedText = this.textarea.value.substring(start, end);

      const newText = before + selectedText + after;
      const cursorPos = start + before.length + selectedText.length;

      this.textarea.value =
        this.textarea.value.substring(0, start) +
        newText +
        this.textarea.value.substring(end);

      // 确保DOM更新后再设置光标位置
      setTimeout(() => {
        this.textarea.focus();
        this.textarea.setSelectionRange(cursorPos, cursorPos);
      }, 0);
    }

    applyFormatting(type) {
      switch (type) {
        case 'bold':
          this.wrapSelection('**', '**');
          break;
        case 'italic':
          this.wrapSelection('*', '*');
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

      // Format headers - only if # is immediately followed by non-space character
      // This prevents re-formatting already formatted headers
      text = text.replace(/(^|\n)(#{4})([^\s#\n]+)/g, '$1$2 $3');
      text = text.replace(/(^|\n)(#{3})([^\s#\n]+)/g, '$1$2 $3');
      text = text.replace(/(^|\n)(#{2})([^\s#\n]+)/g, '$1$2 $3');
      text = text.replace(/(^|\n)(#{1})([^\s#\n]+)/g, '$1$2 $3');

      // Format bold - only format if already has ** ** but with wrong spacing
      text = text.replace(/\*\*([^*]+)\*\*/g, '**$1**');

      // Format italic - only format if * is at start of word without space
      // Use negative lookahead to avoid matching **
      text = text.replace(/(\s)\*([^*\n]+)\*/g, '$1* $2 *');

      // Format code blocks - only if opening ``` doesn't have newline
      text = text.replace(/```(\w+)?\n?/g, (match) => {
        if (match.endsWith('\n')) return match;
        return match + '\n';
      });

      // Format lists - only if list marker doesn't have space after it
      text = text.replace(/^(\s*)-\s*([^\s-])/gm, '$1- $2');
      text = text.replace(/^(\s*)(\d+)([^\d\.])/gm, '$1$2. $3');

      // Format links - just ensure proper spacing
      text = text.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '[$1]($2)');

      this.textarea.value = text;
      updatePreview();
      updateStats();
    }

    clear() {
      if (confirm('确定要清空所有内容吗？此操作不可撤销。')) {
        this.textarea.value = '';
        updatePreview();
        updateStats();
        saveToStorage();
      }
    }
  }

  // Preview Manager
  class PreviewManager {
    constructor(element, textarea) {
      this.element = element;
      this.textarea = textarea;
      this.debounceTimer = null;
      this.isSyncingScroll = false;
    }

    update(markdown) {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }

      this.debounceTimer = setTimeout(() => {
        try {
          const html = marked.parse(markdown);
          this.element.innerHTML = html || '<p><em><em>${I18N.t('''inputPlaceholder''')}</em></em></p>';

          // Apply syntax highlighting to code blocks
          if (window.hljs) {
            this.element.querySelectorAll('pre code').forEach((block) => {
              hljs.highlightElement(block);
            });
          }
        } catch (error) {
          this.element.innerHTML = `<p style="color: #e74c3c;">${I18N.t('''parseError''')}: ${error.message}</p>`;
        }
      }, 300);
    }

    initScrollSync() {
      // Sync preview scroll to editor scroll
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
        showToast('HTML已复制到剪贴板');
      } catch (err) {
        console.error('复制失败:', err);
        showToast('复制失败，请检查权限设置', 'error');
      }
    }

    async copyMarkdown() {
      const markdown = markdownInput.value;
      try {
        await navigator.clipboard.writeText(markdown);
        showToast('Markdown已复制到剪贴板');
      } catch (err) {
        console.error('复制失败:', err);
        showToast('复制失败，请检查权限设置', 'error');
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
        showToast('富文本已复制到剪贴板');
      } catch (err) {
        console.error('复制失败:', err);
        showToast('复制失败，请检查权限设置', 'error');
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
        console.error('保存失败:', err);
        showToast('I18N.t('''saveFailed''')', 'error');
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
        console.error('加载失败:', err);
        return { markdown: '', preferences: {} };
      }
    }

    async clear() {
      try {
        await chrome.storage.local.remove(['markdownContent']);
      } catch (err) {
        console.error('清空失败:', err);
      }
    }
  }

  // Initialize managers
  const editor = new EditorManager(markdownInput);
  const preview = new PreviewManager(markdownPreview, markdownInput);
  const copyManager = new CopyManager();
  const storage = new StorageManager();

  // Initialize scroll sync
  preview.initScrollSync();

  // Utility Functions
  function updateStats() {
    const text = markdownInput.value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;

    wordCount.textContent = `字数: ${words}`;
    charCount.textContent = `${chars} <span data-i18n="charCount">${I18N.t('''charCount''')}</span>`;
  }

  function updatePreview() {
    preview.update(markdownInput.value);
  }

  function saveToStorage() {
    storage.save({
      markdown: markdownInput.value,
      preferences: {}
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

  // Editor tool buttons
  boldBtn.addEventListener('click', () => {
    editor.applyFormatting('bold');
    saveToStorage();
  });

  italicBtn.addEventListener('click', () => {
    editor.applyFormatting('italic');
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

  // Fullscreen toggle - Open in new tab
  fullscreenBtn.addEventListener('click', () => {
    // Save current content first
    saveToStorage();

    // Open fullscreen version in new tab
    const fullscreenUrl = chrome.runtime.getURL('fullscreen.html');
    chrome.tabs.create({ url: fullscreenUrl });

    // Close popup
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
          showToast('已自动保存');
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
      markdownInput.value = '# 欢迎使用Markdown编辑器\n\n \`Create by : Ajar半开\` \n转载请保留来源\n\n在这里输入您的Markdown内容...\n\n## 功能\n\n- **粗体** 和 *斜体*\n- 添加 [链接](https://example.com)\n- 内联代码 `console.log(\"Hello\")`\n\n```javascript\nconst message = \"Hello, World!\";\nconsole.log(message);\n```\n\n> 这是一个引用块\n\n- 列表项1\n- 列表项2\n\n1. 有序列表项1\n2. 有序列表项2\n';
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

        // Calculate percentages
        const editorPercentage = (newEditorWidth / containerWidth) * 100;
        const previewPercentage = (newPreviewWidth / containerWidth) * 100;

        // Apply minimum width constraints (20% and 30% minimum)
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

          // Save the current split ratio
          const editorWidth = this.editorPanel.offsetWidth;
          const containerWidth = this.container.offsetWidth;
          const ratio = (editorWidth / containerWidth * 100).toFixed(2);
          localStorage.setItem('markdown-editor-split-ratio', ratio);
        }
      });

      // Restore saved split ratio on load
      this.restoreSplitRatio();
    }

    restoreSplitRatio() {
      const savedRatio = localStorage.getItem('markdown-editor-split-ratio');
      if (savedRatio) {
        const ratio = parseFloat(savedRatio);
        const clampedRatio = Math.max(20, Math.min(80, ratio)); // Clamp between 20% and 80%
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

  // Initialize resizer
  new Resizer();

  console.log('Markdown Editor initialized successfully');
});
