import { OAuth2Client } from 'google-auth-library';

let cachedClient = null;

/**
 * @returns {OAuth2Client}
 */
export function getClient(){
    if (cachedClient){
        return cachedClient;
    }

    const CLIENT_ID = '700716339246-aau8p35vfa84d5lgrf20g6nm196db0aa.apps.googleusercontent.com';

    const client = cachedClient = new OAuth2Client(CLIENT_ID);

    return client;
}
