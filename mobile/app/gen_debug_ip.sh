IP=$(hostname -I | awk '{print $1}')

mkdir -p src/main/res/json

echo "{
 \"IP\": \"$IP\"
}" > src/main/res/json/debug_ip.json
