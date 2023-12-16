'use strict';

module.exports = async () => {
    const voteSettings = await strapi.entityService.findMany('api::vote-setting.vote-setting')
    return voteSettings.finalRound
}