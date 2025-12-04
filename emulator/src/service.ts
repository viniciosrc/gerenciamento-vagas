import axios, { type AxiosInstance, isAxiosError } from "axios";

import type { Optional } from "./optional.js";
import Space from "./space.js";
import { handleAxiosError } from "./util.js";

export type ServiceError =
  | { code: "SPACE_NOT_FOUND"; message: string }
  | { code: "SPACE_ALREADY_EXISTS"; message: string }
  | { code: "NETWORK_ERROR"; message: string }
  | { code: "UNHANDLED_STATUS_CODE"; message: string; statusCode: number }
  | { code: "INTERNAL_SERVER_ERROR"; error: any; message: string };

class SpaceService {
  private readonly address: string;
  private readonly httpClientInstance: AxiosInstance;

  constructor(address: string) {
    this.address = address;
    this.httpClientInstance = axios.create({
      baseURL: this.address,
    });
  }

  public async createSpace(
    data: Omit<Space, "created_at" | "updated_at">,
  ): Promise<Optional<ServiceError, Space>> {
    try {
      const response = await this.httpClientInstance.post("/vagas", data);

      if (!response["data"].data) {
        return {
          left: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Could not find data field on response body",
            error: response,
          },
        };
      }

      return { right: response["data"].data };
    } catch (error: any) {
      if (isAxiosError(error)) {
        return handleAxiosError(error, {
          code: "SPACE_ALREADY_EXISTS",
          message: "Space already exists",
        });
      }

      return {
        left: {
          code: "INTERNAL_SERVER_ERROR",
          message: "unhandled error",
          error: error,
        },
      };
    }
  }

  public async updateSpaceStatus(data: {
    id: string;
    status: boolean;
  }): Promise<Optional<ServiceError, null>> {
    try {
      const response = await this.httpClientInstance.put(
        `/vagas/${data.id}`,
        data,
      );

      if (!response.data.ok) {
        return {
          left: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Could not update space status",
            error: response.data.error,
          },
        };
      }

      return { right: null };
    } catch (error: any) {
      if (isAxiosError(error)) {
        return handleAxiosError(error, {
          code: "SPACE_NOT_FOUND",
          message: "space not found, check if the id is valid",
        });
      }

      return {
        left: {
          code: "INTERNAL_SERVER_ERROR",
          message: "internal server error",
          error: error,
        },
      };
    }
  }

  public async getAllSpaces(): Promise<Optional<ServiceError, Space[]>> {
    try {
      const response = await this.httpClientInstance.get("/vagas");

      if (!response.data.ok) {
        return {
          left: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Could not find ok field on response body as true",
            error: response,
          },
        };
      }

      return { right: response["data"].data };
    } catch (error) {
      if (isAxiosError(error)) {
        return handleAxiosError(error, {
          code: "SPACE_NOT_FOUND",
          message: "there is no space created",
        });
      }

      return {
        left: {
          code: "INTERNAL_SERVER_ERROR",
          error,
          message: "Unhandled error, check the logs",
        },
      };
    }
  }
}

export default SpaceService;
