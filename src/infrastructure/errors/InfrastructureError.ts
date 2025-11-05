import { AppError } from "./AppError";

export class InfrastructureError extends AppError {
  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message, statusCode, code);
  }
}

export class RepositoryError extends InfrastructureError {
  constructor(message: string = "Repository error") {
    super(message, 500, "REPOSITORY_ERROR");
  }
}

export class ConfigError extends InfrastructureError {
  constructor(message: string = "Configuration error") {
    super(message, 500, "CONFIG_ERROR");
  }
}

export class DatabaseError extends InfrastructureError {
  constructor(message: string = "Database error") {
    super(message, 500, "DATABASE_ERROR");
  }
}

export class CacheError extends InfrastructureError {
  constructor(message: string = "Cache error") {
    super(message, 500, "CACHE_ERROR");
  }
}
