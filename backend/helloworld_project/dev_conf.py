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


################## PAYMENT_GATEWAY ##################

# CASHFREE_APP_ID = os.environ['CASHFREE_APP_ID']
# CASHFREE_SECRET_KEY = os.environ['CASHFREE_SECRET_KEY']
# CASHFREE_CLIENT_ID = os.environ['CLIENT_ID']
# CASHFREE_CLIENT_SECRET = os.environ['CLIENT_SECRET']

CASHFREE_APP_ID = '81239c70819e796eee892543e93218'
CASHFREE_SECRET_KEY = '222ddca8eb31e8ed7a41bfaa568089a50d30e72a'
CASHFREE_CLIENT_ID = 'CF81239C3JK5R2C1PP1SGR7N330'
CASHFREE_CLIENT_SECRET = '6dc68495d3d8ea67058c7ab565cacbf977e7e2c1'
CASHFREE_BASE_URL = 'https://test.cashfree.com'
######################################################