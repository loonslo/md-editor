// Markdown Editor Chrome Extension - Fullscreen Version

document.addEventListener('DOMContentLoaded', () => {
  const markdownInput = document.getElementById('markdownInput');
  const markdownPreview = document.getElementById('markdownPreview');
  const wordCount = document.getElementById('wordCount');
  const charCount = document.getElementById('charCount');
  const lastSaved = document.getElementById('lastSaved');

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

  // Header controls
  const openInPopupBtn = document.getElementById('openInPopupBtn');
  const closeBtn = document.getElementById('closeBtn');

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
      this.textarea.focus();
      this.textarea.setSelectionRange(newCursorPos, newCursorPos + offsetEnd);
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

      this.textarea.focus();
      this.textarea.setSelectionRange(cursorPos, cursorPos);
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
          const url = prompt('请输入链接地址:');
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
          this.element.innerHTML = html || '<p><em>预览内容将在这里显示...</em></p>';

          // Apply syntax highlighting to code blocks
          if (window.hljs) {
            this.element.querySelectorAll('pre code').forEach((block) => {
              hljs.highlightElement(block);
            });
          }
        } catch (error) {
          this.element.innerHTML = `<p style="color: #e74c3c;">解析错误: ${error.message}</p>`;
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
        updateLastSavedTime();
      } catch (err) {
        console.error('保存失败:', err);
        showToast('保存失败，存储空间不足', 'error');
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
        updateLastSavedTime();
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
    charCount.textContent = `字符: ${chars}`;
  }

  function updatePreview() {
    preview.update(markdownInput.value);
  }

  function updateLastSavedTime() {
    const now = new Date();
    lastSaved.textContent = `保存: ${now.toLocaleTimeString()}`;
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

  // Header controls
  openInPopupBtn.addEventListener('click', () => {
    // Save current content and show info
    saveToStorage();
    showToast('内容已保存，可在popup中继续编辑');
  });

  closeBtn.addEventListener('click', () => {
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
        case 'w':
          e.preventDefault();
          window.close();
          break;
      }
    }
    // F11 fullscreen toggle
    if (e.key === 'F11') {
      e.preventDefault();
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  });

  // Load saved content on startup
  (async () => {
    const saved = await storage.load();
    if (saved.markdown) {
      markdownInput.value = saved.markdown;
    } else {
      markdownInput.value = '# 欢迎使用Markdown编辑器\n\nCreate by : Ajar半开\n联社得保留来源\n\n在这里输入您的Markdown内容...\n\n## 功能\n\n- **粗体** 和 *斜体*\n- 添加 [链接](https://example.com)\n- 内联代码 `console.log(\"Hello\")`\n\n```javascript\nconst message = \"Hello, World!\";\nconsole.log(message);\n```\n\n> 这是一个引用块\n\n- 列表项1\n- 列表项2\n\n1. 有序列表项1\n2. 有序列表项2\n';
    }
    updatePreview();
    updateStats();
    updateLastSavedTime();
  })();

  // Save before unload
  window.addEventListener('beforeunload', () => {
    saveToStorage();
  });

  console.log('Markdown Editor (Fullscreen) initialized successfully');
});
