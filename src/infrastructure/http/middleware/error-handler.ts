import { AppError } from "../../errors/AppError";

export const errorHandler = ({ code, error, set, path }: any) => {
  console.error("Error Handler Middleware:", code, path);

  if (error instanceof AppError) {
    set.status = error.statusCode;
    return {
      error: {
        code: error.code || "APP_ERROR",
        message: error.message,
      },
    };
  }

  if (code === "VALIDATION") {
    set.status = 400;
    return {
      error: {
        code: "VALIDATION_ERROR",
        message:
          error instanceof Error ? error.message : "Validation error",
      },
    };
  }

  if (code === "NOT_FOUND" || code === 404) {
    set.status = 404;
    return {
      error: {
        code: "NOT_FOUND",
        message: "Resource not found",
      },
    };
  }

  console.error("Unhandled error:", error);
  set.status = 500;

  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : "Internal server error";

  return {
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : errorMessage,
    },
  };
};
