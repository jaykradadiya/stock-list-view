# Stage 1: Build the application
FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline

# Copying source code
COPY src ./src

# Build application
RUN mvn package -DskipTests

# Stage 2: Run the application
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY src ./src
COPY --from=build /app/target/stock-watch-app-0.0.1-SNAPSHOT.jar /app/stock-watch-app-0.0.1-SNAPSHOT.jar
EXPOSE 8080
CMD ["java", "-jar", "/app/stock-watch-app-0.0.1-SNAPSHOT.jar"]