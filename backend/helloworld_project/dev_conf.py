# dev/testing specific config


# import symbols from settings.py
try:
    from helloworld_project.settings import BASE_DIR
except ImportError:
    print("Error importing symbols from settings.py")
    exit()


# default: DEBUG = True
DEBUG = True


# hosts config (allow inc. conn. from all hosts during debug)
ALLOWED_HOSTS = ['*']


# Database config
# https://docs.djangoproject.com/en/1.11/ref/settings/#databases
import subprocess

command = 'git rev-parse --abbrev-ref HEAD'
proc = subprocess.Popen(command,stdout=subprocess.PIPE,shell=True)
(out, err) = proc.communicate()
current_branch = str(out).rstrip("n'").rstrip('\\').lstrip("b").lstrip("'")
print('Branch: '+current_branch)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': current_branch,
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}


# DATABASE_ROUTERS =['postgresql_migration.db_router.MainDbRouter']

# S3 Bucket config
AWS_ACCESS_KEY_ID = 'AKIAIPISPZZVD4IAFVDA'
AWS_SECRET_ACCESS_KEY = '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'
AWS_STORAGE_BUCKET_NAME = 'korangletesting'
AWS_QUERYSTRING_AUTH = False
AWS_S3_SECURE_URLS = False # to use http instead of https

# Query Debug Info (for dev/testing)
QUERYCOUNT = {
    'THRESHOLDS': {
        'MEDIUM': 50,
        'HIGH': 200,
        'MIN_TIME_TO_LOG': 0,
        'MIN_QUERY_COUNT_TO_LOG': 0
    },
    'IGNORE_REQUEST_PATTERNS': [],
    'IGNORE_SQL_PATTERNS': [],
    'DISPLAY_DUPLICATES': None,
    'RESPONSE_HEADER': 'X-DjangoQueryCount-Count'
}

QUERYCOUNT = {
    'IGNORE_REQUEST_PATTERNS': [r'^/admin/']
}
