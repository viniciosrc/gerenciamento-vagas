import fastify from "fastify";
import { spaceRouterPlugin } from "./router.js";
import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import { socketPlugin } from "./socket.js";

const server = fastify();

await server.register(cors, {
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

await server.register(websocket);
await server.register(socketPlugin);
await server.register(spaceRouterPlugin, { prefix: "/api/spaces" });

export default server;
