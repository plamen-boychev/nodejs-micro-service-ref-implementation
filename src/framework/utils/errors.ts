/**
 * Custom error class
 * E.g. for a validation of form inputs
 */
export class Exception extends Error {

	public constructor(public message: string, public statusCode?: number, public code?: number) {
		super(message);
	}

	/**
	 * Converting to string - to be used in logs etc.
	 * @returns {string}
	 */
	public toString() {
		return JSON.stringify(ConvertErrorToPayloadObject(this));
	}

}

/**
 * Representing an array of errors being thrown
 * E.g. for a validation of form inputs
 */
export class ErrorBag extends Exception {

	public constructor(public message: string, public statusCode: number, public code: number, public errors: Exception[]) {
		super(message, statusCode, code);
	}

}

/**
 * Converting a thrown error to a payload object - to be returned to the client
 * @param {Error|ErrorBag} error
 * @returns
 */
export const ConvertErrorToPayloadObject = function(error: any) {
	const errors = error.errors;
	return [
		...(
			error.errors
			? errors.map((e: Exception) => ConvertErrorToPayloadObject(e))
			: [{
				message: error.message,
				code: error.code,
			}]
		)
	];
};
