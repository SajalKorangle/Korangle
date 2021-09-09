# paste the following line in crontab file to run the script everyday at 2.30 am 
# 30 21 * * * sh ~/code/korangle/backend/update_app.sh

# changing directory is required to backend to access the database
cd ~/code/korangle/backend
# ignoring the output using /dev/null
# Code Review
# Wouldn't this run all those other jobs that are scheduled to run at some other point of time?
~/env/bin/python manage.py runjob notify_update_app > /dev/null 2>&1 &
