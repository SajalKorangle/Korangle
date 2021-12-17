# paste the following line in crontab file to run the script everyday at 12 pm
# 0 12 * * * sh ~/code/korangle/backend/cron_job_scripts/expiry_message_notification.sh

# changing directory is required to backend to access the database
cd ~/code/korangle/backend
# ignoring the output using /dev/null
~/env/bin/python manage.py runjob expiry_message_notification > /dev/null 2>&1 &