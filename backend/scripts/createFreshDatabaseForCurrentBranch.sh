branchName=`$activeBranch`
if [[ $branchName == master ]]; then
	echo 'All databases are copied from master. So, this script doesnt work on master branch'
else
	dropdb -h localhost -U postgres $branchName
	createdb -h localhost -U postgres -T master $branchName
	./manage.py migrate
fi
