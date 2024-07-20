# Java Spring Boot Backend (stock-watch-app)

This directory contains the backend Java Spring Boot application for Stock Watch App.

## Prerequisites

- JDK (Java Development Kit) installed on your machine.
- Maven installed on your machine (for dependency management).
- Docker installed on your machine (for Docker Compose).

## Setup

1. Navigate to the stock-watch-app directory.
   ```shell 
    cd stock-watch-app 
    ```
2. Build the Docker image for the application.
   ```shell 
    docker-compose build
    ```
3. Start the application using Docker Compose.
   ```shell 
    docker-compose up
   ```

Docker Compose will start the Spring Boot application and any necessary services defined in the docker-compose.yml file.

The backend will be accessible at http://localhost:8080.


## Stopping the Application
To stop the application and remove containers:
```shell
docker-compose down
```


Make sure to adjust paths and commands based on your specific project structure and Docker Compose setup. This README file provides clear instructions on how to set up and run your Java Spring Boot application using Docker Compose.