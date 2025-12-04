import type { FastifyPluginAsync } from "fastify";
import { SpaceRepo } from "./repository/SpaceRepository.js";
import { SpaceService } from "./services/SpaceService.js";
import { SpaceController } from "./controller/SpaceController.js";

export const spaceRouterPlugin: FastifyPluginAsync = async (fastify) => {
  const repository = new SpaceRepo();
  const service = new SpaceService(repository);
  const controller = new SpaceController(service);

  fastify.get("/vagas", controller.list.bind(controller));
  fastify.post("/vagas", controller.create.bind(controller));
  fastify.get<{ Params: { id: string } }>(
    "/vagas/:id",
    controller.getById.bind(controller),
  );
  fastify.delete<{ Params: { id: string } }>(
    "/vagas/:id",
    controller.delete.bind(controller),
  );
  fastify.put<{ Params: { id: string }; Body: { status: boolean } }>(
    "/vagas/:id",
    controller.updateStatus.bind(controller),
  );
};
