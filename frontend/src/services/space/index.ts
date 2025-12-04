import { type Space } from "./Space";
import { type Monad } from "../../types/Monad";

import { isAxiosError } from "axios";

import spaceApi from "./client";

// const MOCKED_SPACES: Space[] = [
//   {
//     id: "1",
//     status: false,
//     created_at: new Date(),
//     updated_at: new Date(),
//   },
//   {
//     id: "2",
//     status: true,
//     created_at: new Date("2025-01-01T08:30:00Z"),
//     updated_at: new Date("2025-01-02T09:00:00Z"),
//   },
//   {
//     id: "3",
//     status: false,
//     created_at: new Date("2025-01-03T10:15:00Z"),
//     updated_at: new Date("2025-01-04T11:20:00Z"),
//   },
//   {
//     id: "4",
//     status: true,
//     created_at: new Date("2025-01-05T12:00:00Z"),
//     updated_at: new Date("2025-01-06T12:30:00Z"),
//   },
//   {
//     id: "5",
//     status: false,
//     created_at: new Date("2025-01-07T13:45:00Z"),
//     updated_at: new Date("2025-01-08T14:00:00Z"),
//   },
//   {
//     id: "6",
//     status: true,
//     created_at: new Date("2025-01-09T15:10:00Z"),
//     updated_at: new Date("2025-01-10T15:40:00Z"),
//   },
//   {
//     id: "7",
//     status: false,
//     created_at: new Date("2025-01-11T16:25:00Z"),
//     updated_at: new Date("2025-01-12T16:50:00Z"),
//   },
//   {
//     id: "8",
//     status: true,
//     created_at: new Date("2025-01-13T17:05:00Z"),
//     updated_at: new Date("2025-01-14T17:30:00Z"),
//   },
//   {
//     id: "9",
//     status: false,
//     created_at: new Date("2025-01-15T18:00:00Z"),
//     updated_at: new Date("2025-01-16T18:20:00Z"),
//   },
//   {
//     id: "10",
//     status: true,
//     created_at: new Date("2025-01-17T19:10:00Z"),
//     updated_at: new Date("2025-01-18T19:40:00Z"),
//   },
// ];

export type SpaceApiError =
  | { code: "NETWORK_ERROR" }
  | { code: "SPACE_NOT_FOUND" }
  | { code: "INTERNAL_SERVER_ERROR"; message: string; error: unknown };

export const getAllSpaces = async (): Promise<
  Monad<SpaceApiError, Space[]>
> => {
  try {
    const response = await spaceApi.get("/vagas");

    if (!response.data || !response.data.ok) {
      return {
        left: {
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Não foi encontrado o corpo da requisição ou o campo ok no corpo da requisição.",
          error: response,
        },
      };
    }

    return { right: response["data"].data };
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      if (!error.response || !error.response.status) {
        return {
          left: {
            code: "NETWORK_ERROR",
          },
        };
      }

      if (error.response.status === 400) {
        return { left: { code: "SPACE_NOT_FOUND" } };
      }
    }

    return { left: { code: "INTERNAL_SERVER_ERROR", error } };
  }
};
