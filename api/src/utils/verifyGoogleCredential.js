'use strict';

const { OAuth2Client } = require('google-auth-library');

module.exports = async (credential) => {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GG_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload
}