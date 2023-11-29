'use-strict';

const isVoteable = require("../../../utils/isVoteable")
const verifyGoogleCredential = require("../../../utils/verifyGoogleCredential");

module.exports = async ({ strapi }, socket) => {
    // const isVoteableCheck = await isVoteable()
    // if (!isVoteableCheck) {
    //     socket.emit('socket:error', 'Unable to vote at this time!')
    //     return
    // }

    const { credential } = socket.handshake.query
    const payload = await verifyGoogleCredential(credential).catch((err) => {
        console.error(err)
        socket.emit('socket:error', err.message)
    })

    if (!payload) return
    socket.emit('submission:authed', payload)
}