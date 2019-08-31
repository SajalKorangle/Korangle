dateVar=$(date +"%Y-%m-%d_%H:%M:%S")
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [ ${current_branch} == 'master' ]
then
    mv db.sqlite3 prev_db
    scp -i ~/Documents/korangle.pem ubuntu@ec2-54-166-241-97.compute-1.amazonaws.com:/home/ubuntu/django_backend/db.sqlite3 ./db.sqlite3
    cp db.sqlite3 backupdb
else
    mv ${current_branch}_db.sqlite3 prev_db
    scp -i ~/Documents/korangle.pem ubuntu@ec2-54-166-241-97.compute-1.amazonaws.com:/home/ubuntu/django_backend/db.sqlite3 ./${current_branch}_db.sqlite3
    cp ${current_branch}_db.sqlite3 backupdb
fi
