IP=$(hostname -I | awk '{print $1}')

echo "{
 \"IP\": \"$IP\"
}" > src/main/assets/korangle/debug_ip.json
