export class BadAuthorizationException {

    type: string;
    message: string;
    httpCode: number;

    constructor(message: string) {
        this.type = 'BadAuthorizationException';
        this.httpCode = 401;
        this.message = message;
    }
}