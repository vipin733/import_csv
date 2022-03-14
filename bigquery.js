'use strict';
const { BigQuery } = require('@google-cloud/bigquery');
const { default: getJSONRows } = require('./read_json');

function main() {
    const bigquery = new BigQuery();
    async function query() {
        try {
            let garments = await getJSONRows()
            console.log(garments.length);
            const query = `SELECT PRODUCTID
                FROM \`ploom-dev-291002.products_dataset.isc_garments_new\`
                LIMIT 100`;

            //   WHERE UNIT = 5
            const options = {
                query: query,
                location: 'us-west1',
            };

            const [job] = await bigquery.createQueryJob(options);
            console.log(`Job ${job.id} started.`);

            const [rows] = await job.getQueryResults();

            console.log('Rows:');
            rows.forEach(row => console.log(row));

        } catch (error) {
            console.log(error)
        }

    }
    query();
}

main(...process.argv.slice(2));