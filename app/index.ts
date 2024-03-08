import dotenv from "dotenv";
dotenv.config();
import * as redis from "redis";
import { createApp } from "./app";

const { PORT, REDIS_URL } = process.env;

if (!PORT) throw new Error("PORT is required");
if (!REDIS_URL) throw new Error("REDIS_URL is required");

const startServer = async () => {
  const client = redis.createClient({ url: REDIS_URL });
  await client.connect();

  const app = createApp(client);
  app.listen(PORT, () => {
    console.log(`App listening at port ${PORT}`);
  });
};

startServer();
