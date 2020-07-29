module.exports.ValidationError = class ValidationError extends Error {
  constructor (message, description) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }

    this.name = "ValidationError";
    this.description = description;
    this.statusCode = 400;
  }
};

module.exports.NotFoundError = class NotFoundError extends Error {
  constructor (message, description) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }

    this.name = "NotFoundError";
    this.description = description;
    this.statusCode = 404;
  }
};

module.exports.ConflictError = class ConflictError extends Error {
  constructor (message, description) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ConflictError);
    }

    this.name = "ConflictError";
    this.description = description;
    this.statusCode = 409;
  }
};

module.exports.InternalError = class InternalError extends Error {
  constructor (message, description) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InternalError);
    }

    this.name = "InternalError";
    this.description = description;
    this.statusCode = 409;
  }
};
