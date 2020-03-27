git branch -D reset_migration
git checkout -b reset_migration
cp db.sqlite3 reset_migration_db.sqlite3
./manage.py makemigrations
./manage.py migrate --fake school_app zero
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc"  -delete
find . -path "*/db_script/*.py"  -delete
find . -path "*/db_script/*.pyc"  -delete
./manage.py makemigrations
./manage.py migrate --fake-initial
