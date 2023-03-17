from .base import *

ALLOWED_HOSTS = ["supercchic.lesbiscuits.ca", "192.168.0.*", "127.0.0.1", "localhost", "10.0.0.*"]
DEBUG = False

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}