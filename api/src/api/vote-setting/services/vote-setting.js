'use strict';

/**
 * vote-setting service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::vote-setting.vote-setting');
