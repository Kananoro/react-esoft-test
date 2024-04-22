class ApiError extends Error {
	statusCode;
	isOperational;

	constructor(statusCode, message, isOperational = true, stack = "") {
		super(message);
		this.name = "ApiError";
		this.statusCode = statusCode;
		this.isOperational = isOperational;

		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
	}

	toJSON() {
		return {
			error: {
				name: this.name,
				message: this.message,
				statusCode: this.statusCode,
				isOperational: this.isOperational,
				stack: this.stack, // Можно добавить stacktrace, если нужно
			},
		};
	}
}

export default ApiError;
