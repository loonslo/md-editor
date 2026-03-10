# Markdown Chrome Extension

### chrome插件市场已上架。欢迎搜索下载使用 Markdown Editor - Live Preview & Format

<img width="2560" height="860" alt="image" src="https://github.com/user-attachments/assets/2a6659d8-2bc2-4f4c-accd-6512c8763fc4" />


## 🌍 多语言支持 (Internationalization)

本扩展现在支持多种语言，为全球用户提供本地化体验！

**支持的语言**：
- 🇺🇸 English (默认)
- 🇨🇳 中文 (简体)
- 🇯🇵 日本語
- 🇪🇸 Español

语言会自动根据您的浏览器设置进行检测，您也可以通过扩展设置手动切换语言。

[详细了解国际化实现 →](INTERNATIONALIZATION.md)


一个功能强大的Chrome浏览器扩展，提供Markdown编辑、格式化和实时预览功能。

## 📌 版本信息

**当前版本**：v1.1.5 (2024-11-07)

### 最近更新
n**v1.1.5 - 🌍 添加完整国际化 (i18n) 支持**
- ✨ 新增 4 种语言支持：英文、中文、日语、西班牙语
- 🔄 实现自动语言检测和手动切换
- 💾 语言偏好设置持久化存储
- 📝 所有 UI 元素完全支持多语言
- 🔧 建立完整的 i18n 架构系统
- 📚 提供详细的国际化文档

**v1.1.4 - 🐛 修复格式化按钮重复点击问题**
- 修复多次点击格式化按钮导致空行和空格增加的问题
- 智能防重复格式化机制

**v1.1.3 - 🔧 修复按钮功能问题**
- 修复openInPopupBtn按钮ID不匹配问题
- 验证所有按钮功能正常

**v1.1.2 - 📝 更新默认欢迎文本**
- 在欢迎文本中添加"Create by : Ajar半开"署名信息
- 联社得保留来源

**v1.1.1 - 🔧 修复标题格式化**
- 修复 `###Markdown-Weixin` 类标题无法正确格式化的问题
- 现在支持 `#` 符号后无空格格式
- 支持标题出现在任意位置

**v1.1.0 - 🚀 直接在新标签页打开**
- 点击扩展图标直接在新标签页中打开
- 真正的1400x900像素大屏编辑体验
- 彻底解决popup窗口大小限制问题

## 功能特性

### ✅ 已实现功能

1. **实时预览**
   - 双栏布局：左侧编辑器，右侧实时预览
   - 支持标准Markdown语法（标题、列表、链接、代码块、引用等）
   - 300毫秒防抖更新，优化性能

2. **编辑器功能**
   - 文本输入和编辑
   - 光标位置保持
   - 文本选择和操作
   - 换行和缩进保持

3. **格式化工具**
   - 粗体 (Ctrl+B)
   - 斜体 (Ctrl+I)
   - 插入链接 (Ctrl+K)
   - 代码块
   - 格式化按钮
   - 实时字数统计

4. **实时预览增强**
   - 语法高亮支持（使用highlight.js）
   - 滚动同步（编辑器与预览面板）
   - 美观的样式渲染

5. **复制功能**
   - 复制HTML格式
   - 复制Markdown源码
   - 复制成功通知
   - 支持富文本复制

6. **存储管理**
   - 自动保存（输入时实时保存）
   - 内容持久化
   - 启动时恢复内容
   - 清空功能

7. **用户体验**
   - 键盘快捷键支持
   - 响应式设计
   - 加载指示器
   - 错误处理
   - Toast通知

8. **全屏模式** 🆕
   - 新标签页中打开全屏编辑器
   - **真正80%的浏览器窗口大小**（1400x900px）
   - 深色主题UI，适合长时间编辑
   - 跨窗口内容同步
   - 支持F11全屏切换
   - 按Ctrl+W快速关闭

## 项目结构

```
.
├── manifest.json          # 扩展配置文件
├── background.js          # 后台服务脚本（处理点击事件）
├── popup.html             # 主界面HTML（popup模式）
├── fullscreen.html        # 全屏模式HTML
├── README.md              # 项目文档
├── INSTALL.md             # 安装指南
├── FULLSCREEN_MODE.md     # 全屏模式使用指南
├── styles/
│   ├── popup.css          # popup样式
│   └── fullscreen.css     # 全屏模式样式
├── scripts/
│   ├── popup.js           # popup脚本
│   └── fullscreen.js      # 全屏模式脚本
├── lib/
│   ├── marked.min.js      # Markdown解析库
│   └── highlight.min.js   # 语法高亮库
└── icons/
    ├── README.txt         # 图标说明
    ├── icon.svg           # SVG图标
    └── generate-icons.html # 图标生成器
```

## 安装和使用

### 1. 生成图标文件

在 `icons/` 目录中打开 `generate-icons.html` 文件，点击按钮下载三种尺寸的PNG图标：
- icon16.png (16x16像素)
- icon48.png (48x48像素)
- icon128.png (128x128像素)

### 2. 安装扩展

1. 打开Chrome浏览器
2. 进入 `chrome://extensions/`
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择此项目目录

### 3. 使用扩展

**直接在新标签页中打开！** 🚀

1. 点击Chrome工具栏中的扩展图标
2. 自动在新标签页中打开Markdown编辑器
3. 享受真正的**1400x900像素大屏编辑体验**
4. 左侧编辑，右侧实时预览
5. 支持深色主题、F11全屏切换等高级功能
6. 按 `Ctrl+W` 快速关闭编辑器

**注意**：点击扩展图标现在会**直接在新标签页打开**，无需再通过popup窗口！

## 核心组件

### EditorManager
- 负责编辑器文本操作
- 处理格式化功能
- 管理光标和选择

### PreviewManager
- Markdown到HTML转换
- 实时预览更新
- 语法高亮
- 滚动同步

### CopyManager
- 剪贴板操作
- 多种格式复制
- 用户反馈

### StorageManager
- 内容持久化
- 自动保存
- 存储管理

## 技术栈

- **Manifest V3** - Chrome扩展规范
- **Vanilla JavaScript** - 无框架依赖
- **marked.js** - Markdown解析
- **highlight.js** - 语法高亮
- **Chrome Storage API** - 本地存储
- **Chrome Clipboard API** - 剪贴板操作

## 键盘快捷键

- `Ctrl+B` / `Cmd+B` - 粗体
- `Ctrl+I` / `Cmd+I` - 斜体
- `Ctrl+K` / `Cmd+K` - 插入链接
- `Ctrl+S` / `Cmd+S` - 保存（自动保存）

## 浏览器兼容性

- Chrome 88+
- 基于Chromium的浏览器（Edge、Opera等）

## 权限说明

- `storage` - 保存编辑器内容和偏好设置
- `clipboardWrite` - 复制内容到剪贴板

## 开发计划

### 未来可能的功能

- [ ] 主题系统（多个UI主题）
- [ ] 代码高亮主题选择
- [ ] 导出为PDF/图片
- [ ] 文档导入功能
- [ ] 搜索和替换
- [ ] 拼写检查
- [ ] 多标签页支持

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 联系方式

如有问题或建议，请通过GitHub Issues联系。
