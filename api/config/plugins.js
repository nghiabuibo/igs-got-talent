const handleVoteAuth = require("../src/api/submission/sockets/handleVoteAuth");
const handleVoteConnection = require("../src/api/submission/sockets/handleVoteConnection");
const handleVote = require("../src/api/submission/sockets/handleVote");
const handleVoteFinal = require("../src/api/submission/sockets/handleVoteFinal");

module.exports = ({ env }) => ({
    email: {
        config: {
            provider: 'amazon-ses',
            providerOptions: {
                key: env('AWS_SES_KEY'),
                secret: env('AWS_SES_SECRET'),
                amazon: env('AWS_SES_REGION'),
            },
            settings: {
                defaultFrom: env('AWS_SES_FROM'),
                defaultReplyTo: env('AWS_SES_REPLY_TO'),
            },
        },
    },
    upload: {
        config: {
            // provider: 'aws-s3',
            // providerOptions: {
            //     accessKeyId: env('AWS_ACCESS_KEY_ID'),
            //     secretAccessKey: env('AWS_ACCESS_SECRET'),
            //     region: env('AWS_REGION'),
            //     params: {
            //         ACL: env('AWS_ACL', 'public-read'),
            //         Bucket: env('AWS_BUCKET'),
            //     },
            // },
            // actionOptions: {
            //     upload: {},
            //     uploadStream: {},
            //     delete: {},
            // },
            sizeLimit: env('UPLOAD_MAX_SIZE_MB') * 1024 * 1024
        }
    },
    io: {
        enabled: true,
        config: {
            contentTypes: ['api::submission.submission'],
            events: [
                {
                    name: 'connection',
                    handler: handleVoteConnection
                },
                {
                    name: 'submission:auth',
                    handler: handleVoteAuth
                },
                {
                    name: 'submission:vote',
                    handler: handleVote
                },
                {
                    name: 'submission:voteFinal',
                    handler: handleVoteFinal
                }
            ],
            socket: {
                serverOptions: {
                    cors: { origin: '*' }
                }
            }
        }
    }
});