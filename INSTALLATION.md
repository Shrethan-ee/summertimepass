# Startup Idea Platform - Installation and Setup Guide

This guide provides step-by-step instructions for setting up and running the Startup Idea Platform backend.

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- PostgreSQL (recommended for production, SQLite for development)
- Virtual environment (recommended)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/startup-platform.git
cd startup-platform
```

### 2. Create and Activate Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

If the requirements.txt file doesn't exist, you can create it with the following content:

```
django==4.2.0
djangorestframework==3.14.0
djangorestframework-simplejwt==5.2.2
django-cors-headers==4.0.0
django-filter==23.1
psycopg2-binary==2.9.6
Pillow==9.5.0
```

### 4. Configure Database

#### For SQLite (Development)

The default configuration uses SQLite, which is fine for development. No additional setup is required.

#### For PostgreSQL (Production)

1. Create a PostgreSQL database:

```bash
sudo -u postgres psql
CREATE DATABASE startup_platform;
CREATE USER startup_user WITH PASSWORD 'your_password';
ALTER ROLE startup_user SET client_encoding TO 'utf8';
ALTER ROLE startup_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE startup_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE startup_platform TO startup_user;
\q
```

2. Update the database configuration in `startup_platform/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'startup_platform',
        'USER': 'startup_user',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### 5. Apply Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create Superuser

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin user.

### 7. Load Initial Data (Optional)

If you want to load sample data for testing:

```bash
python create_test_data.py
```

### 8. Run Development Server

```bash
python manage.py runserver 0.0.0.0:8000
```

The API will be available at `http://localhost:8000/api/`.

## Environment Variables

For production deployment, it's recommended to use environment variables for sensitive settings. Create a `.env` file in the project root:

```
SECRET_KEY=your_secret_key
DEBUG=False
ALLOWED_HOSTS=example.com,www.example.com
DATABASE_URL=postgres://user:password@localhost:5432/dbname
```

Then update `settings.py` to use these variables.

## Production Deployment

For production deployment, consider the following:

1. Use a production-ready web server like Gunicorn:

```bash
pip install gunicorn
gunicorn startup_platform.wsgi:application --bind 0.0.0.0:8000
```

2. Set up a reverse proxy with Nginx:

```nginx
server {
    listen 80;
    server_name example.com;

    location = /favicon.ico { access_log off; log_not_found off; }
    
    location /static/ {
        root /path/to/startup_platform;
    }

    location /media/ {
        root /path/to/startup_platform;
    }

    location / {
        include proxy_params;
        proxy_pass http://localhost:8000;
    }
}
```

3. Set up SSL with Let's Encrypt for secure HTTPS connections.

4. Configure Django for production:
   - Set `DEBUG = False`
   - Set appropriate `ALLOWED_HOSTS`
   - Use a strong `SECRET_KEY`
   - Configure proper logging

## API Documentation

After installation, you can access the API documentation:

- API Documentation: `/api/docs/`
- Admin Interface: `/admin/`

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Check database credentials
   - Ensure PostgreSQL service is running
   - Verify network connectivity to database server

2. **Migration Errors**:
   - Try resetting migrations: `python manage.py migrate --fake-initial`
   - Check for conflicting migrations

3. **Static Files Not Loading**:
   - Run `python manage.py collectstatic`
   - Check STATIC_ROOT and STATIC_URL settings

4. **Permission Issues**:
   - Ensure proper file permissions for media uploads
   - Check database user permissions

### Getting Help

If you encounter issues not covered in this guide, please:

1. Check the project's GitHub issues
2. Consult the Django and Django REST Framework documentation
3. Open a new issue with detailed information about your problem

## Next Steps

After installation, you might want to:

1. Customize the user model to fit your specific requirements
2. Add additional features to the API
3. Develop a frontend application to consume the API
4. Set up automated testing and CI/CD pipelines

