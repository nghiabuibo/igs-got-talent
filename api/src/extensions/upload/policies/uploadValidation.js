'use-strict';

const { errors } = require('@strapi/utils');
const { ApplicationError } = errors;

module.exports = async (ctx, config, { strapi }) => {
    // validate submission
    const { refId: submissionID } = ctx.request.body
    const submission = await strapi.entityService.findOne('api::submission.submission', submissionID, {
        populate: ['video']
    })
    if (submission.video) throw new ApplicationError('Video already uploaded!')

    // validate file
    const allowFileTypes = ['video/mov', 'video/quicktime', 'video/mp4']
    const { type } = ctx.request.files.files

    if (!allowFileTypes.includes(type)) throw new ApplicationError('File type is not allowed!')

    return true
}