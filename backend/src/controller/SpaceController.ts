import type { FastifyRequest, FastifyReply } from "fastify";
import type { SpaceService } from "../services/SpaceService.js";
import type { CreateSpaceBody } from "../types/bodyType.js";

import logger from "../logger.js";

export class SpaceController {
    constructor(private readonly spaceService: SpaceService) {}

    public async create(
        request: FastifyRequest<{ Body: CreateSpaceBody }>,
        reply: FastifyReply,
    ) {
        const { body } = request;

        if (typeof body.id !== "string" || typeof body.status !== "boolean") {
            return reply
                .status(400)
                .send({ ok: false, message: "Invalid body" });
        }

        const space = await this.spaceService.createSpace(body);

        if ("right" in space) {
            return reply.status(400).send({ ok: false, message: space.right });
        }

        request.server.broadcast({
            type: "SPACE_CREATED",
            ...space.left,
        });

        return reply.status(201).send({ data: space.left });
    }

    public async getById(
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply,
    ) {
        const space = await this.spaceService.getSpaceById(request.params.id);

        if ("right" in space) {
            return reply.status(404).send({ ok: false, message: space.right });
        }

        request.server.broadcast({
            type: "SPACE_GETBYID",
            ...space.left,
        });

        return reply
            .status(200)
            .send({ ok: true, message: "ok", data: space.left });
    }

    public async updateStatus(
        request: FastifyRequest<{
            Params: { id: string };
            Body: { status: boolean };
        }>,
        reply: FastifyReply,
    ) {
        const { body } = request;

        if (typeof body.status !== "boolean") {
            return reply
                .status(400)
                .send({ ok: false, message: "Invalid body" });
        }

        const space = await this.spaceService.updateSpaceStatus(
            request.params.id,
            body.status,
        );
        if ("right" in space) {
            return reply.status(404).send({ ok: false, message: space.right });
        }

        logger.debug(
            "Emitindo evento para todos os clientes informando que o status de uma vaga foi atualizada",
        );
        request.server.broadcast({
            type: "SPACE_UPDATED",
            ...space.left,
        });

        return reply
            .status(200)
            .send({ ok: true, message: "ok", data: { ...space.left } });
    }

    public async delete(
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply,
    ) {
        const { params } = request;

        const space = await this.spaceService.deleteSpaceById(params.id);

        if ("right" in space) {
            return reply.status(404).send({ ok: false, message: space.right });
        }

        request.server.broadcast({
            type: "SPACE_DELETED",
            ...space.left,
        });

        return reply.status(200).send({ ok: true, message: "ok", data: {} });
    }

    public async list(request: FastifyRequest, reply: FastifyReply) {
        const spaces = await this.spaceService.getAll();

        if ("right" in spaces) {
            return reply.status(400).send({ ok: false, message: spaces.right });
        }

        return reply
            .status(200)
            .send({ ok: true, message: "ok", data: spaces.left });
    }
}
