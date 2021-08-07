echo $1
./manage.py dumpdata $1  -o "postgresql_migration/data/$1.json" -v 3