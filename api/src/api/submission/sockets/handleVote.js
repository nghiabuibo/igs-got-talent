'use strict';

const isVoteable = require("../../../utils/isVoteable")
const verifyGoogleCredential = require("../../../utils/verifyGoogleCredential");

module.exports = async ({ strapi, io }, socket, code) => {
    const isVoteableCheck = await isVoteable()
    if (!isVoteableCheck) {
        socket.emit('socket:warn', 'Unable to vote at this time!')
        return
    }

    const { credential } = socket.handshake.query
    const { email } = await verifyGoogleCredential(credential).catch((err) => {
        console.error(err)
        socket.emit('socket:error', err.message)
    })

    const submission = await strapi.service('api::submission.submission').findByCode(code)

    if (!submission) {
        socket.emit('socket:error', 'Submission not found!')
        return
    }

    const submissionVotes = submission.votes ?? []
    const voteIndex = submissionVotes.indexOf(email)

    if (voteIndex === -1) {
        submissionVotes.push(email)
    } else {
        submissionVotes.splice(voteIndex, 1)
    }
    
    const updateSubmission = await strapi.entityService.update('api::submission.submission', submission.id, {
        data: {
            votes: submissionVotes
        }
    }).catch((err) => {
        console.log(err)
        socket.emit('socket:error', err.message)
    })

    io.raw({
        event: 'submission:voted',
        data: updateSubmission
    })
}