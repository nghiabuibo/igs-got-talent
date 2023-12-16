'use strict';

module.exports = async ({ strapi }, socket) => {
    const { isFinal } = socket.handshake.query
    
    const statusFilter = (isFinal && parseInt(isFinal)) ? ['final'] : ['active', 'final']

    const submissions = await strapi.entityService.findMany('api::submission.submission', {
        limit: 0,
        filters: {
            status: {
                $in: statusFilter
            }
        },
        populate: ['video', 'users']
    })
    socket.emit('submission:load', submissions)
}