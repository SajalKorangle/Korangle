IP=$(ipconfig getifaddr en0)

echo "{
 \"IP\": \"$IP\"
}" > src/main/assets/korangle/debug_ip.json
