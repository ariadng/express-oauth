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