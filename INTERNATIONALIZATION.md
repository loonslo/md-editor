# Markdown Editor - 国际化 (i18n) 支持

## 概述

本文档描述了 Markdown Editor Chrome 扩展的国际化（i18n）实现。本扩展现在支持多种语言，为全球用户提供本地化体验。

## 支持的语言

- **English (en)** - 默认语言
- **中文 (zh)** - 简体中文
- **日本語 (ja)** - 日语
- **Español (es)** - 西班牙语

## 技术实现

### 1. 架构组件

#### i18n 系统 (`scripts/i18n.js`)
- 核心国际化管理系统
- 支持动态语言切换
- 浏览器语言自动检测
- 本地存储语言偏好

#### 语言资源包
每个语言都有对应的资源包，包含所有UI文本和消息的翻译：

```javascript
I18N.resources = {
  en: { /* 英文资源 */ },
  zh: { /* 中文资源 */ },
  ja: { /* 日文资源 */ },
  es: { /* 西班牙语资源 */ }
}
```

#### Chrome 扩展本地化 (`_locales/`)
- `messages.json` 文件用于扩展名称、描述等元数据的本地化
- 支持 Chrome 扩展商店的本地化展示

### 2. 使用方式

#### HTML 中的使用
使用 `data-i18n` 属性标记需要翻译的元素：

```html
<!-- 文本内容 -->
<h1 data-i18n="markdownEditor">Markdown Editor</h1>

<!-- 占位符 -->
<textarea data-i18n-placeholder="inputPlaceholder"></textarea>

<!-- 工具提示 -->
<button data-i18n-title="bold">B</button>

<!-- 页面标题 -->
<title data-i18n-title-key="extensionName">Markdown Editor</title>
```

#### JavaScript 中的使用
```javascript
// 获取翻译文本
const message = I18N.t('welcomeTitle');

// 获取欢迎文本（多语言）
const welcomeText = I18N.getWelcomeText();

// 切换语言
await I18N.setLanguage('zh');
```

### 3. 语言检测优先级

1. **用户保存的语言偏好** - 最高优先级
2. **浏览器语言设置** - 次优先级
3. **默认语言 (英文)** - 兜底

## 添加新语言

### 步骤 1: 在 i18n.js 中添加资源

编辑 `scripts/i18n.js`，在 `I18N.resources` 中添加新语言：

```javascript
resources: {
  'your-lang-code': {
    extensionName: 'Your Extension Name',
    extensionDescription: 'Your description...',
    // ... 添加所有翻译键值对
  }
}
```

### 步骤 2: 创建 _locales 目录

在 `_locales/your-lang-code/messages.json` 中创建 Chrome 扩展本地化文件：

```json
{
  "extensionName": {
    "message": "Your Extension Name"
  },
  "extensionDescription": {
    "message": "Your description..."
  }
}
```

### 步骤 3: 更新 manifest.json

在 `supported_languages` 中添加新语言（如果需要）

### 步骤 4: 测试

1. 切换到新语言测试
2. 验证所有 UI 元素正确显示
3. 确认存储的语言偏好工作正常

## 维护指南

### 添加新文本

1. **在 HTML 中添加**：使用 `data-i18n` 属性
2. **在 JavaScript 中添加**：使用 `I18N.t('key')`
3. **在 i18n.js 中添加翻译**：在所有语言包中添加对应键值

### 修改现有翻译

直接在 `scripts/i18n.js` 的对应语言资源包中修改文本。

### 删除文本

1. 从 HTML/JavaScript 中移除 i18n 标记
2. 从所有语言包中删除对应键值

## 文件结构

```
md-editor/
├── scripts/
│   ├── i18n.js                    # 核心 i18n 系统
│   ├── popup.js                   # 主界面逻辑（已支持 i18n）
│   └── fullscreen.js              # 全屏模式逻辑（已支持 i18n）
├── _locales/
│   ├── en/
│   │   └── messages.json          # 英文扩展元数据
│   ├── zh_CN/
│   │   └── messages.json          # 中文扩展元数据
│   ├── ja/
│   │   └── messages.json          # 日文扩展元数据
│   └── es/
│       └── messages.json          # 西班牙语扩展元数据
├── popup.html                     # 主界面（已支持 i18n）
├── fullscreen.html                # 全屏界面（已支持 i18n）
├── manifest.json                  # 扩展配置（已支持多语言）
└── INTERNATIONALIZATION.md        # 本文档
```

## 最佳实践

### 1. 键命名规范

- 使用小写字母和下划线：`extensionName`, `wordCount`
- 语义化命名：`copyMarkdown` 而不是 `copyBtn`
- 避免缩写：`markdownEditor` 而不是 `mdEditor`

### 2. 翻译质量

- 保持简洁、清晰
- 考虑文化差异
- 使用专业的翻译服务
- 提供上下文信息

### 3. 测试

- 测试所有支持的语言
- 验证文字截断和布局
- 确认日期、数字格式正确
- 测试从右到左（RTL）语言（如适用）

### 4. 性能

- 翻译资源在页面加载时缓存
- 避免频繁的语言切换
- 使用防抖优化 UI 更新

## 故障排除

### 语言不切换

1. 检查 `chrome.storage.local` 中的 `language` 键
2. 确认 I18N.init() 在 DOM 加载后调用
3. 验证翻译键存在于资源包中

### 文本未翻译

1. 检查 HTML 中的 `data-i18n` 属性
2. 确认 I18N.updateUITexts() 被调用
3. 验证翻译键的正确性

### 欢迎文本未本地化

检查 `I18N.getWelcomeText()` 返回的内容是否使用当前语言。

## 更新日志

### v1.1.5 (2024-11-07)
- ✨ 添加完整国际化（i18n）支持
- 🌐 支持 4 种语言：英文、中文、日语、西班牙语
- 🔄 实现自动语言检测
- 💾 持久化语言偏好设置
- 📝 更新所有 UI 元素支持多语言
- 🔧 创建完整的 i18n 架构系统

## 贡献

欢迎提交新的语言翻译！请确保：

1. 翻译准确、专业
2. 测试所有功能
3. 遵循命名规范
4. 提供上下文信息

## 许可证

MIT License
