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
        name: 'Firewall Script',
        filename: 'firewall.rsc',
        type: 'rsc',
        description: 'Custom firewall script configurations.',
        tags: ['Firewall', 'Custom'],
        size: '1.7 KB',
        date: '2026-02-15',
        content: `# feb/15/2026 22:55:51 by RouterOS 6.49.17
# software id = S8R8-ZTKU
#
# model = RouterBOARD 941-2nD
# serial number = 66160518E906
/ip firewall filter
add action=drop chain=forward comment="Siswa Ke Guru" dst-address=\\
    192.168.10.0/24 log=yes log-prefix="Siswa sedang ingin mengakses Guru" \\
    src-address=192.168.20.0/24
add action=drop chain=input comment="Batasi akses DNS Port Siswa" dst-port=53 \\
    in-interface=ether3-Siswa protocol=tcp
add action=drop chain=input dst-port=53 in-interface=ether3-Siswa protocol=\\
    udp
add action=accept chain=forward comment="Server ke Guru" dst-address=\\
    192.168.10.0/24 log=yes log-prefix="Server sedang mengakses Guru" \\
    src-address=192.168.30.0/24
add action=drop chain=input comment="Aturan Blokir Brute Force" \\
    connection-state=new dst-port=8299,222,233,800 log=yes log-prefix=\\
    Terblokir protocol=tcp src-address-list="Peringatan 3"
add action=add-src-to-address-list address-list="Peringatan 3" \\
    address-list-timeout=30m chain=input connection-state=new dst-port=\\
    8299,222,233,800 log=yes log-prefix=Terblokir protocol=tcp \\
    src-address-list="Peringatan 2"
add action=add-src-to-address-list address-list="Peringatan 2" \\
    address-list-timeout=1m chain=input connection-state=new dst-port=\\
    8299,222,233,800 protocol=tcp src-address-list="Peringatan 1"
add action=add-src-to-address-list address-list="Peringatan 1" \\
    address-list-timeout=20s chain=input connection-state=new dst-port=\\
    8299,222,233,800 protocol=tcp
add action=log chain=forward comment=\\
    "Mencatat aktivitas yang sedang mengakses Server" dst-address=\\
    192.168.30.0/24 log-prefix="Trafik Destination Server"`
    },
    {
        id: 2,
        name: 'TikTok Mangle Add List',
        filename: 'tiktokaddlist.rsc',
        type: 'rsc',
        description: 'Layer7 protocols and Mangle rules for TikTok and Speedtest traffic separation.',
        tags: ['TikTok', 'Speedtest', 'Mangle', 'Layer7'],
        size: '1.8 KB',
        date: '2026-02-16',
        content: `# jan/16/2005 19:34:38 by RouterOS 7.9
# software id = 03FK-Q7XE
#
/ip firewall layer7-protocol
add name=SpeedTest regexp="^.+(speedtest-+[a-z0-9.]+[a-z]+.net.id|nflxvideo.ne\\
    t|ooklaserver.net|speedtestcustom.com|speedtest.net|fast.com|speedtest.+[a\\
    -z]+.id|openspeedtest.com|speedcheck.org|.speedtest.|.measurementlab.net|.\\
    measurement-lab.org|wifiman.com|.uwn.com|nperf.com|.nperf.|whatismyip.com|\\
    whatismyipaddress.com|.whatismyipaddress.com).*\$"
add name=TikTok regexp="^.*([\\.\\/-])(tiktok|tiktokcdn|tiktokv|ttwstatic|byte\\
    oversea|musical\\.ly|snssdk|ibytedtos|ibyteimg|p16-tiktokcdn|tiktok-pixel)\\
    ([\\.\\/-]).*\$"
/ip firewall address-list
add address=10.1.1.0/24 list="IP LOKAL"
add address=172.20.84.0/28 list="IP LOKAL"
add address=192.168.1.0/24 list="IP LOKAL"
add address=10.5.10.0/28 list="IP LOKAL"
/ip firewall mangle
add action=add-dst-to-address-list address-list=SpeedTest \\
    address-list-timeout=none-dynamic chain=prerouting comment=SpeedTest \\
    dst-address-list="!IP LOKAL" layer7-protocol=SpeedTest src-address-list=\\
    "IP LOKAL"
add action=mark-routing chain=prerouting dst-address-list=SpeedTest \\
    new-routing-mark=SpeedTest passthrough=no src-address-list="IP LOKAL"
add action=add-dst-to-address-list address-list=TikTok address-list-timeout=\\
    none-dynamic chain=prerouting comment=TikTok dst-address-list="!IP LOKAL" \\
    layer7-protocol=TikTok src-address-list="IP LOKAL"
add action=mark-routing chain=prerouting dst-address-list=TikTok \\
    new-routing-mark=TikTok passthrough=no src-address-list="IP LOKAL"
/ip firewall nat
add action=masquerade chain=srcnat out-interface=ether1-gopal
add action=masquerade chain=srcnat out-interface=ether2-indi
add action=masquerade chain=srcnat out-interface=WG-MAHAVIKRI
`
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
