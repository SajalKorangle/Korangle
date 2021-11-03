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
AWS_S3_SECURE_URLS = False  # to use http instead of https


################## PAYMENT_GATEWAY ##################

## Korangle's Test Account ##
CASHFREE_APP_ID = '81239c70819e796eee892543e93218'
CASHFREE_SECRET_KEY = '222ddca8eb31e8ed7a41bfaa568089a50d30e72a'
CASHFREE_CLIENT_ID = 'CF77110C4GV3B0SN97I76U3IBEG'
CASHFREE_CLIENT_SECRET = 'b9b7628a21efa2542ae99e91049421909d451f78'
CASHFREE_BASE_URL = 'https://test.cashfree.com'

## Aditya's TEST Account ##
# CASHFREE_APP_ID = '7711077de8a62744b7e8fd49e01177'
# CASHFREE_SECRET_KEY = 'f413afe54518d72141e192c5c5ea4bb303fe9192'
# CASHFREE_CLIENT_ID = 'CF77110C5JD3NNHBJS43OTETEN0'
# CASHFREE_CLIENT_SECRET = 'a125f1d589609adbed0f5b2890653c0fdc77cf35'
# CASHFREE_BASE_URL = 'https://test.cashfree.com'
######################################################
