import { spawn } from 'node:child_process';

spawn('pnpm', ['run', 'start:api'], { stdio: 'inherit' });
spawn('pnpm', ['run', 'start:bot'], { stdio: 'inherit' });
