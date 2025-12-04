import type { FastifyPluginAsync } from "fastify";
import type { WebSocket } from "ws";

import logger from "./logger.js";

import fp from "fastify-plugin";

const clients = new Set<WebSocket>();

const socketPluginAsync: FastifyPluginAsync = async (fastify) => {
  fastify.decorate(
    "sendMessageToSocket",
    ({ socket, content }: { socket: WebSocket; content: Object }) => {
      socket.send(JSON.stringify(content));
    },
  );

  fastify.decorate("broadcast", (data: Object) => {
    const payload = JSON.stringify(data);

    logger.debug(
      `Enviando mensagem para ${fastify.websocketServer.clients.size} cliente(s) conectado(s)`,
    );

    fastify.websocketServer.clients.forEach((client) => {
      // 1 é open
      if (client.readyState === 1) {
        logger.debug(`Enviando um broadcast para o cliente`);
        client.send(payload);
      }
    });
  });

  fastify.get("/", { websocket: true }, (socket: WebSocket) => {
    logger.info("+1 cliente conectado");
    clients.add(socket);

    fastify.sendMessageToSocket({
      socket,
      content: { message: "hello world" },
    });

    socket.on("close", () => {
      clients.delete(socket);
      console.log("client desconectado");
    });
  });
};

export const socketPlugin = fp(socketPluginAsync);
