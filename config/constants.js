import process from 'node:process';

process.loadEnvFile();

export const PUBLIC_HOSTNAME = '127.0.0.1' || 'localhost'
export const PUBLIC_PORT = process.env.PUBLIC_PORT || 3000
export const WEB_TOKEN_SECRET_KEY = process.env.WEB_TOKEN_SECRET_KEY || 'k41Mvn3hsi45'
export const SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY || 'Jd32rhuhfIUFiuhefiwfFHUEaHDhg3qA'
