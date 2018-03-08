dateVar=$(date +"%Y-%m-%d_%H:%M:%S")
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [ ${current_branch} == 'master' ]
then
    mv db.sqlite3 db.sqlite3.$dateVar
    scp -i ~/Documents/django_qlib_virginia.pem ubuntu@ec2-54-174-109-85.compute-1.amazonaws.com:/home/ubuntu/djangobeginners/db.sqlite3 ./db.sqlite3
else
    mv ${current_branch}_db.sqlite3 ${current_branch}_db.sqlite3.$dateVar
    scp -i ~/Documents/django_qlib_virginia.pem ubuntu@ec2-54-174-109-85.compute-1.amazonaws.com:/home/ubuntu/djangobeginners/db.sqlite3 ./${current_branch}_db.sqlite3
fi