const fs = require("fs");
const os = require("os");
const path = require("path");

const interfaces = os.networkInterfaces();
let localIp = "127.0.0.1";

for (const name of Object.keys(interfaces)) {
  for (const iface of interfaces[name]) {
    if (iface.family === "IPv4" && !iface.internal) {
      localIp = iface.address;
      break;
    }
  }
}

const envPath = path.join(__dirname, "src/environments/environment.ts");
const content = `export const environment = {
  production: false,
  socketUrl: 'ws://${localIp}:3000'
};\n`;

fs.writeFileSync(envPath, content);
console.log(`Your IP is: ${localIp}`);
