IP=$(hostname -I | awk '{print $1}')

echo "{
 \"IP\": \"$IP\"
}" > debug_ip.json