# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install all dependencies (consider using `npm ci` in CI/CD for consistency)
# `npm install` allows development dependencies; safer for local dev workflows
RUN npm install

# Copy all project files into the container
COPY . .

# Ensure the Nest CLI binary is executable
RUN chmod +x ./node_modules/.bin/nest

# Compile TypeScript project to JavaScript
RUN npx nest build

# ---------- Stage 2: Production ----------
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install only production dependencies for smaller, safer image
RUN npm install --production

# Copy compiled app from builder stage
COPY --from=builder /app/dist ./dist

# Copy production-ready node_modules from builder stage
COPY --from=builder /app/node_modules ./node_modules

# Expose application port
EXPOSE 3000

# Command to start the application
CMD ["node", "dist/main"]
