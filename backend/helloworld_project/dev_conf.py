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
#AWS_ACCESS_KEY_ID = 'AKIAIPISPZZVD4IAFVDA'
AWS_ACCESS_KEY_ID = 'AKIATTKSYDLKSRYDWSWJ'
#AWS_SECRET_ACCESS_KEY = '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'
AWS_SECRET_ACCESS_KEY = 'BadudGexRCR0Y426nsUHsMDjwcNYrwaJH511AUfj'
AWS_STORAGE_BUCKET_NAME = 'korangletesting'
AWS_QUERYSTRING_AUTH = False
AWS_S3_SECURE_URLS = False # to use http instead of https
AWS_S3_BASE_URL = 'https://korangletesting.s3.amazonaws.com/'


################## PAYMENT_GATEWAY ##################

## Korangle's Test Account ##
CASHFREE_APP_ID = '81239c70819e796eee892543e93218'
CASHFREE_SECRET_KEY = '222ddca8eb31e8ed7a41bfaa568089a50d30e72a'
CASHFREE_CLIENT_ID = 'CF81239C617UB7HBJS43OTETHC0'
CASHFREE_CLIENT_SECRET = '51ea9878530a59494c8da9052feb49d30d6b7bb4'
CASHFREE_BASE_URL = 'https://test.cashfree.com'
CASHFREE_VERIFICATION_SUITE_ENDPOINT = 'https://payout-gamma.cashfree.com'

## Aditya's TEST Account ##
# CASHFREE_APP_ID = '7711077de8a62744b7e8fd49e01177'
# CASHFREE_SECRET_KEY = 'f413afe54518d72141e192c5c5ea4bb303fe9192'
# CASHFREE_CLIENT_ID = 'CF77110C5JD3NNHBJS43OTETEN0'
# CASHFREE_CLIENT_SECRET = 'a125f1d589609adbed0f5b2890653c0fdc77cf35'

## EASEBUZZ TEST CREDENTIALS ##
EASEBUZZ_MERCHANT_KEY = "T7J9670H8B"
EASEBUZZ_SALT = "F8THDOZU1R"
EASEBUZZ_ENV = "prod" # `test` for test enviornment and `prod` for production

######################################################

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

TECHSUPPORT_EMAIL = "anurag@korangle.com"
