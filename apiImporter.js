const rp = require('request-promise');
const fs = require('fs');
const Readable = require('stream').Readable;


class Complementor extends Readable
{
  constructor(initialResponse,token,previous=false) {
    super({
      objectMode:true
    });
    this.dataBuffer=[];
    this.previous=previous;
    this.token=token;
    this.readResponse(initialResponse);
    this.onGoing=false;
    this.tryBeforeEnd=5;
  }

  readResponse(parsed) {
    if(parsed.data.length==0) {
      if(this.tryBeforeEnd==0) {
        console.log("this is the ennnnnd", this.next, parsed);
        this.push(null);
        this.onGoing = false;
      }
      else {
        console.log(this.tryBeforeEnd,'before all is lost',this.next);
        this.tryBeforeEnd--;
        setTimeout(() => this.continueReading(),100);
      }
      return false;
    }
    this.tryBeforeEnd=5;
    this.dataBuffer=this.dataBuffer.concat(this.previous ? parsed.data.reverse() : parsed.data);
    this.next=parsed.paging.next.replace(/access_token=(.+?)&/,"access_token="+this.token+"&");
    return true;
  }

  continueReading() {
    let i=0;
    let stop=false;
    for(i=0;i<this.dataBuffer.length;i++) {
      if(!(this.push(this.dataBuffer[i]))) {
        stop=true;
        i++;
        break;
      }
    }
    this.dataBuffer=this.dataBuffer.slice(i,this.dataBuffer.length);
    if(this.dataBuffer.length==0 && !stop) {
      rp(this.next)
        .then(response => {
          let parsed=JSON.parse(response);
          var r=this.readResponse(parsed);
          if(r) {
            setTimeout(() => this.continueReading(),100);
          }
        })
        .catch(err => {
          console.log(err.message);
          setTimeout(() => this.continueReading(),30000);
        })
      ;
    }
    if(stop) {
      this.onGoing=false;
    }
  }

  _read(size) {
    if(this.onGoing)
      return;
    this.onGoing=true;
    this.continueReading();
  }
}


function getConvs(token) {
  let cs2 = [];
  return rp('https://graph.facebook.com/v2.3/me/inbox?access_token=' + token)
    .then(response =>
      new Complementor(JSON.parse(response),token)
        .on('data', data => cs2.push(data))
        .on('end', () => fs.writeFileSync("./convs2.json", JSON.stringify(cs2, null, 2))));

}


function getMessages(initialComments,token) {
  let cs2 = [];
  return new Complementor(initialComments,token,true)
    .on('data', data => {console.log(data); cs2.push(data)})
    .on('end', () => fs.writeFileSync("./messages2.json", JSON.stringify(cs2, null, 2)));
}



module.exports={getConvs,getMessages,Complementor};