export interface BadRequestExceptionDetails {
    missingFields?: string[];
}

export class BadRequestException {

    type: string;
    message: string;
    details: BadRequestExceptionDetails;
    httpCode: number;

    constructor(details: BadRequestExceptionDetails = {}) {
        this.type       = 'BadRequestException';
        this.details    = details;
        this.httpCode   = 400;
        this.message    = 'Error(s) detected on the request: ' + Object.keys(details).join(', ') + '.';
    }
}

export class NotFoundException {

    type: string;
    message: string;
    httpCode: number;

    constructor() {
        this.type = 'NotFoundException';
        this.httpCode = 404;
        this.message = 'Resource not found.';
    }
}