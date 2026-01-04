# Chrome Web Store - Privacy Practices Response Template

Use this template to fill in the "Privacy practices" tab on Chrome Developer Dashboard.

---

## Contact Email Setup
**Location:** Account tab > Contact email

1. Add your email address
2. Click "Send verification email"
3. Check your email and verify

---

## Current Permissions (Verified)

```json
"permissions": [
  "storage",
  "clipboardWrite"
]
```

---

## Privacy Practices Tab - Fill in all fields

### 1. Single Purpose Description
**Field:** Single purpose of your extension

**Use exactly:**
```
Edit Markdown text in the browser with live preview
```

---

### 2. Data Usage - Permissions Justification

#### A. storage Permission
**Field:** Why do you need the storage permission?

**Copy this:**
```
The storage permission is used ONLY to save the user's Markdown content locally on their device for:
1. Auto-saving work in progress
2. Restoring content when the user reopens the editor

All data is stored 100% locally on the user's device. NO data is transmitted to any external server.
```

---

#### B. clipboardWrite Permission
**Field:** Why do you need the clipboardWrite permission?

**Copy this:**
```
The clipboardWrite permission is used ONLY when the user explicitly clicks a "Copy" button to export their content. This is an intentional user action with clear purpose. No data is copied without user action.
```

---

### 3. Host Patterns Justification

#### web_accessible_resources with <all_urls>
Google may ask about this. Use:

**Copy this:**
```
The <all_urls> pattern in web_accessible_resources is required because fullscreen.html needs to be loaded in a new tab. This is a standard pattern for extensions that open their own pages in tabs. No external websites can access these resources.
```

---

### 4. Data Usage Disclosure

#### Does your extension collect any user data?
- [x] **No**, this extension does not collect any user data

#### Is any user data shared with third parties?
- [x] **No**, user data is not shared with third parties

#### Location of data processing:
- [x] **User's device only**

---

### 5. Certify Compliance

**Check the box:**
```
[x] I certify that my item's data usage complies with the Chrome Web Store Developer Program Policies and the Limited Use obligations.
```

---

## Screenshots/Videos

**Location:** Store listing tab > Screenshots

- **Minimum:** 1 screenshot
- **Size:** 1280x800 or 640x400 PNG

---

## Summary Checklist

Before Publishing:

- [ ] Contact email added and verified (Account tab)
- [ ] Single purpose: `Edit Markdown text in the browser with live preview`
- [ ] storage justification filled
- [ ] clipboardWrite justification filled
- [ ] Host pattern justification filled (if asked)
- [ ] Data usage certified
- [ ] At least 1 screenshot uploaded
- [ ] Extension re-packaged with updated files
- [ ] Test the extension in chrome://extensions/

---

## Quick Submit Flow

1. **Account tab** → Email added and verified
2. **Store listing tab** → Title, description, screenshots
3. **Privacy practices tab** → Fill all fields using this guide
4. **Pricing & distribution** → Set as Free
5. **Publish**

---

**Document Version:** 2.0
**Last Updated:** January 2025
