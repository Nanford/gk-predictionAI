import "dotenv/config";
import { buildApp } from "./app.js";
import { loadConfig } from "./config/env.js";

const config = loadConfig();
const app = await buildApp(config);

await app.listen({ host: config.apiHost, port: config.apiPort });
console.log(`GaoKao AI API is listening on http://${config.apiHost}:${config.apiPort}`);
