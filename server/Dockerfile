# syntax=docker/dockerfile:1

# Multi-stage builds example
# https://docs.docker.com/go/dockerfile-reference/
# https://docs.docker.com/guides/nodejs/develop/

ARG NODE_VERSION=20.17.0
FROM node:${NODE_VERSION}-alpine AS base

# Set working directory inside container
WORKDIR /usr/src/app

# Expose backend port
EXPOSE 3000

# =========================================
# Development Stage
# =========================================
FROM base AS dev
ENV NODE_ENV=development

# Copy package files first for dependency caching
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm ci --include=dev

# Run the application as a non-root user.
USER node

# Copy the rest of the source files into the image.
COPY . .

# Run the app in dev mode (your package.json should have a "dev" script)
CMD ["npm", "run", "dev"]

# =========================================
# Production Stage
# =========================================
FROM base AS prod
ENV NODE_ENV=production
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

USER node

COPY . .

# Start app (should match your package.json "prod" script)
CMD ["npm", "run", "prod"]
