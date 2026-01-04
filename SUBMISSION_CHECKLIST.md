# Chrome Web Store Submission Checklist

## Pre-Submission Checklist

### 1. Extension Files
- [x] `manifest.json` - Valid Manifest V3 format
- [x] `background.js` - Service worker properly configured
- [x] Icons: 16x16, 48x48, 128x128 PNG files
- [x] `popup.html` - Main UI (if applicable)
- [x] `fullscreen.html` - Fullscreen editor mode

### 2. Permissions (Review Completed)
- [x] `storage` - Local data storage only
- [x] `clipboardWrite` - Copy functionality only
- [x] Removed `tabs` permission (was unused)

### 3. Security Requirements
- [x] No remote code execution
- [x] No inline scripts in HTML
- [x] CSP properly configured
- [x] All libraries bundled locally

### 4. Privacy Compliance
- [x] `PRIVACY_POLICY.md` created
- [ ] Privacy policy deployed to URL
- [ ] Privacy policy URL ready for dashboard

### 5. Localization
- [x] English (default)
- [x] Chinese (zh_CN)
- [x] Japanese (ja)
- [x] Spanish (es)

---

## Store Listing Requirements

### Required Fields
| Field | English | Chinese |
|-------|---------|---------|
| Title | Markdown Editor - Live Preview & Format | Markdown 编辑器 - 实时预览与格式化 |
| Short Description | Edit Markdown with real-time preview, formatting tools, and quick copy. Auto-save locally, dark theme, fullscreen mode. | 编辑 Markdown，实时预览，格式化工具，快速复制。本地自动保存，深色主题，全屏模式。 |
| Full Description | See below | See below |

### Full Description (English)

```
Markdown Editor - Live Preview & Format

A powerful Markdown editor for Chrome with real-time preview, formatting tools, and quick copy features.

Features:
• Real-time Markdown preview - See your changes instantly as you type
• Live formatting tools - Bold, italic, links, code blocks, and more
• Quick copy - Copy as HTML or Markdown with one click
• Auto-save - Your work is saved locally automatically
• Dark theme - Easy on the eyes for long editing sessions
• Fullscreen mode - Edit in a dedicated tab with more space
• Word count - Track your progress
• Syntax highlighting - Beautiful code block rendering
• Local storage only - No data transmitted to servers

Privacy First:
This extension stores all data locally on your device. No personal information is collected or transmitted. Your content stays private.

Get started:
1. Click the extension icon to open the editor
2. Start typing Markdown on the left
3. See the live preview on the right
4. Use toolbar buttons to format your text
5. Click copy buttons to export your content

Perfect for:
• Writing documentation
• Taking notes
• Creating blog posts
• Technical writing
• Any Markdown editing needs
```

### Detailed Description (Chinese)

```
Markdown 编辑器 - 实时预览与格式化

一款功能强大的 Chrome Markdown 编辑器，支持实时预览、格式化工具和快速复制功能。

功能特点：
• 实时预览 - 输入即时显示渲染效果
• 格式化工具 - 粗体、斜体、链接、代码块等
• 快速复制 - 一键复制为 HTML 或 Markdown
• 自动保存 - 内容自动本地保存
• 深色主题 - 长时间编辑更舒适
• 全屏模式 - 专用标签页编辑，更大空间
• 字数统计 - 实时统计字数
• 代码高亮 - 代码块语法高亮显示
• 本地存储 - 数据不上传服务器

隐私保护：
本扩展所有数据仅存储在本地设备，不收集或传输任何个人信息。

使用说明：
1. 点击扩展图标打开编辑器
2. 在左侧输入 Markdown
3. 右侧实时查看预览效果
4. 使用工具栏格式化文本
5. 点击复制按钮导出内容

适用场景：
• 编写文档
• 记录笔记
• 创建博客
• 技术写作
• 各种 Markdown 编辑需求
```

---

## Screenshots Requirements

### Required Dimensions
| Type | Width | Height | Purpose |
|------|-------|--------|---------|
| Small tile | 640 | 400 | Shown in store listing |
| Large tile | 1280 | 800 | Shown when expanded |

### Recommended Screenshots
1. **Main Editor** (1280x800) - Full editor with sample content
2. **Feature Highlight** - Show formatting toolbar
3. **Dark Theme** - Show dark mode option
4. **Mobile View** - 640x400 version for store tile

### How to Create Screenshots
1. Open `screenshot-generator.html` in browser
2. Or load extension and open fullscreen mode
3. Use browser's screenshot tool (Snipping Tool on Windows)
4. Save as PNG format
5. Upload to Chrome Developer Dashboard

---

## Developer Dashboard Steps

### 1. Package Your Extension
```bash
# Create a zip file containing:
zip -r md-editor.zip manifest.json background.js \
  popup.html fullscreen.html icons/ lib/ scripts/ styles/ \
  _locales/ styles/popup.css styles/fullscreen.css \
  styles/drag-resize.css
```

### 2. Upload to Chrome Web Store
1. Go to [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Click "Add New Item"
3. Upload your zip file
4. Fill in store listing details

### 3. Store Listing Configuration
- **Category**: Productivity > Tools
- **Language**: English (default)
- **Visibility**: Public or Unlisted

### 4. Pricing & Distribution
- Set as "Free"
- Select all regions (or your target regions)
- Accept terms of service

### 5. Submit for Review
- Click "Publish Changes"
- Wait for review (typically 1-7 days)

---

## Common Rejection Reasons & Solutions

| Rejection Reason | Solution |
|-----------------|----------|
| "Unwanted software" | Clearly describe functionality in store listing |
| "Missing privacy policy" | Deploy privacy policy and add URL to dashboard |
| "Permission overuse" | Use minimum required permissions |
| "Deceptive functionality" | Store listing must match actual behavior |
| "Buggy or incomplete" | Test thoroughly before submission |
| "Poor user experience" | Ensure UI is intuitive and functional |

---

## After Submission

### Review Timeline
- Initial review: 1-3 business days
- Complex cases: Up to 7 business days
- Resubmission: Start review timeline again

### If Rejected
1. Read rejection email carefully
2. Check Developer Dashboard for details
3. Fix the issue
4. Submit again with explanation

### If Approved
1. Receive approval email
2. Extension goes live in Chrome Web Store
3. Share with users!

---

## Useful Links

- [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
- [Developer Policy Center](https://developer.chrome.com/docs/webstore/program-policies/)
- [Best Practices](https://developer.chrome.com/docs/webstore/best_practices/)
- [Extension Review FAQ](https://developer.chrome.com/docs/webstore/faq/)

---

**Last Updated:** January 2025
**Extension Version:** 1.1.5
