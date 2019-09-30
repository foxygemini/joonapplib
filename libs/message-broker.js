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
          Object.keys(this.channelKey).map(key => {
            ch.assertQueue(this.channelKey[key]);
          });
          dt.channel = ch;
        }
      });
    });
  }

  getChannel(){
    return this.channel;
  }

  consume(emmitCode, cb){
    const isKeyExists = k => {
      let kExists = false;
      Object.keys(this.channelKey).map(key => {
        if(!kExists && this.channelKey[key] == k){
          kExists = true;
        }
      })
      return kExists
    }
    if(isKeyExists(emmitCode)){
      this.getChannel().consume(emmitCode, function(msg) {
        if (msg !== null) {
          const content = msg.content.toString();
          if(content){
            try{
              const data = JSON.parse(content);
              return cb(null, data);
            }catch(err){
              return cb(err);
            }
          }
          ch.ack(msg);
        }
        return cb("Failed")
      })
    }else{
      cb("Emmit code invalid")
    }
  }

  pushEvent(emmitCode, data, cb){
    this.channel.sendToQueue(emmitCode, Buffer.from(JSON.stringify(data)), {}, cb);
  }
  sendMail(template, content, cb){
    this.pushEvent(this.channelKey.sendMail,{template, content}, cb);
  }
  errorLog(scene, title, message, filePath, lineNumber, data, cb){
    this.pushEvent(this.channelKey.errorLog,{scene, title, message, filePath, lineNumber, data}, cb);
  }
  activityLog(scene, status, title, userId, userName, userType, data, cb){
    this.pushEvent(this.channelKey.activityLog,{scene, status, title, userId, userName, userType, data}, cb);
  }
  sendNotification(content, cb){
    this.pushEvent(this.channelKey.pushNotification, content, cb);
  }
  fetchConfig(cb){
    this.pushEvent(this.channelKey.fetchConfig, null, cb);
  }
}

module.exports = MsgBroker;