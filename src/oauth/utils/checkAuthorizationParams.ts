import { BadRequestException, NotFoundException } from "../exceptions";
import { Client } from "../model";

export default async function checkAuthorizationParams(query: {
    client_id?: string,
    redirect_uri?: string,
    scope?: string,
    state?: string,
    response_type?: string,
}) {

    // -- Check for missing query parameters

    const missingParams: string[] = [];

    if (!query.client_id || query.client_id === '') missingParams.push('client_id');
    if (!query.redirect_uri || query.redirect_uri === '') missingParams.push('redirect_uri');

    if (missingParams.length > 0) throw new BadRequestException({ missingParams });

    // -- Check client_id
    const client = await Client.get(query.client_id as string);
    if (!client) throw new NotFoundException("Invalid client_id.");

    // -- Check redirect_uri
    const redirectURI = decodeURIComponent(query.redirect_uri as string);
    const isRedirectURIValid = await client.checkRedirectURI(redirectURI);
    if (!isRedirectURIValid) throw new NotFoundException("Invalid redirect_uri.");

}