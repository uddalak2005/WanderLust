class ExpressError extends Error {
    constructor(status = 500, message = "Something went wrong", errorDetails = []) {
        super(message);
        this.status = status;
        this.message = message;
        this.errorDetails = errorDetails;
    }
}

module.exports = ExpressError;
