# Use Node 20 (safer than 18 for Vite v6+)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install deps first
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start the dev server
CMD ["npm", "run", "dev"]
