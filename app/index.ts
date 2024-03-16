import dotenv from "dotenv";
dotenv.config();
import * as redis from "redis";
import { createApp } from "./app";

const { PORT, REDIS_URL } = process.env;

if (!PORT) throw new Error("PORT is required");
if (!REDIS_URL) throw new Error("REDIS_URL is required");

const startServer = async () => {
  console.log("trying to start server");
  const client = redis.createClient({ url: REDIS_URL });
  await client.connect();

  const app = createApp(client);
  const server = app.listen(PORT, () => {
    console.log(`App listening at port ${PORT} go`);
  });

  return server;
};

const server = startServer();

const gracefulShutdown = async () => {
  const _server = await server;
  _server.close(()=> {
    console.log("graceful shutdown!");
    process.exit();
  });
};


process.on("SIGTERM", gracefulShutdown)

process.on("SIGINT", gracefulShutdown)