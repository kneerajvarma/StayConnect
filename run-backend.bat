@echo off
echo Starting StayConnect Spring Boot Backend...
set JAVA_HOME=C:\Program Files\Java\jdk-24\java
cd "%~dp0backend"
call mvnw.cmd spring-boot:run
pause
