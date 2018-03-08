current_branch=$(git rev-parse --abbrev-ref HEAD)
if [ ${current_branch} == 'master' ]
then
	cp db.sqlite3 test_database
else
	cp ${current_branch}_db.sqlite3 ${current_branch}_test_database
fi
./manage.py test --keepdb $1
