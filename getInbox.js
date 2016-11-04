const apiImporter=require('./apiImporter');

if(process.argv.length != 3) {
  console.log("Usage : node getInbox.js <token>");
  process.exit(1);
}

const token = process.argv[2];

apiImporter.getConvs(token);