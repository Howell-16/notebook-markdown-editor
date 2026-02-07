# 📓 The Notebook - Multi-File Markdown Editor

A lightweight, browser-based note-taking application with a three-panel layout featuring file management, Markdown editor, and live preview with syntax highlighting.

![The Notebook Screenshot](https://img.shields.io/badge/Status-Complete-brightgreen) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

---

## 🌐 Live Demo

**[https://howell-16.github.io/notebook-markdown-editor/](https://howell-16.github.io/notebook-markdown-editor/)**

---

## 🚀 Instructions
Option 1: Use Live Demo (Easiest)  
Simply visit the live demo:
https://howell-16.github.io/notebook-markdown-editor/

Option 2: Run Locally  
Step 1: Clone the repository
```bash
git clone https://github.com/pbelx/notebook-markdown-editor.git
cd notebook-markdown-editor
```
Step 2: Open in browser  

No build process or server required! Simply open the HTML file:
```bash
# On macOS
open index.html

# On Windows
start index.html

# On Linux
xdg-open index.html
```
Or double-click index.html in your file explorer.

---

## 📋 Project Choice

**Selected Project:** Option 1 - The "Notebook" - Multi-File Markdown Editor

### Why This Project?

I chose this project because:

1. **Practical Utility** - A markdown editor is a tool I would personally use for note-taking and documentation
2. **Technical Depth** - It requires integration of third-party libraries, state management, and local storage
3. **UI/UX Challenge** - The three-panel layout demands thoughtful responsive design
4. **No Backend Required** - Can be deployed as a static site, making it accessible and easy to share
5. **Extensibility** - The architecture allows for future feature additions

---

## 🛠️ Justification of Tools

### AI Tool

| Tool | Reason |
|------|--------|
| **Claude AI (Anthropic)** | Chose Claude for its strong ability to understand complex requirements, provide production-ready code, and explain technical concepts clearly. Claude excels at iterative problem-solving and maintaining context across long conversations. |

### Development Stack

| Technology | Justification |
|------------|---------------|
| **Vanilla JavaScript** | No build process required, faster load times, simpler deployment. Reduces complexity while maintaining full functionality. |
| **Marked.js** | Industry-standard Markdown parser with 30k+ GitHub stars. Supports GitHub Flavored Markdown (GFM) including tables, task lists, and code blocks. |
| **Highlight.js** | Comprehensive syntax highlighting supporting 190+ programming languages. Seamlessly integrates with Marked.js for code block highlighting. |
| **Browser LocalStorage** | Native browser API for persistent storage. No database setup required, data stays private on user's device. |
| **GitHub Pages** | Free, reliable static hosting with automatic HTTPS. Simple deployment directly from repository. |
| **HTML** | Provides semantic structure for the application layout |
| **Pure CSS3** | Custom styling without framework overhead. CSS variables for easy theming and maintenance. |

---

## 🎯 High-Level Approach

### Development Strategy

I used an **iterative prompt-engineering approach** with multiple phases:  
**Phase 1:** Initial Architecture  
⬇️  
**Phase 2:** Feature Enhancement (Syntax Highlighting)  
⬇️  
**Phase 3:** Testing & Bug Fixes  
⬇️  
**Phase 4:** Production Readiness  
⬇️  
**Phase 5:** Documentation & Deployment  




### Phase Breakdown

**Phase 1: Initial Architecture**
- Single comprehensive prompt requesting three-panel layout
- Specified Markdown parsing with live preview
- Defined LocalStorage for data persistence
- Received complete HTML, CSS, and JavaScript structure

**Phase 2: Feature Enhancement**
- Identified missing syntax highlighting in code blocks
- Requested Highlight.js integration
- Refined configuration for optimal language detection

**Phase 3: Testing & Bug Fixes**
- Created comprehensive Markdown test document
- Identified rendering issues through manual testing
- Fixed code block highlighting configuration
- Optimized preview performance with debouncing

**Phase 4: Production Readiness**
- Consolidated all code into final, clean versions
- Added keyboard shortcuts for better UX
- Implemented responsive design for mobile
- Added delete confirmation modal

**Phase 5: Documentation & Deployment**
- Created comprehensive README documentation
- Set up GitHub Pages deployment
- Tested live deployment

### Architecture Design

**Three-Panel Layout:**
```text
┌────────────────┬─────────────────┬─────────────────┐
│ File List      │ Editor          │ Preview         │
│                │ (flex: 1)       │ (flex: 1)       │
│                │                 │                 │
│ - File 1       │ # My Note       │ My Note         │
│ - File 2       │                 │ ──────────      │
│ - File 3       │ Some text...    │ Some text...    │
│                │                 │                 │
└────────────────┴─────────────────┴─────────────────┘
```

## 📝 Final Prompts
Prompt 1: Initial Project Setup
```text
I need to create a notebook markdown editor with live preview for a technical assessment.

Requirements:
- Three-panel layout: file list, markdown editor, live preview
- File management: create, edit, delete multiple markdown files
- Search functionality across all files
- Auto-save using browser LocalStorage
- Clean, modern UI design
- Responsive layout

Please provide the complete code that fulfill the requirement above.
```
