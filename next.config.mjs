import os from 'os';

const getLocalIPs = () => {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: getLocalIPs(),
};

export default nextConfig;
