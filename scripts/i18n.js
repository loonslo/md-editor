// Internationalization (i18n) System for Markdown Editor Extension
// 多语言支持系统

const I18N = {
  // Default language
  currentLang: 'en',

  // Language resource packs
  resources: {
    en: {
      // Extension info
      extensionName: 'Markdown Editor & Formatter',
      extensionDescription: 'A powerful Markdown editor with real-time preview, formatting, and quick copy features',

      // UI Elements
      markdownEditor: 'Markdown Editor',
      livePreview: 'Live Preview',
      wordCount: 'Words',
      charCount: 'Characters',
      format: 'Format',
      copyHTML: 'Copy HTML',
      copyMarkdown: 'Copy Markdown',
      clear: 'Clear',
      bold: 'Bold',
      italic: 'Italic',
      link: 'Link',
      code: 'Code',
      fullscreen: 'Fullscreen',

      // Editor tools
      editorTools: 'Editor Tools',
      previewTools: 'Preview Tools',

      // Placeholders
      inputPlaceholder: 'Enter your Markdown content here...',

      // Messages
      copiedToClipboard: 'Copied to clipboard',
      copyFailed: 'Copy failed, please check permissions',
      autoSaved: 'Auto saved',
      parseError: 'Parse error',
      saveFailed: 'Save failed, insufficient storage space',
      loadFailed: 'Load failed',
      clearFailed: 'Clear failed',
      confirmClear: 'Are you sure you want to clear all content? This action cannot be undone.',
      enterUrlPrompt: 'Please enter the URL:',

      // Welcome text
      welcomeTitle: 'Welcome to Markdown Editor',
      welcomeSubtitle: 'Create by: Ajar半开',
      welcomeSubtitleEn: 'Please keep the source when reprinting',
      welcomeDescription: 'Enter your Markdown content here...',
      featuresTitle: 'Features',
      featureBoldItalic: '**Bold** and *Italic*',
      featureLink: 'Add [links](https://example.com)',
      featureCode: 'Inline code `console.log("Hello")`',
      featureList: 'List item 1',
      featureList2: 'List item 2',
      featureOrderedList: 'Ordered list item 1',
      featureOrderedList2: 'Ordered list item 2',
      quote: 'This is a blockquote',

      // Action
      openNewTab: 'Markdown Editor - Click to open in new tab',

      // Menu
      viewInPopup: 'View in popup window',
      openInFullscreen: 'Open in fullscreen',

      // Export
      exportHTML: 'Export as HTML',
      exportMD: 'Export as Markdown',
      exportedHtml: 'HTML file exported',
      exportedMd: 'Markdown file exported',

      // Search
      search: 'Search',
      searchPlaceholder: 'Search...',
      replacePlaceholder: 'Replace...',
      replace: 'Replace',
      replaceAll: 'Replace All',
      replaceCount: '{count} replacements made',
      notFound: 'Not found',
      close: 'Close',

      // Theme
      theme: 'Toggle Theme',
      themeChanged: 'Theme changed',
      lightTheme: 'Light',
      darkTheme: 'Dark',
      previewTheme: 'Preview Theme',
      previewThemeChanged: 'Preview theme changed to: ',

      // Preview themes
      themeDefault: 'Default',
      themeGithub: 'GitHub',
      themeVuepress: 'VuePress',
      themeMinimal: 'Minimal',
      themeTechnical: 'Technical'
    },
    zh: {
      // Extension info
      extensionName: 'Markdown 编辑器 & 格式化工具',
      extensionDescription: '一个功能强大的Markdown编辑器，支持实时预览、格式化和快速复制',

      // UI Elements
      markdownEditor: 'Markdown 编辑器',
      livePreview: '实时预览',
      wordCount: '字数',
      charCount: '字符',
      format: '格式化',
      copyHTML: '复制HTML',
      copyMarkdown: '复制Markdown',
      clear: '清空',
      bold: '粗体',
      italic: '斜体',
      link: '链接',
      code: '代码',
      fullscreen: '全屏预览',

      // Editor tools
      editorTools: '编辑器工具',
      previewTools: '预览工具',

      // Placeholders
      inputPlaceholder: '在这里输入Markdown内容...',

      // Messages
      copiedToClipboard: '已复制到剪贴板',
      copyFailed: '复制失败，请检查权限设置',
      autoSaved: '已自动保存',
      parseError: '解析错误',
      saveFailed: '保存失败，存储空间不足',
      loadFailed: '加载失败',
      clearFailed: '清空失败',
      confirmClear: '确定要清空所有内容吗？此操作不可撤销。',
      enterUrlPrompt: '请输入链接地址:',

      // Welcome text
      welcomeTitle: '欢迎使用Markdown编辑器',
      welcomeSubtitle: 'Create by : Ajar半开',
      welcomeSubtitleEn: '此文转贴请保留来源',
      welcomeDescription: '在这里输入您的Markdown内容...',
      featuresTitle: '功能',
      featureBoldItalic: '**粗体** 和 *斜体*',
      featureLink: '添加 [链接](https://example.com)',
      featureCode: '内联代码 `console.log("Hello")`',
      featureList: '列表项1',
      featureList2: '列表项2',
      featureOrderedList: '有序列表项1',
      featureOrderedList2: '有序列表项2',
      quote: '这是一个引用块',

      // Action
      openNewTab: 'Markdown Editor - 点击在新标签页中打开',

      // Menu
      viewInPopup: '在弹出窗口中查看',
      openInFullscreen: '全屏打开',

      // Export
      exportHTML: '导出为HTML',
      exportMD: '导出为Markdown',
      exportedHtml: 'HTML文件已导出',
      exportedMd: 'Markdown文件已导出',

      // Search
      search: '搜索',
      searchPlaceholder: '搜索...',
      replacePlaceholder: '替换...',
      replace: '替换',
      replaceAll: '全部替换',
      replaceCount: '已完成 {count} 处替换',
      notFound: '未找到',
      close: '关闭',

      // Theme
      theme: '切换主题',
      themeChanged: '主题已更改',
      lightTheme: '浅色',
      darkTheme: '深色',
      previewTheme: '预览主题',
      previewThemeChanged: '预览主题已更改为：',

      // Preview themes
      themeDefault: '默认',
      themeGithub: 'GitHub风格',
      themeVuepress: 'VuePress风格',
      themeMinimal: '极简',
      themeTechnical: '技术文档'
    },
    ja: {
      // Extension info
      extensionName: 'Markdown エディター & フォーマッター',
      extensionDescription: 'リアルタイムプレビュー、フォーマット、クイックコピー機能を備えた強力なMarkdownエディター',

      // UI Elements
      markdownEditor: 'Markdown エディター',
      livePreview: 'ライブプレビュー',
      wordCount: '単語数',
      charCount: '文字数',
      format: 'フォーマット',
      copyHTML: 'HTMLをコピー',
      copyMarkdown: 'Markdownをコピー',
      clear: 'クリア',
      bold: '太字',
      italic: '斜体',
      link: 'リンク',
      code: 'コード',
      fullscreen: 'フルスクリーン',

      // Editor tools
      editorTools: 'エディターツール',
      previewTools: 'プレビューツール',

      // Placeholders
      inputPlaceholder: 'Markdown内容を入力してください...',

      // Messages
      copiedToClipboard: 'クリップボードにコピーされました',
      copyFailed: 'コピーに失敗しました。権限を確認してください',
      autoSaved: '自動保存されました',
      parseError: 'パースエラー',
      saveFailed: '保存に失敗しました。ストレージ容量が不足しています',
      loadFailed: '読み込みに失敗しました',
      clearFailed: 'クリアに失敗しました',
      confirmClear: 'すべてのコンテンツをクリアしますか？この操作は元に戻せません。',
      enterUrlPrompt: 'URLを入力してください:',

      // Welcome text
      welcomeTitle: 'Markdownエディターへようこそ',
      welcomeSubtitle: '作成者: Ajar半開',
      welcomeSubtitleEn: '再配布時には出典を明記してください',
      welcomeDescription: 'Markdown内容を入力してください...',
      featuresTitle: '機能',
      featureBoldItalic: '**太字** と *斜体*',
      featureLink: '[リンク](https://example.com) を追加',
      featureCode: 'インラインコード `console.log("Hello")`',
      featureList: 'リスト項目1',
      featureList2: 'リスト項目2',
      featureOrderedList: '番号付きリスト1',
      featureOrderedList2: '番号付きリスト2',
      quote: 'これはブロッククォートです',

      // Action
      openNewTab: 'Markdown エディター - クリックして新しいタブで開く',

      // Menu
      viewInPopup: 'ポップアップで表示',
      openInFullscreen: 'フルスクリーンで開く',

      // Export
      exportHTML: 'HTMLとしてエクスポート',
      exportMD: 'Markdownとしてエクスポート',
      exportedHtml: 'HTMLファイルをエクスポートしました',
      exportedMd: 'Markdownファイルをエクスポートしました',

      // Search
      search: '検索',
      searchPlaceholder: '検索...',
      replacePlaceholder: '置換...',
      replace: '置換',
      replaceAll: 'すべて置換',
      replaceCount: '{count}件置換しました',
      notFound: '見つかりません',
      close: '閉じる',

      // Theme
      theme: 'テーマ切り替え',
      themeChanged: 'テーマを変更しました',
      lightTheme: 'ライト',
      darkTheme: 'ダーク',
      previewTheme: 'プレビューテーマ',
      previewThemeChanged: 'プレビューテーマを変更しました：',

      // Preview themes
      themeDefault: 'デフォルト',
      themeGithub: 'GitHub',
      themeVuepress: 'VuePress',
      themeMinimal: 'ミニマル',
      themeTechnical: '技術文書'
    },
    es: {
      // Extension info
      extensionName: 'Editor y Formateador de Markdown',
      extensionDescription: 'Un potente editor de Markdown con vista previa en tiempo real, formato y funciones de copia rápida',

      // UI Elements
      markdownEditor: 'Editor Markdown',
      livePreview: 'Vista Previa en Vivo',
      wordCount: 'Palabras',
      charCount: 'Caracteres',
      format: 'Formatear',
      copyHTML: 'Copiar HTML',
      copyMarkdown: 'Copiar Markdown',
      clear: 'Limpiar',
      bold: 'Negrita',
      italic: 'Cursiva',
      link: 'Enlace',
      code: 'Código',
      fullscreen: 'Pantalla Completa',

      // Editor tools
      editorTools: 'Herramientas del Editor',
      previewTools: 'Herramientas de Vista Previa',

      // Placeholders
      inputPlaceholder: 'Ingresa tu contenido Markdown aquí...',

      // Messages
      copiedToClipboard: 'Copiado al portapapeles',
      copyFailed: 'Error al copiar, verifica los permisos',
      autoSaved: 'Guardado automáticamente',
      parseError: 'Error de análisis',
      saveFailed: 'Error al guardar, espacio de almacenamiento insuficiente',
      loadFailed: 'Error al cargar',
      clearFailed: 'Error al limpiar',
      confirmClear: '¿Estás seguro de que quieres limpiar todo el contenido? Esta acción no se puede deshacer.',
      enterUrlPrompt: 'Por favor ingresa la URL:',

      // Welcome text
      welcomeTitle: 'Bienvenido al Editor Markdown',
      welcomeSubtitle: 'Creado por: Ajar半开',
      welcomeSubtitleEn: 'Por favor mantén la fuente al reimprimir',
      welcomeDescription: 'Ingresa tu contenido Markdown aquí...',
      featuresTitle: 'Características',
      featureBoldItalic: '**Negrita** y *Cursiva*',
      featureLink: 'Agregar [enlaces](https://example.com)',
      featureCode: 'Código en línea `console.log("Hello")`',
      featureList: 'Elemento de lista 1',
      featureList2: 'Elemento de lista 2',
      featureOrderedList: 'Lista numerada 1',
      featureOrderedList2: 'Lista numerada 2',
      quote: 'Esto es una cita en bloque',

      // Action
      openNewTab: 'Editor Markdown - Clic para abrir en nueva pestaña',

      // Menu
      viewInPopup: 'Ver en ventana emergente',
      openInFullscreen: 'Abrir en pantalla completa',

      // Export
      exportHTML: 'Exportar como HTML',
      exportMD: 'Exportar como Markdown',
      exportedHtml: 'Archivo HTML exportado',
      exportedMd: 'Archivo Markdown exportado',

      // Search
      search: 'Buscar',
      searchPlaceholder: 'Buscar...',
      replacePlaceholder: 'Reemplazar...',
      replace: 'Reemplazar',
      replaceAll: 'Reemplazar todo',
      replaceCount: '{count} reemplazos realizados',
      notFound: 'No encontrado',
      close: 'Cerrar',

      // Theme
      theme: 'Cambiar tema',
      themeChanged: 'Tema cambiado',
      lightTheme: 'Claro',
      darkTheme: 'Oscuro',
      previewTheme: 'Tema de Vista Previa',
      previewThemeChanged: 'Tema de vista previa cambiado a: ',

      // Preview themes
      themeDefault: 'Predeterminado',
      themeGithub: 'GitHub',
      themeVuepress: 'VuePress',
      themeMinimal: 'Minimalista',
      themeTechnical: 'Documentación Técnica'
    }
  },

  // Initialize i18n system
  async init() {
    // Get saved language preference or detect from browser
    const savedLang = await this.getSavedLanguage();
    const browserLang = this.detectBrowserLanguage();
    this.currentLang = savedLang || browserLang || 'en';
  },

  // Detect browser language
  detectBrowserLanguage() {
    const lang = navigator.language || navigator.userLanguage;
    const shortLang = lang.split('-')[0];

    if (this.resources[lang]) {
      return lang;
    } else if (this.resources[shortLang]) {
      return shortLang;
    }
    return 'en';
  },

  // Get language key for an element
  getLanguageKey() {
    const fullLang = navigator.language || 'en-US';
    const shortLang = fullLang.split('-')[0];
    return this.resources[fullLang] ? fullLang : (this.resources[shortLang] ? shortLang : 'en');
  },

  // Get saved language from storage
  async getSavedLanguage() {
    try {
      const result = await chrome.storage.local.get(['language']);
      return result.language;
    } catch (err) {
      console.error('Failed to load language preference:', err);
      return null;
    }
  },

  // Save language preference
  async saveLanguage(lang) {
    try {
      await chrome.storage.local.set({ language: lang });
      this.currentLang = lang;
    } catch (err) {
      console.error('Failed to save language preference:', err);
    }
  },

  // Set language
  async setLanguage(lang) {
    if (this.resources[lang]) {
      await this.saveLanguage(lang);
      this.updateUITexts();
      return true;
    }
    return false;
  },

  // Get translated text
  t(key) {
    const lang = this.currentLang;
    const resources = this.resources[lang] || this.resources['en'];
    return resources[key] || this.resources['en'][key] || key;
  },

  // Update all UI texts
  updateUITexts() {
    // Update text content
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);
      element.textContent = translation;
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      const translation = this.t(key);
      element.placeholder = translation;
    });

    // Update titles/tooltips
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      const translation = this.t(key);
      element.title = translation;
    });

    // Update document title
    const titleKey = document.documentElement.getAttribute('data-i18n-title-key') || 'extensionName';
    document.title = this.t(titleKey);
  },

  // Format the welcome text with current language
  getWelcomeText() {
    const t = this.t.bind(this);
    return `# ${t('welcomeTitle')}\n\n \`${t('welcomeSubtitle')}\` \n${t('welcomeSubtitleEn')}\n\n${t('welcomeDescription')}\n\n## ${t('featuresTitle')}\n\n- ${t('featureBoldItalic')}\n- ${t('featureLink')}\n- ${t('featureCode')}\n\n\`\`\`javascript\nconst message = "Hello, World!";\nconsole.log(message);\n\`\`\`\n\n> ${t('quote')}\n\n- ${t('featureList')}\n- ${t('featureList2')}\n\n1. ${t('featureOrderedList')}\n2. ${t('featureOrderedList2')}\n`;
  }
};

// Make I18N available globally
window.I18N = I18N;
