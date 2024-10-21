FROM node:20 AS builder

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy only package.json and pnpm-lock.yaml to install dependencies
COPY package.json pnpm-lock.yaml ./

RUN pnpm install

# Copy all source files and build the project
COPY . .
RUN pnpm run build

# Production stage
FROM node:20 AS production

WORKDIR /app

RUN npm install -g pnpm

# Copy only the built output, content, public directory and package.json from the builder stage
# Note, we do not copy the original source files to make the final image smaller
COPY --from=builder /app/build ./build
COPY --from=builder /app/content ./content
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod

# Set environment variable and expose port
ENV NODE_ENV=production
EXPOSE 8080

# Start the app
CMD ["pnpm", "start"]
