# Multi-stage builds example
# https://docs.docker.com/go/dockerfile-reference/
# https://docs.docker.com/guides/nodejs/develop/
# https://docs.docker.com/guides/angular/containerize/

# =========================================
# Stage 1: Base Setup
# =========================================

ARG NODE_VERSION=20.17.0
ARG NGINX_VERSION=alpine3.20

# ---------------------------
# Base build stage for both environments
# ---------------------------

FROM node:${NODE_VERSION} AS base
# Set working directory to the Angular root
WORKDIR /usr/src/app
# Copy only package files first
COPY package.json package-lock.json ./
# Install dependencies efficiently with cache
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .

# =========================================
# Stage 2: Development Server (ng serve)
# =========================================

FROM base AS dev
ENV NODE_ENV=development
EXPOSE 4200
CMD ["npm", "run", "dev"]


# =========================================
# Production Build (ng build + Nginx)
# =========================================
FROM base AS prod
ENV NODE_ENV=production
RUN npm run build --configuration production

# =========================================
# Prepare Nginx to Serve Static Files
# =========================================

FROM nginxinc/nginx-unprivileged:${NGINX_VERSION} AS runner
USER nginx

# Copy custom Nginx config (optional)
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the Angular build output
COPY --chown=nginx:nginx --from=build /usr/src/app/dist/* /usr/share/nginx/html

# Expose port 8080 to allow HTTP traffic
# Note: The default NGINX container now listens on port 8080 instead of 80 
EXPOSE 8080

# Start Nginx directly with custom config
ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf"]
CMD ["-g", "daemon off;"]