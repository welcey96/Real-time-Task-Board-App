# WebSocket Project Docker Guide

This guide outlines building and running Docker images and containers for your WebSocket project (frontend Angular client and backend Node.js server).

## 1️⃣ Build Docker Images

Each project (frontend/backend) should have its **own Dockerfile**, optionally multi-stage for dev/prod.

**Rebuild all images and containers (no need to individually delete)**
```
docker compose up --build -d
```

**Specific project (backend is the name of the config in yaml for the server app)**
```
docker compose up -d --build backend 
docker compose up -d --build frontend
```

**Example (build frontend image):**
```bash
docker build -t ws-frontend-dev --target dev -f Dockerfile.dev .
```

```-t ws-frontend-dev``` → gives the image a name/tag.

```--target dev```  → tells Docker to build up to the dev stage in your multi-stage Dockerfile.

``` -f Dockerfile.dev```  → specifies the Dockerfile (if it’s named Dockerfile.dev; otherwise just Dockerfile).

```.```  → build context (current directory).

## 2️⃣ Run Containers
```bash 
docker run -e DOCKER=true -p 4200:4200 --name ws-frontend ws-frontend-dev
```

```docker run``` →  starts a container from an image

```-e DOCKER=true``` → sets an environment variable inside the container ```(process.env.DOCKER)```

```-p 4200:4200```→ maps host port 4200 to container port 4200

```--name ws-frontend```→ container name for easier management

```ws-frontend-dev```→ the image to run

### Using Docker Compose (recommended)
- Compose will build images and run containers automatically.
- You can define environment variables for dev/prod and link services.

## 3️⃣ Environment Variables
- ```environment``` → directly sets variables like ```-e``` in ```docker run```

- ```env_file```:``` → reference ```.env``` files; useful for secrets or multiple variables

- Variables in ```environment``` override ```.env``` values

## 4️⃣ Multi-stage Dockerfiles
- Dev stage: runs ```npm run dev``` or ```ng serve``` for live reload

- Prod stage: builds the app (```ng build```) and serves with Nginx for frontend, plain ```node src/index.js``` for backend

### 5️⃣Hot Reload / Live Development
- Backend (Node.js)
```json
"dev": "env-cmd -f config/.env.dev nodemon --legacy-watch -e js src/index.js"
```

- Frontend (Angular)
```json
"start": "ng serve --host 0.0.0.0 --poll=2000 --disable-host-check"
```

## 6️⃣ Notes
- Frontend dev → port 4200, uses ```ng serve```

- Frontend prod → built with ```ng build``` and served via Nginx

- Backend dev/prod → port 3000, uses environment variables from ```.env``` or Compose

- Detect Docker in code: ```process.env.DOCKER```

- Networking:

    - ```localhost``` inside a container → refers to the container itself

    - To connect between containers → use service names ```(backend:3000)```

### References
* [Docker's Node.js guide](https://docs.docker.com/language/nodejs/)
* [Node.js Development with Docker](https://docs.docker.com/guides/nodejs/develop/)
* [Angular Containerization](https://docs.docker.com/guides/angular/containerize/)

This `.md` file now contains:  

- Full commands for building and running images  
- Docker Compose examples  
- Multi-stage Dockerfiles for frontend and backend  
- Explanations for environment variables and networking  
- Notes and references  
