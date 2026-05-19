-- Windows 启动脚本
@echo off
echo ================================
echo   wxcard-api 后端服务启动脚本
echo ================================

REM 检查Java
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到Java环境，请先安装JDK 1.8+
    pause
    exit /b 1
)

REM 设置MySQL密码（请修改为你的密码）
set MYSQL_PASSWORD=your_password

REM 初始化数据库
echo.
echo 正在初始化数据库...
mysql -u root -p%MYSQL_PASSWORD% < sql/init.sql
if %errorlevel% neq 0 (
    echo [警告] 数据库初始化失败，请手动执行 sql/init.sql
)

REM 启动服务
echo.
echo 正在启动服务...
java -jar target/wxcard-api-1.0.0.jar

pause
