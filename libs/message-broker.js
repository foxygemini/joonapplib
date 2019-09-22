class MsgBroker{
  constructor(){
    require('amqplib/callback_api')
    .connect('amqp://localhost', function(err, conn) {
      if (err != null){
        console.error(err);
        process.exit(1);
      }
      conn.createChannel((err, channel) => {
        if(err){
          console.error(err);
          process.exit(1);
        }else{
          this.channel = channel;
        }
      })
    });
  }

  async pushEvent(emmitCode, data, cb){
    this.channel.assertQueue(emmitCode, { durable: false }).then(function(ok){
      return ch.sendToQueue(emmitCode, Buffer.from(JSON.stringify(data)));
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