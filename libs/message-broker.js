class MsgBroker{
  constructor(channel){
    this.channel = channel;
  }

  getChannel(){
    return this.channel;
  }

  async pushEvent(channel, data, cb){
    this.channel.assertQueue(channel, { durable: false }).then(function(ok){
      return ch.sendToQueue(channel, Buffer.from(JSON.stringify(data)));
    }).then(function(res){
      if(typeof cb !== "undefined"){
        cb(null, res);
      }
    }).catch(function(err){
      throw new Error(err);
    })
  }
  async sendMail(template, content, cb){
    this.pushEvent('send-mail',{template, content}, cb);
  }
  async errorLog(content, cb){
    this.pushEvent('error-log',content, cb);
  }
  async activityLog(content, cb){
    this.pushEvent('activity-log',content, cb);
  }
  async sendNotification(content, cb){
    this.pushEvent('push-notification', content, cb);
  }
  async fetchConfig(cb){
    this.pushEvent('fetch-config', null, cb);
  }
}

module.exports = MsgBroker;