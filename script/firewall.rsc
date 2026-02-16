# feb/15/2026 22:55:51 by RouterOS 6.49.17
# software id = S8R8-ZTKU
#
# model = RouterBOARD 941-2nD
# serial number = 66160518E906
/ip firewall filter
add action=drop chain=forward comment="Siswa Ke Guru" dst-address=\
    192.168.10.0/24 log=yes log-prefix="Siswa sedang ingin mengakses Guru" \
    src-address=192.168.20.0/24
add action=drop chain=input comment="Batasi akses DNS Port Siswa" dst-port=53 \
    in-interface=ether3-Siswa protocol=tcp
add action=drop chain=input dst-port=53 in-interface=ether3-Siswa protocol=\
    udp
add action=accept chain=forward comment="Server ke Guru" dst-address=\
    192.168.10.0/24 log=yes log-prefix="Server sedang mengakses Guru" \
    src-address=192.168.30.0/24
add action=drop chain=input comment="Aturan Blokir Brute Force" \
    connection-state=new dst-port=8299,222,233,800 log=yes log-prefix=\
    Terblokir protocol=tcp src-address-list="Peringatan 3"
add action=add-src-to-address-list address-list="Peringatan 3" \
    address-list-timeout=30m chain=input connection-state=new dst-port=\
    8299,222,233,800 log=yes log-prefix=Terblokir protocol=tcp \
    src-address-list="Peringatan 2"
add action=add-src-to-address-list address-list="Peringatan 2" \
    address-list-timeout=1m chain=input connection-state=new dst-port=\
    8299,222,233,800 protocol=tcp src-address-list="Peringatan 1"
add action=add-src-to-address-list address-list="Peringatan 1" \
    address-list-timeout=20s chain=input connection-state=new dst-port=\
    8299,222,233,800 protocol=tcp
add action=log chain=forward comment=\
    "Mencatat aktivitas yang sedang mengakses Server" dst-address=\
    192.168.30.0/24 log-prefix="Trafik Destination Server"
