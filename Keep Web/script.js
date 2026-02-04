// ===== DOM Elements =====
const notesGrid = document.getElementById('notesGrid');
const noteTitle = document.getElementById('noteTitle');
const noteContent = document.getElementById('noteContent');
const noteCategory = document.getElementById('noteCategory');
const saveNoteBtn = document.getElementById('saveNote');
const cancelNoteBtn = document.getElementById('cancelNote');
const addNoteCard = document.getElementById('addNoteCard');
const notesCount = document.getElementById('notesCount');
const emptyState = document.getElementById('emptyState');
const toggleView = document.getElementById('toggleView');
const toggleTheme = document.getElementById('toggleTheme');
const editModal = document.getElementById('editModal');
const closeModal = document.getElementById('closeModal');
const cancelEdit = document.getElementById('cancelEdit');
const saveEdit = document.getElementById('saveEdit');
const editNoteTitle = document.getElementById('editNoteTitle');
const editNoteContent = document.getElementById('editNoteContent');
const editNoteCategory = document.getElementById('editNoteCategory');
const toast = document.getElementById('toast');
const colorBtns = document.querySelectorAll('.add-note-card .color-btn');
const modalColorBtns = document.querySelectorAll('.modal-body .color-btn');
const categoryTabs = document.querySelectorAll('.category-tab');

// ===== State =====
let notes = [];
let selectedColor = 'default';
let editingNoteId = null;
let editSelectedColor = 'default';
let isListView = false;
let activeCategory = 'all';

// ===== Initialize =====
function init() {
    loadNotes();
    loadTheme();
    loadViewPreference();
    renderNotes();
    setupEventListeners();
}

// ===== Event Listeners =====
function setupEventListeners() {
    // Save note
    saveNoteBtn.addEventListener('click', saveNote);

    // Cancel note
    cancelNoteBtn.addEventListener('click', clearNoteInputs);

    // Color picker for add note
    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            colorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedColor = btn.dataset.color;
        });
    });

    // Color picker for edit modal
    modalColorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modalColorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            editSelectedColor = btn.dataset.color;
        });
    });

    // Category tabs
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeCategory = tab.dataset.category;
            renderNotes();
        });
    });

    // Toggle view
    toggleView.addEventListener('click', () => {
        isListView = !isListView;
        notesGrid.classList.toggle('list-view', isListView);
        localStorage.setItem('notesViewPreference', isListView ? 'list' : 'grid');
        updateToggleViewIcon();
    });

    // Toggle theme
    toggleTheme.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('notesTheme', newTheme);
    });

    // Modal close
    closeModal.addEventListener('click', closeEditModal);
    cancelEdit.addEventListener('click', closeEditModal);
    saveEdit.addEventListener('click', saveEditedNote);

    // Close modal on overlay click
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeEditModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && editModal.classList.contains('active')) {
            closeEditModal();
        }
    });

    // Auto-resize textarea
    noteContent.addEventListener('input', autoResizeTextarea);
    editNoteContent.addEventListener('input', autoResizeTextarea);

    // Save with Ctrl+Enter
    noteContent.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            saveNote();
        }
    });

    noteTitle.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            saveNote();
        }
    });
}

// ===== Notes CRUD =====
function saveNote() {
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();
    const category = noteCategory.value;

    if (!title && !content) {
        showToast('Silakan isi judul atau konten catatan');
        return;
    }

    const note = {
        id: Date.now(),
        title: title || 'Tanpa Judul',
        content: content,
        color: selectedColor,
        category: category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    notes.unshift(note);
    saveNotesToStorage();
    renderNotes();
    clearNoteInputs();
    showToast('Catatan berhasil disimpan!');
}

function deleteNote(id) {
    if (confirm('Yakin ingin menghapus catatan ini?')) {
        notes = notes.filter(note => note.id !== id);
        saveNotesToStorage();
        renderNotes();
        showToast('Catatan berhasil dihapus');
    }
}

function editNote(id) {
    const note = notes.find(n => n.id === id);
    if (!note) return;

    editingNoteId = id;
    editNoteTitle.value = note.title === 'Tanpa Judul' ? '' : note.title;
    editNoteContent.value = note.content;
    editSelectedColor = note.color;
    editNoteCategory.value = note.category || 'all';

    // Set active color
    modalColorBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.color === note.color);
    });

    editModal.classList.add('active');
    editNoteTitle.focus();
}

function saveEditedNote() {
    const title = editNoteTitle.value.trim();
    const content = editNoteContent.value.trim();
    const category = editNoteCategory.value;

    if (!title && !content) {
        showToast('Silakan isi judul atau konten catatan');
        return;
    }

    const noteIndex = notes.findIndex(n => n.id === editingNoteId);
    if (noteIndex === -1) return;

    notes[noteIndex] = {
        ...notes[noteIndex],
        title: title || 'Tanpa Judul',
        content: content,
        color: editSelectedColor,
        category: category,
        updatedAt: new Date().toISOString()
    };

    saveNotesToStorage();
    renderNotes();
    closeEditModal();
    showToast('Catatan berhasil diperbarui!');
}

// ===== Render =====
function renderNotes() {
    notesGrid.innerHTML = '';

    // Filter notes based on active category
    const filteredNotes = activeCategory === 'all'
        ? notes
        : notes.filter(note => note.category === activeCategory);

    if (filteredNotes.length === 0) {
        emptyState.classList.remove('hidden');
        if (activeCategory === 'all') {
            notesCount.textContent = '0 catatan';
        } else {
            notesCount.textContent = `0 catatan di ${getCategoryName(activeCategory)}`;
        }
        return;
    }

    emptyState.classList.add('hidden');

    if (activeCategory === 'all') {
        notesCount.textContent = `${filteredNotes.length} catatan`;
    } else {
        notesCount.textContent = `${filteredNotes.length} catatan di ${getCategoryName(activeCategory)}`;
    }

    filteredNotes.forEach(note => {
        const noteCard = createNoteCard(note);
        notesGrid.appendChild(noteCard);
    });
}

function getCategoryName(category) {
    const names = {
        'all': 'Semua',
        'network': 'Network',
        'coding': 'Coding',
        'server': 'Server'
    };
    return names[category] || category;
}

function createNoteCard(note) {
    const card = document.createElement('div');
    card.className = `note-card ${note.color !== 'default' ? note.color : ''}`;
    card.onclick = () => editNote(note.id);

    const formattedDate = formatDate(note.updatedAt);
    const categoryBadge = note.category && note.category !== 'all'
        ? `<span class="note-category-badge">${getCategoryName(note.category)}</span>`
        : '';

    card.innerHTML = `
        <div class="note-card-header">
            <h3>${escapeHtml(note.title)}</h3>
            ${categoryBadge}
        </div>
        <p>${escapeHtml(note.content)}</p>
        <div class="note-card-footer">
            <span class="note-date">${formattedDate}</span>
            <div class="note-card-actions">
                <button class="note-action-btn edit" title="Edit" onclick="event.stopPropagation(); editNote(${note.id})">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <button class="note-action-btn delete" title="Hapus" onclick="event.stopPropagation(); deleteNote(${note.id})">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M14 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
    `;

    return card;
}

// ===== Utilities =====
function clearNoteInputs() {
    noteTitle.value = '';
    noteContent.value = '';
    noteCategory.value = 'all';
    selectedColor = 'default';
    colorBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.color === 'default');
    });
    noteContent.style.height = 'auto';
}

function closeEditModal() {
    editModal.classList.remove('active');
    editingNoteId = null;
    editNoteTitle.value = '';
    editNoteContent.value = '';
}

function autoResizeTextarea(e) {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `Hari ini, ${hours}:${minutes}`;
    } else if (diffDays === 1) {
        return 'Kemarin';
    } else if (diffDays < 7) {
        return `${diffDays} hari lalu`;
    } else {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('id-ID', options);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showToast(message) {
    toast.querySelector('.toast-message').textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function updateToggleViewIcon() {
    const svg = toggleView.querySelector('svg');
    if (isListView) {
        svg.innerHTML = `
            <rect x="3" y="4" width="18" height="4" rx="1" stroke="currentColor" stroke-width="2"/>
            <rect x="3" y="10" width="18" height="4" rx="1" stroke="currentColor" stroke-width="2"/>
            <rect x="3" y="16" width="18" height="4" rx="1" stroke="currentColor" stroke-width="2"/>
        `;
    } else {
        svg.innerHTML = `
            <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
            <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
            <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
            <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
        `;
    }
}

// ===== Storage =====
function saveNotesToStorage() {
    localStorage.setItem('myNotes', JSON.stringify(notes));
}

function loadNotes() {
    const savedNotes = localStorage.getItem('myNotes');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
        // Migrate old notes without category
        notes = notes.map(note => ({
            ...note,
            category: note.category || 'all'
        }));
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('notesTheme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function loadViewPreference() {
    const savedView = localStorage.getItem('notesViewPreference');
    if (savedView === 'list') {
        isListView = true;
        notesGrid.classList.add('list-view');
        updateToggleViewIcon();
    }
}

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', init);
