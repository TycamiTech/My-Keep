// ============================================
// NOTES DATA FILE
// ============================================
// Add new notes by copying the template below and adding to the array
// 
// Template:
// {
//   id: [unique number],
//   title: "Your Note Title",
//   date: "YYYY-MM-DD",
//   category: "Category Name",
//   content: `Your content here. Supports **markdown-like** formatting.`
// }

const notesData = [
  {
    id: 1,
    title: "Getting Started with Personal Notes",
    date: "2026-02-05",
    category: "Guide",
    content: `Welcome to Tyca notes website! This is a clean, minimalist space for organizing your thoughts and knowledge.

## How to Use

This website is designed for **simplicity** and **readability**. Here's what you can do:

- **Search**: Use the search bar to quickly find notes by title
- **Filter**: Click on categories in the sidebar to filter notes
- **Dark Mode**: Toggle between light and dark themes for comfortable reading

## Adding New Notes

To add a new note, simply edit the \`data/notes.js\` file and add a new object to the array. Each note should have:

1. A unique **id** number
2. A descriptive **title**
3. The **date** in YYYY-MM-DD format
4. A **category** for organization
5. Your **content** (supports basic formatting)

Happy note-taking!`
  },
  {
    id: 4,
    title: "Repositori Debian 12",
    date: "2026-02-05",
    category: "Server",
    content: `deb http://deb.debian.org/debian bookworm main contrib non-free non-free-firmware
deb http://deb.debian.org/debian bookworm-updates main contrib non-free non-free-firmware
deb http://security.debian.org/debian-security bookworm-security main contrib non-free non-free-firmware
deb http://deb.debian.org/debian bookworm-backports main contrib non-free non-free-firmware


deb http://kartolo.sby.datautama.net.id/debian/ bookworm main contrib non-free non-free-firmware
deb http://kartolo.sby.datautama.net.id/debian/ bookworm-updates main contrib non-free non-free-firmware
deb http://kartolo.sby.datautama.net.id/debian-security/ bookworm-security main contrib non-free non-free-firmware
deb http://kartolo.sby.datautama.net.id/debian/ bookworm-backports main contrib non-free non-free-firmware`
  },
  {
    id: 5,
    title: "Open SSL",
    date: "2026-02-05",
    category: "Server",
    content: `1. apt install apache2 openssl ssl-cert
2. cd /etc/apache2/sites-available
3. ls
4. cp default-ssl.conf webssl.conf 
5. nano webssl.conf
6. mkdir /etc/apache2/ssl
7. openssl req -x509 -newkey rsa:4096 -keyout /etc/apache2/ssl/apache.key -out /etc/apache2/ssl/apache.crt -nodes -days 365

# Country Name (2 letter code) [AU]:id
# State or Province Name (full name) [Some-State]:EAST JAVA
# Locality Name (eg, city) []:GRISA
# Organization Name (eg, company) [Internet Widgits Pty Ltd]:GRISA
# Organizational Unit Name (eg, section) []:TKJ
# Common Name (e.g. server FQDN or YOUR name) []:tycami
# Email Address []:admin@ryan.ukk

8. /usr/sbin/a2dissite 000-default.conf
9. /usr/sbin/a2dissite default-ssl.conf
10. /usr/sbin/a2ensite webssl.conf
11. /usr/sbin/a2enmod ssl
12. systemctl restart apache2
13. systemctl reload apache2`
  },
  {
    id: 6,
    title: "Zabbix",
    date: "2026-02-05",
    category: "Server",
    content: `1. cd /
2. wget https://repo.zabbix.com/zabbix/7.2/release/debian/pool/main/z/zabbix-release/zabbix-release_latest_7.2+debian12_all.deb
3. su -
4. cd /
5. dpkg -i zabbix-release_latest_7.2+debian12_all.deb
6. apt update
7. apt install zabbix-server-mysql zabbix-frontend-php zabbix-apache-conf zabbix-sql-scripts zabbix-agent
8. apt install mariadb-server


# Masuk Ke MariaDB
9. mysql -uroot -p 
# password 
10. create database zabbix character set utf8mb4 collate utf8mb4_bin;
11. create user zabbix@localhost identified by 'password'; 
12. grant all privileges on zabbix.* to zabbix@localhost; 
13. set global log_bin_trust_function_creators = 1; 
14. quit; 


15. zcat /usr/share/zabbix/sql-scripts/mysql/server.sql.gz | mysql --default-character-set=utf8mb4 -uzabbix -p zabbix 
# password
16. nano /etc/zabbix/zabbix_server.conf
# DBpassword=password
17. systemctl restart zabbix-server zabbix-agent apache2 
18. systemctl enable zabbix-server zabbix-agent apache2`
  },
  {
    id: 7,
    title: "OSI Layer",
    date: "2026-02-05",
    category: "Network",
    content: `# Host Layer
7. (4) Application : Data : SMTP, HTTP(S)/WWW, DNS, FTP, SSH, NTP, Layer 7 Protocol, Content.

6. (3) Presentation : Data : Enkripsi/Deskripsi : Translation : Compression and Decompression

5. (2) Session : Data [NetBios, PPTP] setengah-dupleks atau dupleks penuh (Dialog Control, Sinkronisasi)

4. (1) Transport : Segment : TCP : UDP(End to End Connection, Flow Control, Connection Control, Error Control, Load Balancer, Firewall)
 
# Media Layer
3. (3) Network : Packet : IP Address : ICMP [Router, Switch Multilayer] (Firewall, Address List, NAT, Routing, IPSec)

2. (2) Data Link : Frame : Mac Address : ARP [Switch] (Vlan, Bridge, NIC, WAP(Wireless Access Point), Ethernet, WI-FI, PPP(Point to Point Protocol, STP)

1. (1) Physical : Bit [Hub, Kabel, Repeater, Modem, NIC]`
  },
  {
    id: 8,
    title: "MAC Address",
    date: "2026-02-05",
    category: "Network",
    content: `**Media Access Control Address.**
- Mac Address ditetapkan ke sebuah kartu jaringan.
- Pada lapisan data link (Layer 2).
- MAC Address memiliki panjang 48-bit.
- MAC terdiri atas 16 digit bilangan Heksadesimal.
- 6 digit pertama merepresentasikan Vendor Pembuat Kartu Jaringan.`
  },
  {
    id: 9,
    title: "IP Address",
    date: "2026-02-05",
    category: "Network",
    content: `**Internet Protocol** digunakan untuk komunikasi antar perangkat jaringan.
Terdapat pada Network Layer (Layer 3).

## IPv4 
- Pengalaman 32 bit
- Terbagi menjadi 4 Oktet
- Setiap Oktet terdapat 8 bit
- Jumlah max IP 4.294.967.296

## IPv6
- Pengalaman 128 bit
- Terbagi menjadi 8 Oktet
- Setiap Oktet terdapat 16 bit
- Jumlah max IP 340.282.366.920.938.463.463.374.607.431.768.211.456

## Kelas IPv4
- **Kelas A**: Network, Host, Host, Host
- **Kelas B**: Network, Network, Host, Host
- **Kelas C**: Network, Network, Network, Host

### IP Private Range:
- **Kelas A**: 10.0.0.0 - 10.255.255.255 (24-bit block)
- **Kelas B**: 172.16.0.0 - 172.31.255.255 (20-bit block)
- **Kelas C**: 192.168.0.0 - 192.168.255.255 (16-bit block)`
  },
  {
    id: 10,
    title: "Firewall",
    date: "2026-02-05",
    category: "Network",
    content: `## Pengertian Firewall
Firewall adalah sistem keamanan yang melindungi komputer kita dari berbagai ancaman di jaringan internet. Firewall bekerja sebagai sekat atau tembok yang membatasi komputer dari jaringan internet.

## Fungsi Firewall 
- Pelindung jaringan dari WAN (Internet) maupun LAN (Local).
- Melindungi dari network lain yang melewati router.
- Fitur firewall pada RouterOS: **IP > Firewall**.
- Basic Firewall: **IP > Firewall > Filter Rules**.

## Default Chain
Tiga aturan dasar packet flow: 
- **Input**: paket ke router.
- **Output**: paket dari router.
- **Forward**: paket melewati router.

## Firewall – IF (Condition) 
Prinsip **IF .... Then ....**
- **IF (Jika)**: paket memenuhi syarat kriteria yang kita buat.
- **Then (maka)**: action apa yang akan kita berikan ke paket tersebut. 

## Firewall Filter Actions
- **accept**: paket diterima (diizinkan).
- **drop**: paket ditolak tanpa pesan.
- **reject**: paket ditolak dengan pesan ICMP reject.
- **add-dst-to address-list**: alamat tujuan masuk ke address list group.
- **add-src-to address-list**: alamat asal masuk ke address list group.
- **log**: mencatat aktivitas paket dalam log khusus.
- **jump**: melempar paket ke custom chain spesifik.
- **fasttrack connection**: fitur speedboost traffic data.
- **tarpit**: membuka port bayangan agar seolah-olah aktif tapi tidak bisa diakses.`
  },
  {
    id: 11,
    title: "Firewall - NAT",
    date: "2026-02-05",
    category: "Network",
    content: `## Pengertian NAT
**NAT (Network Address Translation)** merupakan metode yang digunakan untuk menghubungkan banyak komputer ke jaringan Internet dengan menggunakan satu atau lebih alamat IP.

- NAT digunakan untuk ketersediaan alamat IP Public.
- Prinsip NAT sama seperti Filter Rule, bekerja dengan **"IF-THEN"**.

## Tipe NAT di MikroTik
### 1. Srcnat
Digunakan ketika client dari dalam router ingin keluar (Internet).
- **Masquerade**: Menghubungkan LAN ke internet menggunakan IP public dinamis.
- **Src-nat**: Menghubungkan LAN ke internet menggunakan IP public statis.

### 2. Dstnat
Digunakan ketika client di internet ingin mengakses jaringan lokal.
- **Dst-nat**: Digunakan untuk port forwarding (mengakses LAN dari internet).
- **Redirect**: Membelokkan traffic ke router itu sendiri (Hotspot, WebProxy, DNS router).

## Action pada NAT
- **netmap**: Pemetaan 1:1 statis untuk blok IP (Public ke Private).
- **accept**: Menghentikan pemrosesan NAT, paket keluar tanpa perubahan alamat.
- **log**: Mencatat informasi paket ke log sistem.
- **add-src-to-address-list**: Menambahkan IP sumber ke address list dinamis.
- **add-dst-to-address-list**: Menambahkan IP tujuan ke address list dinamis.
- **jump**: Mengalihkan paket ke custom chain lain.
- **return**: Kembali ke chain asal setelah jump.
- **passthrough**: Hanya menghitung statistik, lanjut ke rule berikutnya.
- **same**: Memastikan koneksi dari IP private yang sama dipetakan ke IP public yang sama.`
  },
  {
    id: 12,
    title: "Simple Queue",
    date: "2026-02-05",
    category: "Network",
    content: `Simple Queue MikroTik adalah metode termudah untuk manajemen bandwidth (upload/download) berdasarkan IP address atau interface, cocok untuk jaringan kecil-menengah.

## Konfigurasi Dasar
Melibatkan penentuan Target Address (IP klien), Max Limit (kecepatan maksimal), dan antrian dua arah (bi-directional) untuk stabilitas jaringan.

### Parameter Queue:
- **Max Limit**: Maksimal bandwidth.
- **Burst Limit**: Bandwidth melebihi Max Limit dalam waktu beberapa saat.
- **Burst Threshold**: Menentukan kapan Burst Limit akan aktif ketika Bandwidth berjalan di bawah/di atas rata-rata Burst Threshold.
- **Burst Time**: Waktu berjalannya Burst Limit.

## Advanced Settings
- **Limit At**: Batas Minimum Bandwidth yang didapat ketika Total Bandwidth parent terpenuhi.
- **Parent**: Pengelompokan dari Simple Queue yang dibuat / Total Bandwidth.
- **Priority**: Eksekusi perintah dijalankan sesuai dengan urutan Priority.`
  },
  {
    id: 13,
    title: "TCP (Transmission Control Protocol)",
    date: "2026-02-05",
    category: "Network",
    content: `Protokol komunikasi standar yang memastikan pengiriman data yang andal dan teratur di jaringan komputer, seperti internet. 

## Cara Kerja
TCP memecah data menjadi paket-paket kecil, mengatur koneksi antar perangkat, memverifikasi pengiriman, dan menyusun kembali data di sisi penerima.

## Fitur Utama
- **Connection Oriented**: Membangun koneksi sebelum data dikirim.
- **Reliable Transmission**: Menjamin data sampai dengan benar.
- **Error Detection**: Mendeteksi kesalahan transmisi.
- **Flow Control**: Mengatur kecepatan aliran data.
- **Congestion Control**: Menangani kepadatan jaringan.

## Pengalamatan Port
- **Port 1-1024**: Low port (standard service port).
- **Port 1025...**: High port (untuk transmisi lanjutan).

**Contoh aplikasi**: HTTP, Email (SMTP), FTP.`
  },
  {
    id: 14,
    title: "UDP (User Datagram Protocol)",
    date: "2026-02-05",
    category: "Network",
    content: `Protokol transport yang menyediakan komunikasi data yang sederhana, cepat, dan **tanpa koneksi (connectionless)**.

## Karakteristik
- **Cepat & Latensi Rendah**: Cocok untuk aplikasi real-time.
- **Tanpa Negosiasi**: Tidak ada "handshake" sebelum kirim data.
- **Kehilangan Paket**: Mengorbankan keandalan demi kecepatan.
- **Efisiensi Tinggi**: Cocok untuk mengirim data kecil ke banyak host.

## Penggunaan
Biasanya digunakan untuk servis yang sensitif terhadap waktu:
- Streaming Video
- VoIP
- Game Online
- DNS (servis paling umum)`
  },
  {
    id: 15,
    title: "ICMP (Internet Control Message Protocol)",
    date: "2026-02-05",
    category: "Network",
    content: `Protokol yang digunakan untuk pengiriman pesan kontrol dan pengecekan jaringan.

## Prinsip Kerja
Host (router atau tujuan) akan mendeteksi permasalahan transmisi dan membuat **"ICMP message"** yang dikirimkan kembali ke host asal.

## Karakteristik
- **Best Effort**: Bisa terjadi error atau paket hilang (datagram lost).
- **Diagnostik**: Sangat berguna untuk troubleshooting jaringan.

## Aplikasi Umum
- **Ping**: Mengecek konektivitas antar host.
- **Traceroute**: Melacak jalur paket di jaringan.`
  },
  {
    id: 16,
    title: "Wireless Protocol",
    date: "2026-02-05",
    category: "Network",
    content: `Daftar standar protokol jaringan nirkabel IEEE 802.11:

| Standar | Frekuensi | Bandwidth | Max Speed |
|---------|-----------|-----------|-----------|
| **802.11a** | 5 GHz | 20 MHz | 54 Mbps |
| **802.11b** | 2.4 GHz | 20 MHz | 11 Mbps |
| **802.11g** | 2.4 GHz | 20 MHz | 54 Mbps |
| **802.11n** | 2.4/5 GHz | 20, 40 MHz | 450 Mbps |
| **802.11ac** | 5 GHz | 20-160 MHz | 1.3 Gbps |
| **802.11ax (Wi-Fi 6)** | 2.4/5 GHz | 20-160 MHz | 9.6 Gbps |
| **802.11be (Wi-Fi 7)** | 2.4/5/6 GHz | 20-320 MHz | 30 Gbps |`
  },
  {
    id: 17,
    title: "Netdata (Monitoring)",
    date: "2026-02-05",
    category: "Server",
    content: `Tools monitoring sistem real-time untuk server Linux.

## Langkah Instalasi:
1. \`apt install netdata\`
2. \`nano /etc/netdata/netdata.conf\`
3. Atur IP Address-nya (biasanya pada bind to)
4. \`systemctl restart netdata\`
5. \`systemctl status netdata\`
6. Buka monitoring di Browser: **IP-Address:19999**`
  },
  {
    id: 18,
    title: "FTP (File Transfer Protocol)",
    date: "2026-02-05",
    category: "Server",
    content: `Protokol untuk transfer file antar perangkat di jaringan.

## Langkah Instalasi (ProFTPD):
1. \`apt install proftpd\`
2. \`nano /etc/proftpd/proftpd.conf\`
3. Gunakan **FN + PgDown** untuk scroll ke bawah.
4. Tambahkan konfigurasi Anonymous:
\`\`\`apache
<Anonymous /ftp>
  User ryan
  UserAlias anonymous ryan
</Anonymous>
\`\`\`
5. \`cd /\`
6. \`mkdir ftp\`
7. \`cd /ftp\`
8. \`mkdir [nama_folder]\`
9. \`systemctl restart proftpd\`
10. \`systemctl status proftpd\`
11. Atur hak akses:
- \`chown -R user:user /ftp\`
- \`chmod -R 777 /ftp\``
  },
  {
    id: 19,
    title: "Tabel Subnetting",
    date: "2026-02-05",
    category: "Network",
    content: `Referensi lengkap Subnet Mask, Jumlah IP, dan Jumlah Host berdasarkan Prefix (CIDR).

## Subnet Mask Table

| Prefix | Subnet Mask | Jumlah IP | Jumlah Host |
|--------|-------------|-----------|-------------|
| **/0** | 0.0.0.0 | 4.294.967.296 | 4.294.967.294 |
| **/1** | 128.0.0.0 | 2.147.483.648 | 2.147.483.646 |
| **/2** | 192.0.0.0 | 1.073.741.824 | 1.073.741.822 |
| **/3** | 224.0.0.0 | 536.870.912 | 536.870.910 |
| **/4** | 240.0.0.0 | 268.435.456 | 268.435.454 |
| **/5** | 248.0.0.0 | 134.217.728 | 134.217.726 |
| **/6** | 252.0.0.0 | 67.108.864 | 67.108.862 |
| **/7** | 254.0.0.0 | 33.554.432 | 33.554.430 |

### KELAS A
| Prefix | Subnet Mask | Jumlah IP | Jumlah Host |
|--------|-------------|-----------|-------------|
| **/8** | 255.0.0.0 | 16.777.216 | 16.777.214 |
| **/9** | 255.128.0.0 | 8.388.608 | 8.388.606 |
| **/10** | 255.192.0.0 | 4.194.304 | 4.194.302 |
| **/11** | 255.224.0.0 | 2.097.152 | 2.097.150 |
| **/12** | 255.240.0.0 | 1.048.576 | 1.048.574 |
| **/13** | 255.248.0.0 | 524.288 | 524.286 |
| **/14** | 255.252.0.0 | 262.144 | 262.142 |
| **/15** | 255.254.0.0 | 131.072 | 131.070 |

### KELAS B
| Prefix | Subnet Mask | Jumlah IP | Jumlah Host |
|--------|-------------|-----------|-------------|
| **/16** | 255.255.0.0 | 65.536 | 65.534 |
| **/17** | 255.255.128.0 | 32.768 | 32.766 |
| **/18** | 255.255.192.0 | 16.384 | 16.382 |
| **/19** | 255.255.224.0 | 8.192 | 8.190 |
| **/20** | 255.255.240.0 | 4.096 | 4.094 |
| **/21** | 255.255.248.0 | 2.048 | 2.046 |
| **/22** | 255.255.252.0 | 1.024 | 1.022 |
| **/23** | 255.255.254.0 | 512 | 510 |

### KELAS C
| Prefix | Subnet Mask | Jumlah IP | Jumlah Host |
|--------|-------------|-----------|-------------|
| **/24** | 255.255.255.0 | 256 | 254 |
| **/25** | 255.255.255.128 | 128 | 126 |
| **/26** | 255.255.255.192 | 64 | 62 |
| **/27** | 255.255.255.224 | 32 | 30 |
| **/28** | 255.255.255.240 | 16 | 14 |
| **/29** | 255.255.255.248 | 8 | 6 |
| **/30** | 255.255.255.252 | 4 | 2 |
| **/31** | 255.255.255.254 | 2 | 0 (P2P Only) |
| **/32** | 255.255.255.255 | 1 | 0 (Single IP) |`
  },
  {
    id: 20,
    title: "Aktivasi Windows/Office",
    date: "2026-02-05",
    category: "Guide",
    content: `Metode aktivasi Windows dan Office menggunakan PowerShell (MAS - Microsoft Activation Scripts).

## Melalui PowerShell (Run as Administrator)

### Windows 8 / 10 / 11
Gunakan salah satu perintah di bawah ini:
1. \`irm https://get.activated.win | iex\`
2. \`iex (curl.exe -s --doh-url https://1.1.1.1/dns-query https://get.activated.win | Out-String)\`

### Windows 7
Gunakan perintah berikut:
\`\`\`powershell
iex ((New-Object Net.WebClient).DownloadString('https://get.activated.win'))
\`\`\``
  }
];

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = notesData;
}
