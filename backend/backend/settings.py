# backend/settings.py

import os
from pathlib import Path

# ===== BASE DIRECTORY =====
BASE_DIR = Path(__file__).resolve().parent.parent

# ===== SECRET KEY & DEBUG =====
# Use environment variables for production
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "django-insecure-default-key")
DEBUG = os.environ.get("DJANGO_DEBUG", "False") == "True"

# ===== ALLOWED HOSTS =====
ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
    "<your-render-backend>.onrender.com",  # Replace with your Render backend URL
]

# ===== INSTALLED APPS =====
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "rest_framework_simplejwt",
    "core",  # your app
]

# ===== MIDDLEWARE =====
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# ===== CORS =====
CORS_ALLOW_ALL_ORIGINS = True

# ===== REST FRAMEWORK =====
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    )
}

# ===== AUTH USER MODEL =====
AUTH_USER_MODEL = "core.User"

# ===== URL CONFIGURATION =====
ROOT_URLCONF = "backend.urls"

# ===== TEMPLATES =====
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# ===== WSGI & ASGI =====
WSGI_APPLICATION = "backend.wsgi.application"
ASGI_APPLICATION = "backend.asgi.application"

# ===== DATABASE =====
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# ===== PASSWORD VALIDATION =====
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ===== INTERNATIONALIZATION =====
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# ===== STATIC FILES =====
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"  # Production static files

# ===== DEFAULT PRIMARY KEY =====
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
