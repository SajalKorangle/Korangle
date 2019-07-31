cd /Users/harshal/projects/django_backend
cp run_migration.sh newFile.sh
source ~/.virtualenvs/djangobeginners/bin/activate
./manage.py wal_checkpoint
./manage.py migrate
./manage.py wal_checkpoint
deactivate
