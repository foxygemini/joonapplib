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
    .connect('amqp://'+process.env.MESSAGE_BROKER_USERNAME+":"+process.env.MESSAGE_BROKER_PASSWORD+"@"+process.env.MESSAGE_BROKER_HOST, function(err, conn) {
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
  errorLog(scene, title, message, filePath, lineNumber, data, cb){
    this.pushEvent('error-log',{scene, title, message, filePath, lineNumber, data}, cb);
  }
  activityLog(scene, status, title, userId, userName, userType, data, cb){
    this.pushEvent('activity-log',{scene, status, title, userId, userName, userType, data}, cb);
  }
  sendNotification(content, cb){
    this.pushEvent('push-notification', content, cb);
  }
  fetchConfig(cb){
    this.pushEvent('fetch-config', null, cb);
  }
}

module.exports = MsgBroker;