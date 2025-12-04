import "fastify";
import type { WebSocket } from "ws";

declare module "fastify" {
    interface FastifyInstance {
        broadcast: (data: Object) => void;
        sendMessageToSocket({ socket: WebSocket, content: Object }): void;
    }
}
