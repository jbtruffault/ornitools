# Use the official Python 3.11 image as a base
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory inside the container
WORKDIR /app

# Copy the poetry configuration files
COPY pyproject.toml poetry.lock /app/

# Install Poetry
RUN pip install poetry

# Install dependencies
#COPY pyproject.toml poetry.lock /app/
COPY pyproject.toml /app/
RUN pip install poetry
RUN poetry config virtualenvs.create false
RUN poetry lock
RUN poetry install

RUN apt update
RUN apt install -y vim

# Copy the rest of your application code
COPY . /app/
RUN mkdir /app/media

#RUN python manage.py migrate

# Configurer Django environnement
ENV PYTHONUNBUFFERED=1 \
	DJANGO_SETTINGS_MODULE=core.settings \
    PORT=8000
    

# Expose application port
EXPOSE 8000

# Command to run the application
#CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
#CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
