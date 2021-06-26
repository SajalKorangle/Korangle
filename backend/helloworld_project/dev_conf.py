# dev/testing specific config


import os

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
if current_branch != 'master':
    print('Branch: '+current_branch)
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(BASE_DIR, current_branch+'_db.sqlite3'),
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        }
    }

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

CASHFREE_APP_ID = '7711077de8a62744b7e8fd49e01177'
CASHFREE_SECRET_KEY = 'f413afe54518d72141e192c5c5ea4bb303fe9192'
CASHFREE_CLIENT_ID = 'CF77110C325JSKPRI0BG442L6QG'
CASHFREE_CLIENT_SECRET = 'a73f719ef7835c46c673dffdd613acfdad31c98c'
CASHFREE_BASE_URL = 'https://test.cashfree.com'
######################################################