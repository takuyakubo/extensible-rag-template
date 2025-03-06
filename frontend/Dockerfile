FROM node:18-alpine

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Copy all project files
COPY . .

# Start development server
CMD ["npm", "run", "dev"]