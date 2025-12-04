import fastify from "fastify";

const app = fastify();

app.get("/ok", (_, reply) => {
  reply.send({ ok: true, message: "Hello world!" });
});

export default app;
