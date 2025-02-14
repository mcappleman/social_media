# Use an official Node.js runtime as a parent image
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app
RUN npm run build

# Production image, copy built assets and start server
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Install only production dependencies
RUN npm install --omit=dev

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]