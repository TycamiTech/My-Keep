// ============================================
// ADMIN CREDENTIALS (separate from main login)
// Change these to your admin credentials
// ============================================
const ADMIN_USERS = [
    { username: 'tycami', password: 'tycamitech' }
];

const ADMIN_AUTH_KEY = 'script_admin_auth';
const ADMIN_AUTH_TS_KEY = 'script_admin_timestamp';
const ADMIN_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// ============================================
// MIKROTIK SCRIPTS DATA
// Add your script files here
// ============================================
const MIKROTIK_SCRIPTS = [
    {
        id: 1,
        name: 'Basic Configuration',
        filename: 'basic-config.rsc',
        type: 'rsc',
        description: 'Konfigurasi dasar MikroTik meliputi identity, login, interface, IP address, dan DNS.',
        tags: ['Setup', 'Basic'],
        size: '2.4 KB',
        date: '2026-02-10',
        content: `# MikroTik Basic Configuration
# ================================
/system identity set name="MikroTik-Router"

# Interface Configuration
/interface set ether1 name=ether1-Internet
/interface set ether2 name=ether2-Guru
/interface set ether3 name=ether3-Murid
/interface set ether4 name=ether4-Server

# IP Address
/ip address
add address=192.168.1.2/24 interface=ether1-Internet
add address=10.10.10.1/24 interface=ether2-Guru
add address=10.10.20.1/24 interface=ether3-Murid
add address=10.10.30.1/24 interface=ether4-Server

# DNS
/ip dns set servers=8.8.8.8,8.8.4.4 allow-remote-requests=yes`
    },
    {
        id: 2,
        name: 'DHCP Server Setup',
        filename: 'dhcp-setup.rsc',
        type: 'rsc',
        description: 'Setup DHCP Server untuk semua jaringan lokal (Guru, Murid, Server).',
        tags: ['DHCP', 'Network'],
        size: '1.8 KB',
        date: '2026-02-10',
        content: `# DHCP Server Configuration
# ================================

# DHCP Pool - Guru
/ip pool add name=pool-guru ranges=10.10.10.2-10.10.10.254

# DHCP Pool - Murid
/ip pool add name=pool-murid ranges=10.10.20.2-10.10.20.254

# DHCP Pool - Server
/ip pool add name=pool-server ranges=10.10.30.2-10.10.30.254

# DHCP Server
/ip dhcp-server
add name=dhcp-guru interface=ether2-Guru address-pool=pool-guru disabled=no
add name=dhcp-murid interface=ether3-Murid address-pool=pool-murid disabled=no
add name=dhcp-server interface=ether4-Server address-pool=pool-server disabled=no

# DHCP Network
/ip dhcp-server network
add address=10.10.10.0/24 gateway=10.10.10.1 dns-server=8.8.8.8,8.8.4.4
add address=10.10.20.0/24 gateway=10.10.20.1 dns-server=8.8.8.8,8.8.4.4
add address=10.10.30.0/24 gateway=10.10.30.1 dns-server=8.8.8.8,8.8.4.4`
    },
    {
        id: 3,
        name: 'Firewall Rules',
        filename: 'firewall-rules.rsc',
        type: 'rsc',
        description: 'Konfigurasi firewall: blok murid ke guru, proteksi DNS, brute force protection, dan logging.',
        tags: ['Firewall', 'Security'],
        size: '3.1 KB',
        date: '2026-02-10',
        content: `# Firewall Configuration
# ================================

# NAT Masquerade
/ip firewall nat add chain=srcnat out-interface=ether1-Internet action=masquerade

# Block Murid to Guru
/ip firewall filter
add chain=forward src-address=10.10.20.0/24 dst-address=10.10.10.0/24 action=drop comment="Block Murid to Guru"

# Accept Server to Guru
add chain=forward src-address=10.10.30.0/24 dst-address=10.10.10.0/24 action=accept comment="Allow Server to Guru"

# DNS Security
add chain=input protocol=udp dst-port=53 in-interface=ether1-Internet action=drop comment="Secure DNS"
add chain=input protocol=tcp dst-port=53 in-interface=ether1-Internet action=drop comment="Secure DNS TCP"

# Brute Force Protection
add chain=input protocol=tcp dst-port=8291 src-address-list=blacklist action=drop comment="Drop Brute Force"
add chain=input protocol=tcp dst-port=8291 connection-state=new src-address-list=stage3 action=add-src-to-address-list address-list=blacklist address-list-timeout=1d
add chain=input protocol=tcp dst-port=8291 connection-state=new src-address-list=stage2 action=add-src-to-address-list address-list=stage3 address-list-timeout=1m
add chain=input protocol=tcp dst-port=8291 connection-state=new src-address-list=stage1 action=add-src-to-address-list address-list=stage2 address-list-timeout=1m
add chain=input protocol=tcp dst-port=8291 connection-state=new action=add-src-to-address-list address-list=stage1 address-list-timeout=1m

# Logging
add chain=forward action=log log-prefix="FW-FORWARD" comment="Log Forward"`
    },
    {
        id: 4,
        name: 'IP Services & Security',
        filename: 'ip-services.rsc',
        type: 'rsc',
        description: 'Konfigurasi port service: Winbox, SSH, Telnet, HTTP dan user management.',
        tags: ['Services', 'Security'],
        size: '1.2 KB',
        date: '2026-02-10',
        content: `# IP Services Configuration
# ================================

# Change default ports
/ip service
set winbox port=8291
set ssh port=2222
set telnet port=2323
set www port=8080
set api disabled=yes
set api-ssl disabled=yes
set ftp disabled=yes

# User Management
/user
add name=server group=full password=server123
add name=guru group=read password=guru123

# Interface & Neighbor List
/interface list
add name=LAN
add name=WAN
/interface list member
add interface=ether2-Guru list=LAN
add interface=ether3-Murid list=LAN
add interface=ether4-Server list=LAN
add interface=ether1-Internet list=WAN

# MAC Server - Tools
/tool mac-server set allowed-interface-list=LAN
/tool mac-server mac-winbox set allowed-interface-list=LAN
/tool mac-server ping set enabled=yes`
    },
    {
        id: 5,
        name: 'Full Backup Script',
        filename: 'full-backup.txt',
        type: 'txt',
        description: 'Script lengkap semua konfigurasi MikroTik dalam satu file untuk backup/restore.',
        tags: ['Backup', 'Complete'],
        size: '8.5 KB',
        date: '2026-02-10',
        content: `# ================================
# FULL MIKROTIK BACKUP CONFIGURATION
# Generated: 2026-02-10
# ================================

# System Identity
/system identity set name="MikroTik-Router"

# Interface Renaming
/interface set ether1 name=ether1-Internet
/interface set ether2 name=ether2-Guru
/interface set ether3 name=ether3-Murid
/interface set ether4 name=ether4-Server

# IP Address Configuration
/ip address
add address=192.168.1.2/24 interface=ether1-Internet
add address=10.10.10.1/24 interface=ether2-Guru
add address=10.10.20.1/24 interface=ether3-Murid
add address=10.10.30.1/24 interface=ether4-Server

# Default Route
/ip route add dst-address=0.0.0.0/0 gateway=192.168.1.1

# DNS
/ip dns set servers=8.8.8.8,8.8.4.4 allow-remote-requests=yes

# DHCP Configuration (see dhcp-setup.rsc for details)
# Firewall Configuration (see firewall-rules.rsc for details)
# IP Services (see ip-services.rsc for details)

# End of Backup`
    }
];

// ============================================
// ADMIN LOGIN LOGIC
// ============================================
function isAdminSessionExpired() {
    const ts = localStorage.getItem(ADMIN_AUTH_TS_KEY);
    if (!ts) return true;
    return (Date.now() - parseInt(ts, 10)) > ADMIN_TIMEOUT;
}

function checkAdminAuth() {
    const isAuth = localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    if (isAuth && !isAdminSessionExpired()) {
        localStorage.setItem(ADMIN_AUTH_TS_KEY, Date.now().toString());
        showScriptPage();
    } else {
        localStorage.removeItem(ADMIN_AUTH_KEY);
        localStorage.removeItem(ADMIN_AUTH_TS_KEY);
        showAdminLogin();
    }
}

function showScriptPage() {
    document.getElementById('admin-login-overlay').classList.add('hidden');
    document.getElementById('scriptPage').classList.add('visible');
    renderScripts();
}

function showAdminLogin() {
    document.getElementById('admin-login-overlay').classList.remove('hidden');
    document.getElementById('scriptPage').classList.remove('visible');
}

function checkAdminLogin() {
    const u = document.getElementById('adminUsername').value.trim();
    const p = document.getElementById('adminPassword').value;
    const errDiv = document.getElementById('adminLoginError');

    if (!u || !p) {
        errDiv.innerHTML = '⚠️ Please enter both username and password';
        return;
    }

    const found = ADMIN_USERS.find(a => a.username === u && a.password === p);
    if (found) {
        localStorage.setItem(ADMIN_AUTH_KEY, 'true');
        localStorage.setItem(ADMIN_AUTH_TS_KEY, Date.now().toString());
        showScriptPage();
    } else {
        errDiv.innerHTML = '❌ Invalid admin credentials';
        document.getElementById('adminPassword').value = '';
        document.getElementById('adminPassword').focus();
    }
}

function adminLogout() {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    localStorage.removeItem(ADMIN_AUTH_TS_KEY);
    document.getElementById('adminUsername').value = '';
    document.getElementById('adminPassword').value = '';
    document.getElementById('adminLoginError').innerHTML = '';
    showAdminLogin();
}

// ============================================
// RENDER SCRIPTS
// ============================================
function renderScripts() {
    const grid = document.getElementById('scriptGrid');
    document.getElementById('totalScripts').textContent = MIKROTIK_SCRIPTS.length;

    const cats = [...new Set(MIKROTIK_SCRIPTS.flatMap(s => s.tags))];
    document.getElementById('totalCategories').textContent = cats.length;

    if (MIKROTIK_SCRIPTS.length === 0) {
        grid.innerHTML = '<div class="script-empty"><p>No scripts available yet.</p></div>';
        return;
    }

    const getIcon = (type) => {
        if (type === 'rsc') return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="m8 13 2 2 4-4"></path></svg>`;
        if (type === 'txt') return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>`;
        return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M12 18v-6"></path><path d="m9 15 3 3 3-3"></path></svg>`;
    };

    grid.innerHTML = MIKROTIK_SCRIPTS.map(script => `
        <div class="script-card">
            <div class="script-card-header">
                <div class="script-card-icon ${script.type}">
                    ${getIcon(script.type)}
                </div>
                <div class="script-card-info">
                    <h3>${script.name}</h3>
                    <span>${script.filename}</span>
                </div>
            </div>
            <p class="script-card-desc">${script.description}</p>
            <div class="script-card-tags">
                ${script.tags.map(t => `<span class="script-tag">${t}</span>`).join('')}
            </div>
            <div class="script-card-footer">
                <span class="script-size">${script.size} &bull; ${script.date}</span>
                <button class="download-btn" onclick="downloadScript(${script.id})">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    Download
                </button>
            </div>
        </div>
    `).join('');
}

// ============================================
// DOWNLOAD SCRIPT
// ============================================
function downloadScript(id) {
    const script = MIKROTIK_SCRIPTS.find(s => s.id === id);
    if (!script) return;

    const blob = new Blob([script.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = script.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ============================================
// THEME
// ============================================
function initScriptTheme() {
    const saved = localStorage.getItem('theme');
    const prefer = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', saved || (prefer ? 'dark' : 'light'));
}

function toggleScriptTheme() {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initScriptTheme();
    checkAdminAuth();

    document.getElementById('adminLoginForm').addEventListener('submit', e => {
        e.preventDefault();
        checkAdminLogin();
    });

    document.getElementById('adminLoginBtn').addEventListener('click', e => {
        e.preventDefault();
        checkAdminLogin();
    });

    // Clear error on input
    ['adminUsername', 'adminPassword'].forEach(id => {
        document.getElementById(id).addEventListener('input', () => {
            document.getElementById('adminLoginError').innerHTML = '';
        });
    });
});
