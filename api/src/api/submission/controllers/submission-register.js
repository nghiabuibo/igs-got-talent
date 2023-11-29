'use strict';


/**
 * A set of functions called "actions" for `submission-register`
*/

const crypto = require("crypto")
const getRoleIDByName = require("../../../utils/getRoleIDByName")
const getRandomCode = require("../../../utils/getRandomCode")

const fs = require("fs")
const _ = require('lodash');

module.exports = async (ctx) => {
  try {
    const entries = ctx.request.body

    // create new submission
    const submissionCode = getRandomCode()
    const submission = await strapi.entityService.create('api::submission.submission', {
      data: {
        code: submissionCode,
        status: 'pending',
        publishedAt: new Date().toISOString()
      }
    })
    if (!submission || !submission.id) return ctx.badRequest(`Đăng ký không thành công!`)

    //setup email template
    const emailHtml = fs.readFileSync(__dirname + '/../../../extensions/email/templates/register.html', 'utf-8')
    const submitUrl = process.env.APP_URL ? process.env.APP_URL + `/upload/${submission.code}` : `http://localhost:3000/upload/${submission.code}`
    const emailParams = { submitUrl }

    const emailTemplate = {
      subject: `IGS'S GOT TALENT | XÁC NHẬN ĐĂNG KÝ THÀNH CÔNG - HƯỚNG DẪN NỘP BÀI DỰ THI`,
      text: `Ivy Global School thanks you and congratulations for SUCCESSFULLY REGISTERING for IGS's Got Talent 2023. Contestants or team leaders should submit their works on the contest system of the Organizing Committee here: <%= emailParams.submitUrl %>. Deadline for submission: 22:00, Friday, December 1, 2023`,
      html: emailHtml,
    };

    // create new users
    const defaultRoleID = await getRoleIDByName('authenticated')
    for (let i in entries) {
      const entry = entries[i]
      if (!entry.username) entry.username = crypto.randomUUID()
      entry.role = defaultRoleID
      entry.provider = 'local'
      entry.submission = [submission.id]

      const user = await strapi.entityService.create('plugin::users-permissions.user', {
        data: entry
      })

      if (!user || !user.id) return ctx.badRequest(`Đăng ký không thành công tại thành viên ${i + 1}!`)

      // send email
      try {
        strapi.plugins['email'].services.email.sendTemplatedEmail(
          {
            to: user.email,
            bcc: process.env.AWS_SES_FROM
          },
          emailTemplate,
          {
            emailParams: _.pick(emailParams, ['submitUrl'])
          }
        )
      } catch (err) {
        console.log(`Error sending email ${user.email} at ${new Date()} ::: `, err)
      }

    }

    return ctx.send({
      // code: submissionCode,
      message: 'Đăng ký thành công! Vui lòng kiểm tra email đã đăng ký để nhận mã dự thi.'
    })
  } catch (err) {
    ctx.body = err;
  }
};
