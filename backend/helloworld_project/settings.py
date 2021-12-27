"""
Django settings for helloworld_project project.

Generated by 'django-admin startproject' using Django 1.11.6.

For more information on this file, see
https://docs.djangoproject.com/en/1.11/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.11/ref/settings/
"""


import os
import datetime

import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration


sentry_sdk.init(
    dsn="https://eaa952693a9545d787e92662a961ea25@sentry.io/1437770",
    integrations=[DjangoIntegration()]
)

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

PROJECT_ROOT = os.path.abspath(os.path.dirname(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.11/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '59g0wy_6v_=f7l8getixb1b87!ee_^#lajh^zli2b+9zkvm0jw'

ALLOWED_HOSTS = ['localhost']

TEST_WITHOUT_MIGRATIONS_COMMAND = 'django_nose.management.commands.test.Command'

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',

    'test_without_migrations',

    'school_app',
    'class_app',
    'subject_app',
    'student_app',
    'expense_app',
    'fee_second_app',
    'fees_third_app',
    'examination_app',
    'team_app',
    'employee_app',
    'enquiry_app',
    'sms_app',
    'vehicle_app',
    'attendance_app',
    'salary_app',
    'user_app',
    'notification_app',
    'information_app',
    'grade_app',
    'id_card_app',
    'authentication_app',
    'homework_app',
    'feature_app',
    'tutorial_app',
    'event_gallery_app',
    'accounts_app',

    'report_card_app',
    'report_card_app.report_card_cbse_app',
    'report_card_app.report_card_mp_board_app',
    'errors_app',
    'tc_app',
    'online_classes_app',
    'payment_app',
    'activity_app',

    'corsheaders',

    'django_extensions',

    'storages',

    'push_notifications',

    'django_cleanup.apps.CleanupConfig',
    'rangefilter',

]

SILENCED_SYSTEM_CHECKS = ['fields.E300', 'fields.E307']

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # 'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'helloworld_project.urls'
AUTH_USER_MODEL = 'user_app.User'

DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'helloworld_project.wsgi.application'

# Password validation
# https://docs.djangoproject.com/en/1.11/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
]

REST_FRAMEWORK = {
	'DEFAULT_PERMISSION_CLASSES': (
		'rest_framework.permissions.IsAuthenticated',
	),
  'DEFAULT_AUTHENTICATION_CLASSES': (
    'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
    # 'rest_framework.authentication.BasicAuthentication',
    # 'rest_framework.authentication.SessionAuthentication',
    # 'rest_framework.authentication.TokenAuthentication',
  ),
  'COERCE_DECIMAL_TO_STRING': False,
}

JWT_AUTH = {
	'JWT_AUTH_HEADER_PREFIX': 'JWT',
	'JWT_REFRESH_EXPIRATION_DELTA': datetime.timedelta(days=1000),
	'JWT_EXPIRATION_DELTA': datetime.timedelta(days=1000),
}


# Internationalization
# https://docs.djangoproject.com/en/1.11/topics/i18n/
LANGUAGE_CODE = 'en-us'

# TIME_ZONE = 'UTC'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.11/howto/static-files/
STATIC_URL = '/static/'
MEDIA_URL = '/media/'
ENV_PATH = os.path.abspath(os.path.dirname(__file__))
MEDIA_ROOT = os.path.join(ENV_PATH, 'media/')
STATIC_ROOT = os.path.join(PROJECT_ROOT, 'static/')

DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'

PUSH_NOTIFICATIONS_SETTINGS = {
    "FCM_API_KEY": "AAAAKdpMXv4:APA91bFqo9G8GT8FELpCT7zsDTR9Whu4kZNOyQUaUo-HNqQwe7Jl2MxOLxGO8YPqaaeu_MjVM5uzzfcte7i32bgeXvlZFacSXAhGMFfUrLdzbJim11PyZ7tNmsdaBtaum1ieUHZdrs_3",
}

# the next monkey patch is necessary if you use dots in the bucket name
import ssl
if hasattr(ssl, '_create_unverified_context'):
    ssl._create_default_https_context = ssl._create_unverified_context


CORS_ORIGIN_ALLOW_ALL = True

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_VERIFICATION = True
EMAIL_USE_TLS = True
EMAIL_HOST = 'email-smtp.us-east-1.amazonaws.com'
DEFAULT_FROM_EMAIL = 'admin@iitcounseling.in'

EMAIL_HOST_USER = 'AKIAJALB2TZGPCWOEIQA'
EMAIL_HOST_PASSWORD = 'AqtgnMQN6VuP6cz9KOOX85r1UUCAR7NpH4xychXFJTBr'
EMAIL_PORT = 587



# AWS_ACCESS_KEY_ID = 'AKIAI36KL2QN3UUM4TWQ'
# AWS_SECRET_ACCESS_KEY = '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'
# AWS_STORAGE_BUCKET_NAME = 'korangle'

# Check running environment & load config
if ('KORANGLE_PRODUCTION' in os.environ) and (os.environ['KORANGLE_PRODUCTION'] == 'TRUE'):
    print("KORANGLE PRODUCTION")

    # korangle/backend/helloworld_project/prod_conf.py
    try:
        from helloworld_project.prod_conf import *
    except ImportError:
        print("ERROR!\nProduction Configuration File Not Found: korangle/backend/helloworld_project/prod_conf.py")
        exit()
elif ('KORANGLE_STAGING' in os.environ) and (os.environ['KORANGLE_STAGING'] == 'TRUE'):
    try:
        from helloworld_project.stag_conf import *
    except ImportError:
        print("ERROR!\nStaging Configuration File Not Found: korangle/backend/helloworld_project/stag_conf.py")
        exit()
else:
    print("KORANGLE DEVELOPMENT/TESTING")

    # korangle/backend/helloworld_project/dev_conf.py
    try:
        from helloworld_project.dev_conf import *
    except ImportError:
        print("ERROR!\nTesting Configuration File Not Found: korangle/backend/helloworld_project/dev_conf.py")
        exit()
    if 'KORANGLE_DB_LOG' in os.environ and os.environ['KORANGLE_DB_LOG'] == 'TRUE':
        MIDDLEWARE.append('querycount.middleware.QueryCountMiddleware')


# ZOOM
ZOOM_API_KEY = 'GY5heSVqQIWo8YGY_Patrg'
ZOOM_SECRET_KEY = 'trQY4s4DkL9GrB20JrInNY7A6ZmTJZ7G6fO0'
ZOOM_EMAIL_ID = 'korangleplus@gmail.com'
