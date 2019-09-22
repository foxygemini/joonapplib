class MsgBroker{
  constructor(channel){
    this.channel = channel;
  }

  getChannel(){
    return this.channel;
  }

  async pushEvent(channel, data, cb){
    console.log("Start push event");
    this.channel.assertQueue(channel, { durable: false }).then(function(ok){
      return ch.sendToQueue(channel, Buffer.from(JSON.stringify({data})));
    }).then(function(res){
      console.log("Ch result", res);
      if(typeof cb !== "undefined"){
        cb(null, res);
      }
    }).catch(function(err){
      throw new Error(err);
    })
  }

  async sendInfo(data, cb){
    this.pushEvent(process.constantVar.emmitCode.info,data, cb);
  }
  async sendMail(template, content, cb){
    this.pushEvent(process.constantVar.emmitCode.mailer,{template, content}, cb);
  }
  async doLog(content, cb){
    this.pushEvent(process.constantVar.emmitCode.log,{content}, cb);
  }
  async sendNotification(content, cb){
    this.pushEvent(process.constantVar.emmitCode.notification, {content}, cb);
  }
  async fetchConfig(cb){
    this.pushEvent(process.constantVar.emmitCode.fetchConfig, null, cb);
  }
}

module.exports = MsgBroker;