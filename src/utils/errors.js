module.exports.ValidationError = class ValidationError extends Error {
  constructor(message, description) {
    super(message);
    this.name = "ValidationError";
    this.description = description;
    this.statusCode = 400;
  }
};

module.exports.NotFoundError = class NotFoundError extends Error {
  constructor(message, description) {
    super(message);
    this.name = "NotFoundError";
    this.description = description;
    this.statusCode = 404;
  }
};

module.exports.ConflictError = class ConflictError extends Error {
  constructor(message, description) {
    super(message);
    this.name = "ConflictError";
    this.description = description;
    this.statusCode = 409;
  }
};