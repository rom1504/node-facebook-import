const apiImporter=require('./apiImporter');

if(process.argv.length != 4) {
  console.log("Usage : node getConversation.js <token> <conversationFile>");
  process.exit(1);
}

const token = process.argv[2];
const conversationFile = process.argv[3];


var conv=require(conversationFile);
apiImporter.getMessages(conv[0].comments,token);
