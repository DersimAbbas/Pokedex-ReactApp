#Build stage
FROM node:22-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package.lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . . 

# Build the application
RUN npm run build

# Production stage
FROM nginx:stable-alpine AS prod

#removes default nginx index page
RUN rm -rf /usr/share/nginx/html/*
# Copy the built application from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# runs nginx in the foreground
EXPOSE 80 
CMD ["nginx", "-g", "daemon off;"]
