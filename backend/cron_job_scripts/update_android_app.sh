# paste the following line in crontab file to run the script everyday at 2.30 am 
# 30 21 * * * sh ~/code/korangle/backend/update_app.sh

# changing directory is required to backend to access the database
cd ~/code/korangle/backend
# ignoring the output using /dev/null
~/env/bin/python manage.py runjobs daily > /dev/null 2>&1 &
