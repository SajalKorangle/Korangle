# prod specific config

<<<<<<< HEAD

import os

# import symbols from settings.py
try:
    from helloworld_project.settings import BASE_DIR
except ImportError:
    print("Error importing symbols from settings.py")
    exit()


# Database config
# https://docs.djangoproject.com/en/1.11/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        'CONN_MAX_AGE': None,
        'OPTIONS': {
            'timeout': 20,
        },
    }
}


# S3 Bucket config
=======
>>>>>>> 2b700b1a032862a0ebac5fcaa7dd51c771bcf1ec
AWS_ACCESS_KEY_ID = 'AKIAIPISPZZVD4IAFVDA'
AWS_SECRET_ACCESS_KEY = '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'
AWS_STORAGE_BUCKET_NAME = 'korangleplus'
AWS_QUERYSTRING_AUTH = False
AWS_S3_SECURE_URLS = False # to use http instead of https
