echo $1
./manage.py loaddata "postgresql_migration/data/$1.json" --database postgresql -v 3