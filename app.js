// ============================================
// The Notebook - Simple Markdown Editor
// ============================================

// Application State
let files = [];
let activeFileId = null;

// DOM Elements
const fileList = document.getElementById('fileList');
const newFileBtn = document.getElementById('newFileBtn');
const searchInput = document.getElementById('searchInput');
const fileTitle = document.getElementById('fileTitle');
const markdownEditor = document.getElementById('markdownEditor');
const previewContent = document.getElementById('previewContent');
const deleteModal = document.getElementById('deleteModal');
const deleteFileName = document.getElementById('deleteFileName');
const cancelDelete = document.getElementById('cancelDelete');
const confirmDelete = document.getElementById('confirmDelete');

// ============================================
// Utility Functions
// ============================================

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Format date for display
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Debounce function to limit how often a function runs
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// ============================================
// Local Storage Functions
// ============================================

// Save files to localStorage
function saveFiles() {
    localStorage.setItem('notebook_files', JSON.stringify(files));
}

// Load files from localStorage
function loadFiles() {
    const data = localStorage.getItem('notebook_files');
    return data ? JSON.parse(data) : [];
}

// Save active file ID
function saveActiveFile() {
    localStorage.setItem('notebook_active_file', activeFileId || '');
}

// Load active file ID
function loadActiveFile() {
    return localStorage.getItem('notebook_active_file') || null;
}

// ============================================
// File Management Functions
// ============================================

// Create a new file
function createFile(title = 'Untitled', content = '') {
    const file = {
        id: generateId(),
        title: title,
        content: content,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };
    
    files.unshift(file);
    saveFiles();
    
    return file;
}

// Get file by ID
function getFile(id) {
    return files.find(file => file.id === id);
}

// Update a file
function updateFile(id, updates) {
    const index = files.findIndex(file => file.id === id);
    if (index !== -1) {
        files[index] = {
            ...files[index],
            ...updates,
            updatedAt: Date.now()
        };
        saveFiles();
    }
}

// Delete a file
function deleteFile(id) {
    files = files.filter(file => file.id !== id);
    saveFiles();
}

// Search files by title or content
function searchFiles(query) {
    const lowerQuery = query.toLowerCase();
    return files.filter(file =>
        file.title.toLowerCase().includes(lowerQuery) ||
        file.content.toLowerCase().includes(lowerQuery)
    );
}

// ============================================
// UI Rendering Functions
// ============================================

// Render the file list
function renderFileList(filesToRender = files) {
    fileList.innerHTML = '';
    
    if (filesToRender.length === 0) {
        fileList.innerHTML = '<li class="empty-files">No files yet. Click "+ New" to create one!</li>';
        return;
    }
    
    filesToRender.forEach(file => {
        const li = document.createElement('li');
        li.className = `file-item ${file.id === activeFileId ? 'active' : ''}`;
        
        li.innerHTML = `
            <div class="file-info">
                <div class="file-name">${escapeHtml(file.title) || 'Untitled'}</div>
                <div class="file-date">${formatDate(file.updatedAt)}</div>
            </div>
            <button class="delete-btn" title="Delete">🗑️</button>
        `;
        
        // Click to select file
        li.addEventListener('click', (e) => {
            if (!e.target.classList.contains('delete-btn')) {
                selectFile(file.id);
            }
        });
        
        // Delete button click
        li.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            showDeleteModal(file);
        });
        
        fileList.appendChild(li);
    });
}

// Select a file to edit
function selectFile(id) {
    activeFileId = id;
    saveActiveFile();
    
    const file = getFile(id);
    if (file) {
        fileTitle.value = file.title;
        markdownEditor.value = file.content;
        updatePreview(file.content);
    }
    
    renderFileList();
}

// Update the markdown preview with syntax highlighting
function updatePreview(content) {
    if (!content.trim()) {
        previewContent.innerHTML = '<div class="empty-state"><p>Start typing to see the preview...</p></div>';
        return;
    }
    
    // Configure marked options with highlight.js integration
    marked.setOptions({
        breaks: true,
        gfm: true,
        highlight: function(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(code, { language: lang }).value;
                } catch (err) {
                    console.error('Highlight error:', err);
                }
            }
            // Auto-detect language if not specified
            try {
                return hljs.highlightAuto(code).value;
            } catch (err) {
                console.error('Highlight auto error:', err);
            }
            return code;
        },
        langPrefix: 'hljs language-'
    });
    
    // Parse markdown and set HTML
    previewContent.innerHTML = marked.parse(content);
    
    // Apply highlighting to any code blocks that might have been missed
    previewContent.querySelectorAll('pre code:not(.hljs)').forEach((block) => {
        hljs.highlightElement(block);
    });
}

// Clear the editor
function clearEditor() {
    fileTitle.value = '';
    markdownEditor.value = '';
    previewContent.innerHTML = '<div class="empty-state"><p>Start typing to see the preview...</p></div>';
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// Modal Functions
// ============================================

let fileToDelete = null;

function showDeleteModal(file) {
    fileToDelete = file;
    deleteFileName.textContent = file.title || 'Untitled';
    deleteModal.classList.add('show');
}

function hideDeleteModal() {
    deleteModal.classList.remove('show');
    fileToDelete = null;
}

// ============================================
// Event Handlers
// ============================================

// New file button
newFileBtn.addEventListener('click', () => {
    const file = createFile();
    selectFile(file.id);
    fileTitle.focus();
});

// File title input - save on change
fileTitle.addEventListener('input', debounce((e) => {
    if (activeFileId) {
        updateFile(activeFileId, { title: e.target.value });
        renderFileList();
    }
}, 300));

// Markdown editor input - save and update preview
markdownEditor.addEventListener('input', debounce((e) => {
    const content = e.target.value;
    
    if (activeFileId) {
        updateFile(activeFileId, { content: content });
    }
    
    updatePreview(content);
}, 150));

// Search input
searchInput.addEventListener('input', debounce((e) => {
    const query = e.target.value.trim();
    
    if (query) {
        renderFileList(searchFiles(query));
    } else {
        renderFileList();
    }
}, 200));

// Delete modal - Cancel button
cancelDelete.addEventListener('click', hideDeleteModal);

// Delete modal - Confirm button
confirmDelete.addEventListener('click', () => {
    if (fileToDelete) {
        deleteFile(fileToDelete.id);
        
        // If deleted file was active, select another or clear
        if (fileToDelete.id === activeFileId) {
            if (files.length > 0) {
                selectFile(files[0].id);
            } else {
                activeFileId = null;
                saveActiveFile();
                clearEditor();
            }
        }
        
        renderFileList();
    }
    
    hideDeleteModal();
});

// Close modal when clicking outside
deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
        hideDeleteModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to save (prevent default browser save)
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        // Already auto-saving, but could show a notification here
    }
    
    // Ctrl/Cmd + N for new file
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        const file = createFile();
        selectFile(file.id);
        fileTitle.focus();
    }
    
    // Escape to close modal
    if (e.key === 'Escape' && deleteModal.classList.contains('show')) {
        hideDeleteModal();
    }
});

// ============================================
// Initialize Application
// ============================================

function init() {
    // Load saved files
    files = loadFiles();
    
    // Load active file ID
    const savedActiveFile = loadActiveFile();
    
    // Create welcome file if no files exist
    if (files.length === 0) {
        const welcomeContent = `# Welcome to The Notebook! 📓

This is your personal Markdown editor with **live preview** and **syntax highlighting**!

## Features

- ✨ Live Markdown preview
- 🎨 Syntax highlighting for code blocks
- 💾 Auto-save to browser storage
- 🔍 Search through your notes
- 📱 Responsive design

## Markdown Examples

### Text Formatting

**Bold text** and *italic text* and ~~strikethrough~~

### Lists

- Item 1
- Item 2
  - Nested item
- Item 3

1. First
2. Second
3. Third

### Links and Images

[Visit Google](https://google.com)

### Blockquote

> This is a blockquote.
> It can span multiple lines.

### Code

Inline \`code\` looks like this.

### Code Blocks with Syntax Highlighting

\`\`\`python
def hello_world():
    print("Hello, World!")
    return True

if __name__ == "__main__":
    hello_world()
\`\`\`

\`\`\`javascript
const greet = (name) => {
    console.log(\`Hello, \${name}!\`);
    return true;
};

greet("World");
\`\`\`

\`\`\`json
{
    "name": "The Notebook",
    "version": "1.0.0",
    "features": ["markdown", "syntax-highlighting", "auto-save"]
}
\`\`\`

### Tables

| Feature | Status |
|---------|--------|
| Markdown | ✅ |
| Syntax Highlighting | ✅ |
| Auto-save | ✅ |

### Horizontal Rule

---

## Keyboard Shortcuts

- **Ctrl + N** - New file
- **Ctrl + S** - Save (auto-saves anyway!)
- **Escape** - Close modal

---

Happy writing! ✨
`;
        const welcomeFile = createFile('Welcome to The Notebook', welcomeContent);
        selectFile(welcomeFile.id);
    } else {
        // Render file list
        renderFileList();
        
        // Select saved active file or first file
        if (savedActiveFile && getFile(savedActiveFile)) {
            selectFile(savedActiveFile);
        } else if (files.length > 0) {
            selectFile(files[0].id);
        }
    }
}

// Start the application
init();