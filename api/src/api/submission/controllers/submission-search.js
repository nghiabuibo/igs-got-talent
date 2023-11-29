'use strict';

/**
 * A set of functions called "actions" for `submission-search`
 */

module.exports = async (ctx) => {
    try {
        let accessToken
        const { code } = ctx.request.params
        const submission = await strapi.service('api::submission.submission').findByCode(code)

        if (submission && submission.users.length) {
            const [user] = submission.users
            accessToken = strapi.plugin('users-permissions').service('jwt').issue({
                id: user.id,
            });
        }

        const message = submission ? 'Đã tìm thấy mã đăng ký!' : 'Không tìm thấy mã đăng ký!'
        return ctx.send({
            submission,
            accessToken,
            message
        })
    } catch (err) {
        ctx.body = err;
    }
};
