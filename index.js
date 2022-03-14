const {readFile}  = require('fs').promises;
const {Firestore} = require('@google-cloud/firestore');
const csv = require('fast-csv')

if (process.argv.length < 3) {
  console.error('Please include a path to a csv file');
  process.exit(1);
}


const db = new Firestore();

function writeToFirestore(records) {
  const batchCommits = [];
  let batch = db.batch();
  records.forEach((record, i) => {
    var docRef = db.collection('images').doc(record.imageprodid);
    batch.set(docRef, record);
    if ((i + 1) % 500 === 0) {
      console.log(`Writing record ${i + 1}`);
      batchCommits.push(batch.commit());
      batch = db.batch();
    }
  });
  batchCommits.push(batch.commit());
  return Promise.all(batchCommits);
}

const readFile = () => {
    return new Promise((response, reject) => {
        try {
            const filename = path.join(__dirname, 'product_image.csv')
            let users = []
            let status = false
            fs.createReadStream(filename).pipe(csv.parse({ headers: true }))
            .on('error', error => console.error(error))
            .on('data', row => users.push(row)).on('end', rowCount => {
                console.log(`Parsed ${rowCount} rows`)
                response(users)
                status = true
            })
        } catch (error) {
            reject(error)
        }
    })
}

async function importCsv(csvFileName) {
//   const fileContents = await readFile(csvFileName, 'utf8');
  const records = await readFile(csvFileName, 'utf8');
//   const records = await parse(fileContents, { columns: true });
  console.log(records)
  try {
    await writeToFirestore(records);
  }
  catch (e) {
    // console.error(e);
    process.exit(1);
  }
  console.log(`Wrote ${records.length} records`);
}

importCsv(process.argv[2]).catch(e => console.error(e));
