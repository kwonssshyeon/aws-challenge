import request from "supertest";
import * as redis from "redis"
import { App } from "supertest/types";
import { LIST_KEY, RedisClient,createApp } from "./app";


let app: App;
let client: RedisClient

const REDIS_URL = "redis://localhost:6380"


beforeAll(async () => {
    client = redis.createClient({url:REDIS_URL});
    await client.connect();
    app = createApp(client);
});

beforeEach(async () => {
    await client.flushDb();
})

describe("POST /messages", () => {
    it("response with a success message", async () => {
        const response = await request(app)
            .post("/messages")
            .send({message:"testing with redis"});

        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("Message added to list");

    });
});


describe("GET /message" , () => {
    it("response with a success message", async () => {
        await client.lPush(LIST_KEY,["msg1","msg2"]);
        const response = await request(app)
            .get("/messages")
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(["msg2","msg1"]);
    });
});