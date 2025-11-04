import { AppError } from "../../errors/AppError";
import { 
  NotFoundDomainError, 
  ValidationDomainError, 
  BusinessRuleDomainError 
} from "../../../domain/errors/DomainError";
import { 
  RepositoryError, 
  ConfigError, 
  DatabaseError, 
  CacheError 
} from "../../errors/InfrastructureError";
import type { ErrorHandler } from "elysia";

export const errorHandler: ErrorHandler  = ({ code, error, set, path }) => {
  console.error("Error Handler Middleware:", { code, path, error });

  // Маппинг доменных ошибок → HTTP ошибки
  if (error instanceof NotFoundDomainError) {
    set.status = 404;
    return {
      error: {
        code: "NOT_FOUND",
        message: error.message,
      },
    };
  }

  if (error instanceof ValidationDomainError) {
    set.status = 400;
    return {
      error: {
        code: "VALIDATION_ERROR",
        message: error.message,
      },
    };
  }

  if (error instanceof BusinessRuleDomainError) {
    set.status = 400;
    return {
      error: {
        code: "BAD_REQUEST",
        message: error.message,
      },
    };
  }

  // Маппинг инфраструктурных ошибок → HTTP ошибки
  if (error instanceof RepositoryError || 
      error instanceof DatabaseError || 
      error instanceof ConfigError || 
      error instanceof CacheError) {
    set.status = 500;
    return {
      error: {
        code: error.code || "INTERNAL_SERVER_ERROR",
        message: process.env.NODE_ENV === "production" 
          ? "Internal server error" 
          : error.message,
      },
    };
  }

  // Обработка HTTP ошибок (AppError)
  if (error instanceof AppError) {
    set.status = error.statusCode;
    return {
      error: {
        code: error.code || "APP_ERROR",
        message: error.message,
      },
    };
  }

  // Обработка Elysia validation errors
  if (code === "VALIDATION") {
    set.status = 400;
    return {
      error: {
        code: "VALIDATION_ERROR",
        message: error instanceof Error ? error.message : "Validation error",
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

  // Необработанные ошибки
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
