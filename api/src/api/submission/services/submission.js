'use strict';

/**
 * submission service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::submission.submission', ({ strapi }) => ({
    async findByCode(code) {
        if (!code) return;

        const [submission] = await strapi.entityService.findMany('api::submission.submission', {
            limit: 1,
            filters: {
                code
            },
            populate: ['users', 'video']
        })

        return submission
    }
}));
