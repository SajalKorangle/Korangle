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

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['localhost', '*']

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
    'id_card_app',
    'homework_app',
    'feature_app',

    'report_card_app',
    'report_card_app.report_card_cbse_app',
    'report_card_app.report_card_mp_board_app',

    'corsheaders',

    'django_extensions',

    'storages',

    'push_notifications',

    'django_cleanup.apps.CleanupConfig',

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


# Database
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
  )
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

import sys
if 'test' in sys.argv:
	DATABASES = {
		'default': {
			'ENGINE': 'django.db.backends.sqlite3',
			'USER': 'arnava',
			'NAME': os.path.join(BASE_DIR, 'test_database'),
			'TEST': {
				'NAME': 'test_database',
			},
		},
	}

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
    if 'test' in sys.argv:
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'USER': 'arnava',
                'NAME': os.path.join(BASE_DIR, current_branch+'_test_database'),
                'TEST': {
                    'NAME': current_branch+'_test_database',
                },
            },
        }

# AWS_ACCESS_KEY_ID = 'AKIAI36KL2QN3UUM4TWQ'
# AWS_SECRET_ACCESS_KEY = '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'
# AWS_STORAGE_BUCKET_NAME = 'korangle'
if current_branch != 'master':
    AWS_ACCESS_KEY_ID = 'AKIAIPISPZZVD4IAFVDA'
    AWS_SECRET_ACCESS_KEY = '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'
    AWS_STORAGE_BUCKET_NAME = 'korangletesting'
    AWS_QUERYSTRING_AUTH = False
    AWS_S3_SECURE_URLS = False # to use http instead of https
else:
    AWS_ACCESS_KEY_ID = 'AKIAIPISPZZVD4IAFVDA'
    AWS_SECRET_ACCESS_KEY = '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'
    AWS_STORAGE_BUCKET_NAME = 'korangleplus'
    AWS_QUERYSTRING_AUTH = False
    AWS_S3_SECURE_URLS = False # to use http instead of https
