const fs = require('fs')

const getJSONRows = (file = 'garments.json') => {
    try {
        let rawdata = fs.readFileSync(file);
        let garments = JSON.parse(rawdata);
        return garments
    } catch (error) {
        return []
    }
}


export default getJSONRows