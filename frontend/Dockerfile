# Use official Node.js image for building
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json /app/
RUN npm install

RUN apt update
RUN apt install -y vim


# Copy the project files and build
COPY . /app/
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
# Use a lightweight image for serving
#FROM nginx:alpine

# Copy built files to Nginx
#COPY --from=builder /app/out /usr/share/nginx/html

# Expose port 80
#EXPOSE 80

# Default command to start Nginx
#CMD ["nginx", "-g", "daemon off;"]
