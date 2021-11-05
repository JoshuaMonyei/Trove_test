// custom error class with  code
class ApiError extends Error {
    constructor(message, code) {
      super(message);
      this.code = code || 500;
    }
  }

  exports.ApiError = ApiError;
