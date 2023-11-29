'use strict';

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/submissions/search/:code',
            handler: 'submission-custom.search'
        }
    ]
}