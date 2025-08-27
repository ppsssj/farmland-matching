# syntax=docker/dockerfile:1

FROM gradle:8.9-jdk21 AS build
WORKDIR /workspace
COPY gradlew ./
COPY gradle ./gradle
RUN chmod +x gradlew && ./gradlew --version

COPY build.gradle settings.gradle gradle.properties* ./
COPY src ./src

RUN ./gradlew clean bootJar -x test --no-daemon

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

ENV TZ=Asia/Seoul \
    JAVA_OPTS="" \
    SERVER_PORT=8080

COPY --from=build /workspace/build/libs/*.jar /app/app.jar
EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=3s --retries=10 \
  CMD wget -qO- http://127.0.0.1:8080/actuator/health || exit 1

ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]
