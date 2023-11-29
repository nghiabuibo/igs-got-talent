'use strict';

module.exports = async ({ strapi }, socket) => {
    const submissions = await strapi.entityService.findMany('api::submission.submission', {
        limit: 0,
        filters: {
            status: 'active'
        },
        populate: ['video']
    })
    socket.emit('submission:load', submissions)
}