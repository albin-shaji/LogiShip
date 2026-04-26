import { spawn } from 'child_process';
import os from 'os';

// Get the actual local network IP address
const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '0.0.0.0';
};

const ip = getLocalIP();

const child = spawn('npx', ['next', 'dev', '-H', '0.0.0.0', '--webpack'], {
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true,
  env: { ...process.env, FORCE_COLOR: '1' }
});

// Intercept stdout to replace 0.0.0.0 with the real IP
child.stdout.on('data', (data) => {
  let output = data.toString();
  if (output.includes('0.0.0.0')) {
    output = output.replace(/0\.0\.0\.0/g, ip);
  }
  process.stdout.write(output);
});

// Intercept stderr just in case
child.stderr.on('data', (data) => {
  let output = data.toString();
  if (output.includes('0.0.0.0')) {
    output = output.replace(/0\.0\.0\.0/g, ip);
  }
  process.stderr.write(output);
});

// Forward exit codes
child.on('exit', (code) => {
  process.exit(code || 0);
});
