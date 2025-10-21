const fs = require("fs");
const path = require("path");

const envFile = path.join(__dirname, "src/environments/environment.ts");

// Read existing environment file
let existingEnv = {};
if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, "utf8");
  try {
    // Evaluate the object inside export
    const match = envContent.match(/export const environment = (.*);/s);
    if (match) {
      existingEnv = eval(`(${match[1]})`);
    }
  } catch (err) {
    console.error("Error parsing environment.ts:", err);
  }
}

const isDockerBuild = process.env.DOCKER === "true";
let socketHost = "localhost";
if (!isDockerBuild) {
  const os = require("os");
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        socketHost = iface.address;
        break;
      }
    }
  }
}

// Merge the dynamic values with existing ones
const newEnv = {
  ...existingEnv,
  socketUrl: `ws://${socketHost}:3000`,
};

// Write back to environment.ts
const fileContent = `export const environment = ${JSON.stringify(
  newEnv,
  null,
  2
)};`;
fs.writeFileSync(envFile, fileContent, "utf8");
console.log(`Your ${isDockerBuild ? 'docker ':''}socket host is: ${socketHost}`);
