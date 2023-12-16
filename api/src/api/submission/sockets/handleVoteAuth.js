'use-strict';

const verifyGoogleCredential = require("../../../utils/verifyGoogleCredential");

module.exports = async ({ strapi }, socket) => {
    const { credential } = socket.handshake.query
    const payload = await verifyGoogleCredential(credential).catch((err) => {
        console.error(err)
        socket.emit('socket:error', err.message)
    })

    if (!payload) return
    socket.emit('submission:authed', payload)
}