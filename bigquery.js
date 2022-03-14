'use strict';

function main() {
  const {BigQuery} = require('@google-cloud/bigquery');
  const bigquery = new BigQuery();
  async function query() {

    const query = `SELECT PRODUCTID
      FROM \`ploom-dev-291002.products_dataset.isc_garments\`
      WHERE UNIT = 5
      LIMIT 100`;

    const options = {
      query: query,
      location: 'us-west1',
    };

    const [job] = await bigquery.createQueryJob(options);
    console.log(`Job ${job.id} started.`);

    const [rows] = await job.getQueryResults();

    console.log('Rows:');
    rows.forEach(row => console.log(row));
  }
  query();
}
main(...process.argv.slice(2));