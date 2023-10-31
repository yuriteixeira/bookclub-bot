import { spawn } from 'node:child_process';

spawn('node', ['./dist/src/run-api.js'], { stdio: 'inherit' });
spawn('node', ['./dist/src/run-bot.js'], { stdio: 'inherit' });
