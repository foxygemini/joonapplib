class MsgBroker{
  constructor(){
    this.channel = {}
    this.channelKey = {
      sendMail: 'send-mail',
      fetchConfig: 'fetch-config',
      pushNotification: 'push-notification',
      errorLog: 'error-log',
      activityLog: 'activity-log'
    }
    let dt = this;

    require('amqplib/callback_api')
    .connect('amqp://localhost', function(err, conn) {
      if (err != null){
        console.error(err);
        process.exit(1);
      }

      conn.createChannel(function(err, ch){
        if (err != null){
          console.log(err)
          process.exit(1);
        }else{
          ['send-mail', 'fetch-config', 'push-notification', 'error-log', 'activity-log'].map(key => {
            ch.assertQueue(key);
          });
          dt.channel = ch;
        }
      });
    });
  }

  pushEvent(emmitCode, data, cb){
    this.channel.sendToQueue(emmitCode, Buffer.from(JSON.stringify(data)), {}, cb);
  }
  sendMail(template, content, cb){
    this.pushEvent('send-mail',{template, content}, cb);
  }
  errorLog(content, cb){
    this.pushEvent('error-log',content, cb);
  }
  activityLog(content, cb){
    this.pushEvent('activity-log',content, cb);
  }
  sendNotification(content, cb){
    this.pushEvent('push-notification', content, cb);
  }
  fetchConfig(cb){
    this.pushEvent('fetch-config', null, cb);
  }
}

module.exports = MsgBroker;