# Ornitools
A tool for uploading bird GPS position files and managing the visibility of the bird data.
## Description

This project allows users to upload bird GPS position files, view their information, and decide whether the bird data will be public or private. It includes a Django backend and a React + Next.js frontend. The project is configured with Docker to simplify setup and deployment.

## Installation

Clone & create this repo locally with the following command:

```bash
git clone https://github.com/jbtruffault/ornitools.git
cd ornitools
```

### Backend Setup

1. Navigate to the backend directory:

   ```sh
   cd backend
   ```

2. Install dependencies using Poetry:

   ```sh
   poetry install
   ```

3. Copy `.env-example` to `.env` and update the variables.

4. Run migrations and start the Django server:
   ```sh
   poetry run python manage.py migrate
   poetry run python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```sh
   cd frontend
   ```

2. Install dependencies using Bun:

   ```sh
   bun install
   ```

3. Start the development server:
   ```sh
   bun run dev
   ```

## Tech Stack + Features

### Backend (Django 5)

- [Django](https://www.djangoproject.com/) – High-level Python web framework
- [Django REST Framework](https://www.django-rest-framework.org/) – Powerful and flexible toolkit for building Web APIs
- JWT Authentication – Secure, token-based user authentication
- [Poetry](https://python-poetry.org/) – Dependency management and packaging made easy for Python

### Frontend (Next.js 14)

- [Next.js 14](https://nextjs.org/) – React framework for building performant apps with the best developer experience
- [TypeScript](https://www.typescriptlang.org/) – Typed superset of JavaScript
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework for rapid UI development
- [Shadcn UI](https://ui.shadcn.com/) – Re-usable components built using Radix UI and Tailwind CSS
- [Tanstack Query](https://tanstack.com/query/latest) – Powerful asynchronous state management for TS/JS
- [React Hook Form](https://react-hook-form.com/) – Performant, flexible and extensible forms with easy-to-use validation

### Development and Deployment

- [Docker](https://www.docker.com/) – Containerization platform for easy deployment and scaling
- [PostgreSQL](https://www.postgresql.org/) – Powerful, open-source object-relational database system


## Author

Created by Jean-Baptiste Truffault in 2025.

## License

[MIT License](https://opensource.org/licenses/MIT)
