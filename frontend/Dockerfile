FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install

# Copy all project files
COPY . .

# Start development server
CMD ["npm", "run", "dev"]