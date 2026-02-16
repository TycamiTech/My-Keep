# jan/16/2005 19:34:38 by RouterOS 7.9
# software id = 03FK-Q7XE
#
/ip firewall layer7-protocol
add name=SpeedTest regexp="^.+(speedtest-+[a-z0-9.]+[a-z]+.net.id|nflxvideo.ne\
    t|ooklaserver.net|speedtestcustom.com|speedtest.net|fast.com|speedtest.+[a\
    -z]+.id|openspeedtest.com|speedcheck.org|.speedtest.|.measurementlab.net|.\
    measurement-lab.org|wifiman.com|.uwn.com|nperf.com|.nperf.|whatismyip.com|\
    whatismyipaddress.com|.whatismyipaddress.com).*\$"
add name=TikTok regexp="^.*([\\.\\/-])(tiktok|tiktokcdn|tiktokv|ttwstatic|byte\
    oversea|musical\\.ly|snssdk|ibytedtos|ibyteimg|p16-tiktokcdn|tiktok-pixel)\
    ([\\.\\/-]).*\$"
/ip firewall address-list
add address=10.1.1.0/24 list="IP LOKAL"
add address=172.20.84.0/28 list="IP LOKAL"
add address=192.168.1.0/24 list="IP LOKAL"
add address=10.5.10.0/28 list="IP LOKAL"
/ip firewall mangle
add action=add-dst-to-address-list address-list=SpeedTest \
    address-list-timeout=none-dynamic chain=prerouting comment=SpeedTest \
    dst-address-list="!IP LOKAL" layer7-protocol=SpeedTest src-address-list=\
    "IP LOKAL"
add action=mark-routing chain=prerouting dst-address-list=SpeedTest \
    new-routing-mark=SpeedTest passthrough=no src-address-list="IP LOKAL"
add action=add-dst-to-address-list address-list=TikTok address-list-timeout=\
    none-dynamic chain=prerouting comment=TikTok dst-address-list="!IP LOKAL" \
    layer7-protocol=TikTok src-address-list="IP LOKAL"
add action=mark-routing chain=prerouting dst-address-list=TikTok \
    new-routing-mark=TikTok passthrough=no src-address-list="IP LOKAL"
/ip firewall nat
add action=masquerade chain=srcnat out-interface=ether1-gopal
add action=masquerade chain=srcnat out-interface=ether2-indi
add action=masquerade chain=srcnat out-interface=WG-MAHAVIKRI
