# Stage 1: Build the Maven application
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Cache Maven dependencies before copying source code
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy sources and package the runnable jar
COPY src ./src
RUN mvn package -DskipTests

# Stage 2: Minimal runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the fat jar from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Security best practice: avoid running the container container processes as root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
