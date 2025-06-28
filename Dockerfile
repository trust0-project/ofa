# Stage 1: Dependencies
FROM node:22
WORKDIR /app

# Enable corepack and set up Yarn
RUN corepack enable
RUN corepack prepare yarn@4.9.1 --activate

# Copy Yarn configuration files first
COPY .yarnrc.yml ./
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install
# Set environment variables

ARG MEDIATOR_DID
ARG PRISM_RESOLVER_URL
ARG BLOCKFROST_API_KEY

ENV MEDIATOR_DID=${MEDIATOR_DID}
ENV PRISM_RESOLVER_URL=${PRISM_RESOLVER_URL}
ENV BLOCKFROST_API_KEY=${BLOCKFROST_API_KEY}
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY . .

# Build the application
RUN yarn build
# Expose port
EXPOSE 3000

# Set environment variable for the port
ENV PORT=3000
# Start the application
CMD ["yarn", "start"] 