export class BadCredentialsException {

    type: string;
    message: string;
    httpCode: number;

    constructor() {
        this.type = 'BadCredentialsException';
        this.httpCode = 401;
        this.message = 'Invalid username or password.';
    }
}