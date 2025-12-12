# --- Stage 1: Builder ---
# Use a specific Node version as the base image for the build stage.
FROM node:20-alpine AS builder

# Set the working directory to the monorepo root within the container

WORKDIR /app

COPY src/building-blocks/ src/building-blocks/
WORKDIR /app/src/building-blocks

RUN npm install

RUN npm run build

ARG SERVICE_PATH
WORKDIR /app/$SERVICE_PATH

# Copy the rest of the monorepo source code
COPY $SERVICE_PATH .

RUN npm install

RUN npm run build

CMD ["npm", "run", "start"]

# # --- Stage 2: Production Runner ---
# # Use a minimal, lightweight image for the final production environment
# FROM node:20-alpine AS runner

# # Set the working directory
# WORKDIR /app

# # ARG for the service path again (needed in this stage for directory structure)
# ARG SERVICE_PATH

# # Create a non-root user for security best practices
# # RUN addgroup --gid 1000 appgroup && adduser --uid 1000 --ingroup appgroup --shell /bin/sh appuser
# # USER appuser

# # Copy necessary files from the builder stage
# # 1. Copy the specific service's package.json (if present in the service dir)
# COPY --from=builder /app/$SERVICE_PATH/package.json ./package.json

# COPY --from=builder /app/building-blocks ./

# # 2. Re-install only production dependencies in the final image
# RUN npm install --only=production

# # 3. Copy the compiled application code (or source if no build step)
# # Adjust the source path based on where your app code ends up (e.g., /app/dist/$SERVICE_PATH)
# COPY --from=builder /app/$SERVICE_PATH ./

# # Expose the port your Express app listens on
# EXPOSE 3322

# # Define the command to run your application
# CMD ["npm", "run", "start"]
