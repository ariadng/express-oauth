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