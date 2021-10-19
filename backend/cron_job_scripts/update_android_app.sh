# paste the following line in crontab file to run the script everyday at 2.30 am 
# 30 21 * * * sh ~/code/korangle/backend/cron_job_scripts/update_app.sh

# changing directory is required to backend to access the database
cd ~/code/korangle/backend
# ignoring the output using /dev/null
~/env/bin/python manage.py runjob notify_update_app > /dev/null 2>&1 &
