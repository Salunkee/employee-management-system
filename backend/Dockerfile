# Java 26 runtime image
FROM eclipse-temurin:26-jre

WORKDIR /app

# Copy the already-built Spring Boot JAR
COPY build/libs/employee-management-0.0.1-SNAPSHOT.jar app.jar

# Spring Boot port
EXPOSE 8080

# Start application
ENTRYPOINT ["java", "-jar", "app.jar"]