# Docker Feathers React and MaterialUI

Boilerplate code for a simple web app using [Docker](https://www.docker.com/), [FeathersJS](https://feathersjs.com/), [React](https://reactjs.org/), and [MaterialUI](https://material-ui.com/).

## Requirements

Download and install the docker community edition.

## Getting started

Bring up the database first:
```
docker-compose -f docker-compose.yml up -d --build postgres
```

Bring up the backend (API) and front-end (APP):
```
docker-compose -f docker-compose.yml up -d --build api app
```

Open up the browser to [localhost:4002](http://localhost:4002/)

View logs:
```
docker-compose -f docker-compose.yml logs --follow api app postgres
```

Open postgres database:
```
ocker-compose -f docker-compose.yml exec postgres psql -U project-name project-name
```

## Customization and Production deployment
Update `project-name` in the package.json and docker-compose yml files to desired project name.

For production deployment, assuming you have an SSL certificate and want to serve via HTTPS, update the `.env` to point the `API_BASE_URL` to your domain name and set the `API_PORT` to another port like `4003` so that we can have the server listen on `4001` instead.
```
#######################
# DOCKER CONFIGURATION #
########################

API_PORT=4003
APP_PORT=4002

```
Then update the `docker-compose.yml` to specify where the APP will look for the API. This will remain on the same initial port of `4001` where the server is listening.
```
app:
    build: ./app

    ...

    environment:
      - SPA_BASE_URL=<your-domain-name>:$APP_PORT
      - API_BASE_URL=<your-domain-name>:4001
      - INTERNAL_API_BASE_URL=http://api:8000
    ports:
      - "$APP_PORT:8000"
    entrypoint: node start.js

    ...

```


Then setup the nginx config (`/etc/nginx/sites-available/default`) to point incoming server requests to the backend and front-end respectively, example below:
```
server {
        listen 80;                                                                                                           
        server_name <your-domain-name>;
        location / {
          return 301 https://$server_name$request_uri/;
        }
}

server {
        listen 443 ssl;
        server_name <your-domain-name>;
        ssl_prefer_server_ciphers on;
        ssl_ciphers 'ECDH !aNULL !eNULL !SSLv2 !SSLv3';
        ssl_certificate /etc/nginx/certs/certificate.crt;
        ssl_certificate_key /etc/nginx/certs/privkey.pem;
        location / {
          proxy_pass http://localhost:4002;
        }
}

server {
        listen 4001 ssl;
        server_name <your-domain-name>;
        ssl_ciphers 'ECDH !aNULL !eNULL !SSLv2 !SSLv3';
        ssl_certificate /etc/nginx/certs/certificate.crt;
        ssl_certificate_key /etc/nginx/certs/privkey.pem;
        location / {
          proxy_pass http://localhost:4003;
        }
}
```

## Limitations
The current webpack version is slightly outdated and should be updated to version 4.
