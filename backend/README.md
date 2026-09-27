# Deploy the Django API on Render

Deploy this folder as a separate Render Web Service. Keep the Angular frontend on Vercel.

## Render settings

- Root Directory: `backend` (use the repository root if this is already the service root)
- Runtime: Python
- Build Command: `pip install -r requirements.txt && python manage.py collectstatic --noinput`
- Start Command: `gunicorn core.wsgi:application --bind 0.0.0.0:$PORT`

Create a managed PostgreSQL database in Render and set the web service's `DATABASE_URL` to its internal connection string. Add these web-service environment variables:

- `SECRET_KEY`: a long random secret value
- `DEBUG`: `False`
- `ALLOWED_HOSTS`: the backend hostname, without `https://` (for example, `shaddas-api.onrender.com`)
- `CORS_ALLOWED_ORIGINS`: the full Vercel frontend origin (for example, `https://shaddas.vercel.app`)
- `CSRF_TRUSTED_ORIGINS`: the same full Vercel frontend origin

After deployment, open the Render service Shell and run:

```sh
python manage.py migrate
python manage.py createsuperuser
```

Use your own secure email and password. Do not run `seed_database` on a public production service because it creates a known demo login and sample store content.

## Connect Vercel frontend

Set `frontend/public/runtime-config.js` `apiUrl` to the backend URL ending in `/api`, for example:

```js
window.__SHADDAS_CONFIG__ = {
  apiUrl: 'https://shaddas-api.onrender.com/api'
};
```

Redeploy the frontend after changing the URL. The runtime file is public; do not put secrets in it.

## Local backend

From this folder, activate your Python environment and run:

```sh
python manage.py migrate
python manage.py runserver
```
