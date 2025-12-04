import { isAxiosError, AxiosError } from "axios";
import type { Optional } from "./optional.js";
import type { ServiceError } from "./service.js";

export const handleAxiosError = <T>(
  error: AxiosError,
  badRequestError: ServiceError,
): Optional<ServiceError, T> => {
  if (!error.response || !error.response.status) {
    return { left: { code: "NETWORK_ERROR", message: "Api is not reachable" } };
  }

  if (error.response.status === 400) {
    return { left: badRequestError };
  }

  return {
    left: {
      code: "UNHANDLED_STATUS_CODE",
      message: "Internal server error",
      statusCode: error.response.status,
    },
  };
};
