// ============================================
// Personal Notes Website - Main Application
// Accordion-style note expansion
// ============================================

// ============================================
// LOGIN GATE SYSTEM (Static - No Backend)
// ============================================

// Login Credentials (Change these as needed)
const AUTHORIZED_USERS = [
  { username: 'tycami', password: 'tycamitech' },
];

const AUTH_STORAGE_KEY = 'notes_auth_status';
const AUTH_TIMESTAMP_KEY = 'notes_auth_timestamp';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds (change as needed)

// Login DOM Elements
const loginElements = {
  overlay: null,
  form: null,
  usernameInput: null,
  passwordInput: null,
  errorDiv: null,
  loginBtn: null,
  appContainer: null
};

// Initialize login elements
function initializeLoginElements() {
  loginElements.overlay = document.getElementById('login-overlay');
  loginElements.form = document.getElementById('loginForm');
  loginElements.usernameInput = document.getElementById('loginUsername');
  loginElements.passwordInput = document.getElementById('loginPassword');
  loginElements.errorDiv = document.getElementById('loginError');
  loginElements.loginBtn = document.getElementById('loginBtn');
  loginElements.appContainer = document.querySelector('.app-container');
}

// Check if session has expired
function isSessionExpired() {
  const timestamp = localStorage.getItem(AUTH_TIMESTAMP_KEY);
  if (!timestamp) return true;

  const lastActivity = parseInt(timestamp, 10);
  const now = Date.now();
  const elapsed = now - lastActivity;

  return elapsed > SESSION_TIMEOUT;
}

// Update session timestamp (keep session alive)
function updateSessionTimestamp() {
  if (localStorage.getItem(AUTH_STORAGE_KEY) === 'true') {
    localStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
  }
}

// Setup activity tracking to keep session alive
function setupActivityTracking() {
  const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
  let lastUpdate = 0;

  const handleActivity = () => {
    const now = Date.now();
    // Only update every 60 seconds to avoid excessive writes
    if (now - lastUpdate > 60000) {
      lastUpdate = now;
      updateSessionTimestamp();
    }
  };

  activityEvents.forEach(event => {
    document.addEventListener(event, handleActivity, { passive: true });
  });

  // Also update when page becomes visible again
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      // Check if session expired while page was hidden
      if (localStorage.getItem(AUTH_STORAGE_KEY) === 'true' && isSessionExpired()) {
        logout();
      } else {
        updateSessionTimestamp();
      }
    }
  });
}

// Check if user is already authenticated
function checkAuthStatus() {
  initializeLoginElements();

  const isAuthenticated = localStorage.getItem(AUTH_STORAGE_KEY) === 'true';

  if (isAuthenticated) {
    // Check if session has expired
    if (isSessionExpired()) {
      // Session expired, clear auth and show login
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(AUTH_TIMESTAMP_KEY);
      showLogin();
      setupLoginListeners();
    } else {
      // Session still valid, update timestamp and show app
      updateSessionTimestamp();
      setupActivityTracking();
      showApp();
    }
  } else {
    // User is not logged in, show login form
    showLogin();
    setupLoginListeners();
  }
}

// Show the main application
function showApp() {
  if (loginElements.overlay) {
    loginElements.overlay.classList.add('hidden');
  }
  if (loginElements.appContainer) {
    loginElements.appContainer.style.display = 'flex';
  }
}

// Show login form
function showLogin() {
  if (loginElements.overlay) {
    loginElements.overlay.classList.remove('hidden');
  }
  if (loginElements.appContainer) {
    loginElements.appContainer.style.display = 'none';
  }
}

// Setup login form listeners
function setupLoginListeners() {
  if (loginElements.form) {
    loginElements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      checkLogin();
    });
  }

  if (loginElements.loginBtn) {
    loginElements.loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      checkLogin();
    });
  }

  // Clear error on input
  if (loginElements.usernameInput) {
    loginElements.usernameInput.addEventListener('input', clearLoginError);
  }
  if (loginElements.passwordInput) {
    loginElements.passwordInput.addEventListener('input', clearLoginError);
  }
}

// Clear login error message
function clearLoginError() {
  if (loginElements.errorDiv) {
    loginElements.errorDiv.textContent = '';
  }
}

// Check login credentials
function checkLogin() {
  const username = loginElements.usernameInput?.value.trim() || '';
  const password = loginElements.passwordInput?.value || '';

  if (!username || !password) {
    showLoginError('Please enter both username and password');
    return false;
  }

  // Check against array of authorized users
  const userFound = AUTHORIZED_USERS.find(user => user.username === username && user.password === password);

  if (userFound) {
    // Login successful
    localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    localStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
    setupActivityTracking();
    showApp();

    // Initialize the main app
    initializeElements();
    initializeTheme();
    renderCategories();
    renderNotes();
    setupEventListeners();
    setupScriptAccessPanel();

    return true;
  } else {
    // Login failed
    showLoginError('Invalid username or password');
    loginElements.passwordInput.value = '';
    loginElements.passwordInput.focus();
    return false;
  }
}

// Show login error message
function showLoginError(message) {
  if (loginElements.errorDiv) {
    loginElements.errorDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" x2="12" y1="8" y2="12"></line>
        <line x1="12" x2="12.01" y1="16" y2="16"></line>
      </svg>
      <span>${message}</span>
    `;
  }
}

// Logout function (can be called from browser console or a button)
function logout() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(AUTH_TIMESTAMP_KEY);
  showLogin();

  // Clear form
  if (loginElements.usernameInput) loginElements.usernameInput.value = '';
  if (loginElements.passwordInput) loginElements.passwordInput.value = '';
  clearLoginError();

  // Focus on username input
  setTimeout(() => {
    if (loginElements.usernameInput) loginElements.usernameInput.focus();
  }, 100);
}

// ============================================
// END OF LOGIN GATE SYSTEM
// ============================================

// ============================================
// SCRIPT ACCESS PANEL (Sidebar mini-login)
// ============================================
const SCRIPT_ADMIN_USERS = [
  { username: 'tycami', password: 'tycamitech' }
];

const SCRIPT_AUTH_KEY = 'script_admin_auth';
const SCRIPT_AUTH_TS_KEY = 'script_admin_timestamp';

function setupScriptAccessPanel() {
  const form = document.getElementById('scriptAccessForm');
  const btn = document.getElementById('scriptAccessBtn');
  const userInput = document.getElementById('scriptUser');
  const passInput = document.getElementById('scriptPass');
  const errorDiv = document.getElementById('scriptAccessError');
  const toggleBtn = document.getElementById('scriptAccessToggle');
  const panel = document.getElementById('scriptAccessPanel');

  // Setup Toggle Logic
  if (toggleBtn && panel) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent closing sidebar if clicked
      // Toggle logic

      
      if (panel.classList.contains('collapsed')) {
        panel.classList.remove('collapsed');
        toggleBtn.setAttribute('aria-expanded', 'true');
        // Focus first input
        setTimeout(() => userInput?.focus(), 100);
      } else {
        panel.classList.add('collapsed');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (!form) return;

  const handleLogin = (e) => {
    e.preventDefault();
    const u = userInput.value.trim();
    const p = passInput.value;

    if (!u || !p) {
      errorDiv.textContent = 'Enter username & password';
      return;
    }

    const found = SCRIPT_ADMIN_USERS.find(a => a.username === u && a.password === p);
    if (found) {
      // Store admin auth so script.html auto-unlocks
      localStorage.setItem(SCRIPT_AUTH_KEY, 'true');
      localStorage.setItem(SCRIPT_AUTH_TS_KEY, Date.now().toString());
      // Redirect to script page
      window.location.href = 'script.html';
    } else {
      errorDiv.textContent = 'Invalid admin credentials';
      passInput.value = '';
      passInput.focus();
    }
  };

  form.addEventListener('submit', handleLogin);
  btn.addEventListener('click', handleLogin);

  // Clear error on input
  [userInput, passInput].forEach(el => {
    el.addEventListener('input', () => { errorDiv.textContent = ''; });
  });
}
// ============================================
// END OF SCRIPT ACCESS PANEL
// ============================================

// State Management
let currentCategory = 'all';
let searchQuery = '';
let expandedNoteId = null;
let isSidebarOpen = false;
let isGridView = localStorage.getItem('viewMode') === 'grid';

// DOM Elements
const elements = {
  sidebar: null,
  sidebarOverlay: null,
  mobileMenuToggle: null,
  searchInput: null,
  categoryList: null,
  notesList: null,
  themeToggle: null,
  notesTitle: null,
  notesTitle: null,
  notesSubtitle: null,
  viewToggle: null
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  // Check authentication first
  checkAuthStatus();

  // If already authenticated, initialize the app
  if (localStorage.getItem(AUTH_STORAGE_KEY) === 'true') {
    initializeElements();
    initializeTheme();
    renderCategories();
    renderNotes();
    setupEventListeners();
    setupScriptAccessPanel();
  }
});

// Cache DOM elements
function initializeElements() {
  elements.sidebar = document.getElementById('sidebar');
  elements.sidebarOverlay = document.getElementById('sidebarOverlay');
  elements.mobileMenuToggle = document.getElementById('mobileMenuToggle');
  elements.searchInput = document.getElementById('searchInput');
  elements.categoryList = document.getElementById('categoryList');
  elements.notesList = document.getElementById('notesList');
  elements.themeToggle = document.getElementById('themeToggle');
  elements.notesTitle = document.getElementById('notesTitle');
  elements.notesSubtitle = document.getElementById('notesSubtitle');
  elements.viewToggle = document.getElementById('viewToggle');

  // Apply initial view state
  if (isGridView) {
    elements.notesList.classList.add('grid-view');
    updateViewIcon();
  }
}

// ============================================
// Theme Management
// ============================================
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  setTheme(theme);
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  updateThemeIcon(theme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
}

function updateThemeIcon(theme) {
  const iconContainer = elements.themeToggle.querySelector('.theme-icon');
  const textSpan = elements.themeToggle.querySelector('span:last-child');

  if (theme === 'dark') {
    iconContainer.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M12 2v2"></path>
        <path d="M12 20v2"></path>
        <path d="m4.93 4.93 1.41 1.41"></path>
        <path d="m17.66 17.66 1.41 1.41"></path>
        <path d="M2 12h2"></path>
        <path d="M20 12h2"></path>
        <path d="m6.34 17.66-1.41 1.41"></path>
        <path d="m19.07 4.93-1.41 1.41"></path>
      </svg>
    `;
    textSpan.textContent = 'Light Mode';
  } else {
    iconContainer.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
      </svg>
    `;
    textSpan.textContent = 'Dark Mode';
  }
}

// ============================================
// Sidebar Management (Mobile)
// ============================================
function toggleSidebar() {
  isSidebarOpen = !isSidebarOpen;
  elements.sidebar.classList.toggle('open', isSidebarOpen);
  elements.sidebarOverlay.classList.toggle('active', isSidebarOpen);
  document.body.style.overflow = isSidebarOpen ? 'hidden' : '';

  const toggleIcon = elements.mobileMenuToggle.querySelector('svg');
  if (isSidebarOpen) {
    toggleIcon.innerHTML = `
      <line x1="18" x2="6" y1="6" y2="18"></line>
      <line x1="6" x2="18" y1="6" y2="18"></line>
    `;
  } else {
    toggleIcon.innerHTML = `
      <line x1="4" x2="20" y1="12" y2="12"></line>
      <line x1="4" x2="20" y1="6" y2="6"></line>
      <line x1="4" x2="20" y1="18" y2="18"></line>
    `;
  }
}

function closeSidebar() {
  isSidebarOpen = false;
  elements.sidebar.classList.remove('open');
  elements.sidebarOverlay.classList.remove('active');
  document.body.style.overflow = '';

  const toggleIcon = elements.mobileMenuToggle.querySelector('svg');
  toggleIcon.innerHTML = `
    <line x1="4" x2="20" y1="12" y2="12"></line>
    <line x1="4" x2="20" y1="6" y2="6"></line>
    <line x1="4" x2="20" y1="18" y2="18"></line>
  `;
}

// ============================================
// Categories
// ============================================
function getCategories() {
  const categories = ['all'];
  notesData.forEach(note => {
    if (!categories.includes(note.category)) {
      categories.push(note.category);
    }
  });
  return categories;
}

function getCategoryCount(category) {
  if (category === 'all') return notesData.length;
  return notesData.filter(note => note.category === category).length;
}

function getCategoryIcon(category) {
  const icons = {
    all: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="14" rx="1"></rect><rect width="7" height="7" x="3" y="14" rx="1"></rect></svg>`,
    Guide: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`,
    Coding: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
    Network: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="16" y="16" width="6" height="6" rx="1"></rect><rect x="2" y="16" width="6" height="6" rx="1"></rect><rect x="9" y="2" width="6" height="6" rx="1"></rect><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"></path><path d="M12 12V8"></path></svg>`,
    Server: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect><rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect><line x1="6" x2="6.01" y1="6" y2="6"></line><line x1="6" x2="6.01" y1="18" y2="18"></line></svg>`
  };
  return icons[category] || icons.all;
}

function renderCategories() {
  const categories = getCategories();

  elements.categoryList.innerHTML = categories.map(category => `
    <li class="category-item">
      <button 
        class="category-btn ${category === currentCategory ? 'active' : ''}" 
        data-category="${category}"
        aria-pressed="${category === currentCategory}"
      >
        <span class="category-icon">${getCategoryIcon(category)}</span>
        <span>${category === 'all' ? 'All Notes' : category}</span>
        <span class="category-count">${getCategoryCount(category)}</span>
      </button>
    </li>
  `).join('');

  elements.categoryList.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentCategory = btn.dataset.category;
      expandedNoteId = null; // Reset expanded state
      renderCategories();
      renderNotes();
      closeSidebar();
    });
  });
}

// ============================================
// Notes Rendering
// ============================================
function getFilteredNotes() {
  return notesData.filter(note => {
    const matchesCategory = currentCategory === 'all' || note.category === currentCategory;
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}

function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function getPreview(content) {
  const plainText = content
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*/g, '')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return plainText.substring(0, 180) + (plainText.length > 180 ? '...' : '');
}

function parseContent(content) {
  // First, process code blocks before escaping HTML
  // Handle escaped backticks (\`\`\`) and regular backticks (```)
  let html = content
    // Replace escaped triple backticks code blocks first
    .replace(/\\`\\`\\`(\w+)?\n([\s\S]*?)\\`\\`\\`/g, '<pre><code>$2</code></pre>')
    // Replace regular triple backticks code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');

  // Now escape HTML entities (but not inside <pre><code> blocks)
  const codeBlocks = [];
  html = html.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (match, code) => {
    codeBlocks.push(code);
    return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
  });

  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/\\`([^`]+)\\`/g, '<code>$1</code>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/^---$/gm, '<hr>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/\|(.+)\|/g, (match, content) => {
      const cells = content.split('|').map(cell => cell.trim());
      const isHeader = cells.some(cell => cell.match(/^-+$/));
      if (isHeader) return '';
      return '<tr>' + cells.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
    })
    .replace(/✅/g, '<span style="color: #22c55e;">✅</span>');

  // Restore code blocks
  codeBlocks.forEach((code, index) => {
    // Escape HTML inside code blocks
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    html = html.replace(`__CODE_BLOCK_${index}__`, `<pre><code>${escapedCode}</code></pre>`);
  });

  html = html.replace(/(<li>[\s\S]*?<\/li>\n?)+/g, match => `<ul>${match}</ul>`);
  html = html.replace(/(<tr>[\s\S]*?<\/tr>\n?)+/g, match => `<table>${match}</table>`);
  html = html.replace(/<\/ul>\s*<ul>/g, '');
  html = html.replace(/<\/table>\s*<table>/g, '');

  const lines = html.split('\n');
  html = lines.map(line => {
    line = line.trim();
    if (!line) return '';
    if (line.startsWith('<')) return line;
    return `<p>${line}</p>`;
  }).join('\n');

  html = html.replace(/<p>\s*<\/p>/g, '');

  return html;
}

function renderNotes() {
  const filteredNotes = getFilteredNotes();

  const categoryName = currentCategory === 'all' ? 'All Notes' : currentCategory;
  elements.notesTitle.textContent = categoryName;
  elements.notesSubtitle.textContent = `${filteredNotes.length} ${filteredNotes.length === 1 ? 'note' : 'notes'} available`;

  if (filteredNotes.length === 0) {
    elements.notesList.innerHTML = `
      <div class="empty-state">
        <svg class="empty-state-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
          <path d="M8 11h6"></path>
        </svg>
        <h3 class="empty-state-title">No notes found</h3>
        <p class="empty-state-text">Try adjusting your search or selecting a different category</p>
      </div>
    `;
    return;
  }

  elements.notesList.innerHTML = filteredNotes.map(note => {
    const isExpanded = expandedNoteId === note.id;

    return `
    <article class="note-card ${isExpanded ? 'expanded' : ''}" data-id="${note.id}">
      <!-- Note Header (Always Visible) -->
      <div class="note-card-header" data-toggle="${note.id}">
        <div class="note-card-title-row">
          <h2 class="note-card-title">${note.title}</h2>
          <span class="note-card-category">${note.category}</span>
        </div>
        
        <div class="note-card-meta">
          <span class="note-card-meta-item">
            <svg class="note-card-meta-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
              <line x1="16" x2="16" y1="2" y2="6"></line>
              <line x1="8" x2="8" y1="2" y2="6"></line>
              <line x1="3" x2="21" y1="10" y2="10"></line>
            </svg>
            <span>${formatDate(note.date)}</span>
          </span>
          <span class="note-card-meta-item">
            <svg class="note-card-meta-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>${calculateReadingTime(note.content)}</span>
          </span>
          <span class="note-card-meta-item">
            <svg class="note-card-meta-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <span>${note.content.split(/\s+/).length} words</span>
          </span>
        </div>

        ${!isExpanded ? `<p class="note-card-preview">${getPreview(note.content)}</p>` : ''}

        <div class="note-card-toggle">
          <span class="toggle-btn">
            ${isExpanded ? 'Close note' : 'Read full note'}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${isExpanded ? 'rotated' : ''}">
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          </span>
        </div>
      </div>

      <!-- Note Content (Expandable) -->
      <div class="note-card-content ${isExpanded ? 'show' : ''}">
        <div class="note-content">
          ${parseContent(note.content)}
        </div>
      </div>
    </article>
  `}).join('');

  // Add click listeners for toggle
  elements.notesList.querySelectorAll('.note-card-header').forEach(header => {
    header.addEventListener('click', () => {
      const noteId = parseInt(header.dataset.toggle);
      toggleNote(noteId);
    });
  });
}

function toggleNote(noteId) {
  if (expandedNoteId === noteId) {
    // Collapse if already expanded
    expandedNoteId = null;
  } else {
    // Expand this note
    expandedNoteId = noteId;
  }
  renderNotes();

  // Scroll to the expanded note
  if (expandedNoteId !== null) {
    setTimeout(() => {
      const expandedCard = document.querySelector(`.note-card[data-id="${expandedNoteId}"]`);
      if (expandedCard) {
        expandedCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
}

// ============================================
// Event Listeners
// ============================================
function setupEventListeners() {
  elements.themeToggle.addEventListener('click', toggleTheme);

  let searchTimeout;
  elements.searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchQuery = e.target.value;
      expandedNoteId = null;
      renderNotes();
    }, 200);
  });

  elements.mobileMenuToggle.addEventListener('click', toggleSidebar);
  elements.sidebarOverlay.addEventListener('click', closeSidebar);
  elements.viewToggle.addEventListener('click', toggleView);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (expandedNoteId !== null) {
        expandedNoteId = null;
        renderNotes();
      }
      if (isSidebarOpen) {
        closeSidebar();
      }
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      elements.searchInput.focus();
      if (isSidebarOpen === false && window.innerWidth <= 1024) {
        toggleSidebar();
      }
    }
  });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (window.innerWidth > 1024 && isSidebarOpen) {
        closeSidebar();
      }
    }, 100);
  });
}

// ============================================
// View Management
// ============================================
function toggleView() {
  isGridView = !isGridView;
  localStorage.setItem('viewMode', isGridView ? 'grid' : 'list');

  if (isGridView) {
    elements.notesList.classList.add('grid-view');
  } else {
    elements.notesList.classList.remove('grid-view');
  }

  updateViewIcon();
}

function updateViewIcon() {
  const svg = elements.viewToggle.querySelector('svg');
  if (isGridView) {
    // Show List Icon (indicating "Click to switch to List")
    svg.innerHTML = `
      <line x1="8" x2="21" y1="6" y2="6"></line>
      <line x1="8" x2="21" y1="12" y2="12"></line>
      <line x1="8" x2="21" y1="18" y2="18"></line>
      <line x1="3" x2="3.01" y1="6" y2="6"></line>
      <line x1="3" x2="3.01" y1="12" y2="12"></line>
      <line x1="3" x2="3.01" y1="18" y2="18"></line>
    `;
    elements.viewToggle.setAttribute('aria-label', 'Switch to list view');
  } else {
    // Grid Icon (indicating "Click to switch to Grid")
    svg.innerHTML = `
      <rect width="7" height="7" x="3" y="3" rx="1"></rect>
      <rect width="7" height="7" x="14" y="3" rx="1"></rect>
      <rect width="7" height="7" x="14" y="14" rx="1"></rect>
      <rect width="7" height="7" x="3" y="14" rx="1"></rect>
    `;
    elements.viewToggle.setAttribute('aria-label', 'Switch to grid view');
  }
}
