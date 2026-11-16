
function logError(error, operation = "Unknown operation") {
    let errorType = "Application Error";
    let message = error.message;

    if (error.name === "ValidationError") {
        errorType = "Mongoose Validation Error";
    } 
    else if (error.name === "CastError") {
        errorType = "Mongoose Cast Error";
    } 
    else if (error.code === 11000) {
        errorType = "MongoDB Duplicate Key Error";
        message = "Duplicate value detected";
    }

    const errorDetails = {
        operation,
        errorType,
        message,
        timestamp: new Date().toISOString()
    };

    console.error(errorDetails);

    return errorDetails;
}

module.exports = logError;
