// -- Get SECRET_KEY from environment variable.
export default function getSecretKey(): string {
    return process.env.SECRET_KEY ? process.env.SECRET_KEY : "SECRET_KEY";
}