source ~/virtual_environment/bin/activate
./manage.py wal_checkpoint
./manage.py migrate
./manage.py wal_checkpoint
deactivate
