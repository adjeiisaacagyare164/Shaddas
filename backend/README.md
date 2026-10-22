# Deploy the Django API on Render

Deploy this folder as a separate Render Web Service. Keep the Angular frontend on Vercel.

## Render settings

- Root Directory: `backend`
- Runtime: Python
- Build Command: `bash build.sh`
- Start Command: `gunicorn core.wsgi:application`

Create a managed PostgreSQL database in Render and set the web service's `DATABASE_URL` to its internal connection string. Add these web-service environment variables:

- `DATABASE_URL`: Render PostgreSQL internal connection string
- `SECRET_KEY`: a long random secret value
- `DEBUG`: `False` (the production default; set `True` only in local development)
- `ALLOWED_HOSTS`: the backend hostname, without `https://` (for example, `shaddas-api.onrender.com`)
- `CORS_ALLOWED_ORIGINS`: the full Vercel frontend origin (for example, `https://shaddas.vercel.app`)
- `CSRF_TRUSTED_ORIGINS`: the same full Vercel frontend origin
- `JWT_SIGNING_KEY`: optional; if omitted, JWTs are signed with `SECRET_KEY`

The build script installs dependencies, collects static files, and applies migrations. After deployment, open the Render service Shell and run:

```sh
python manage.py createsuperuser
```

Use your own secure email and password. Do not run `seed_database` on a public production service because it creates demo content. If you choose to run it, provide `SEED_OWNER_PASSWORD` as a Render environment variable first; never print or commit that value.

## Connect Vercel frontend

Set `frontend/public/runtime-config.js` `apiUrl` to the backend URL ending in `/api`, for example:

```js
window.__SHADDAS_CONFIG__ = {
  apiUrl: 'https://shaddas-api.onrender.com/api'
};
```

Redeploy the frontend after changing the URL. The runtime file is public; do not put secrets in it.

## Local backend

From this folder, set `DEBUG=True` and a local `SECRET_KEY` in an ignored `.env` file, then activate your Python environment and run:

```sh
python manage.py migrate
python manage.py runserver
```
