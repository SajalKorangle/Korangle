# paste the following line in crontab file to run the script everyday at 2.30 am 
# 30 2 * * * sh /path/to/korangle/backend/update_app.sh

# changing directory is required to backend to access the database
cd /path/to/korangle/backend
# ignoring the output using /dev/null
/path/to/virtual_venv/bin/python manage.py runjobs daily > /dev/null 2>&1 &
