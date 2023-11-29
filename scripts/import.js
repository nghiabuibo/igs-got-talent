const axios = require("axios")
require('dotenv').config()

const APP_API_URL = process.env.APP_API_URL

const SPREADSHEET_ID = process.env.SPREADSHEET_ID
const SHEET_NAME = process.env.SHEET_NAME
const SHEET_RANGE = process.env.SHEET_RANGE
const GG_API_URL = process.env.GG_API_URL
const GG_API_KEY = process.env.GG_API_KEY

async function importGGSheet() {
    const params = `/values/${encodeURIComponent(SHEET_NAME)}!${SHEET_RANGE}?key=`
    const endpoint = GG_API_URL + SPREADSHEET_ID + params + GG_API_KEY
    const response = await axios.get(endpoint)

    if (!response || !response.data?.values) return

    const entries = response.data.values
    for (let i in entries) {
        const entry = entries[i]
        const payload = [{
            name: typeof entry[0] !== 'undefined' && entry[0] !== '' ? entry[0] : 'N/A',
            phone: typeof entry[1] !== 'undefined' && entry[1] !== '' ? entry[1] : 'N/A',
            email: typeof entry[2] !== 'undefined' && entry[2] !== '' ? entry[2] : 'N/A',
            address: typeof entry[3] !== 'undefined' && entry[3] !== '' ? entry[3] : 'N/A',
            birthday: typeof entry[4] !== 'undefined' && entry[4] !== '' ? entry[4] : 'N/A',
            school: typeof entry[5] !== 'undefined' && entry[5] !== '' ? entry[5] : 'N/A',
            grade: typeof entry[6] !== 'undefined' && entry[6] !== '' ? entry[6] : 'N/A',
            igsStudent: typeof entry[7] !== 'undefined' && entry[7] === 'x' ? true : false
        }]
        const registerEndpoint = '/submissions/register'
        const registerUrl = APP_API_URL + registerEndpoint
        const registerResponse = await axios.post(registerUrl, payload).catch((err) => console.log(`Entry ${i} register error ::: ${payload[0].email} ::: ${err.response.data.error.message}`))

        if (!registerResponse) continue

        console.log(`Entry ${i} logging ::: ${payload[0].email} ::: ${registerResponse.data?.message}`)
    }
}

importGGSheet()