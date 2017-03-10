@echo off
:start
java -Xmx4096M -Xms1024M -XX:MaxPermSize=128M -jar spigot_1.10.2.jar -o true
if exists plugins\ShutdownNotice\restart (
    echo "Restarting server in 5 seconds..."
    timeout /t 5 /nobreak > NUL
    goto start
)
pause