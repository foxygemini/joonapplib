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
  }

  connect(){
    return new Promise((resolve, reject) => {
      let dt = this;
  
      require('amqplib/callback_api')
      .connect('amqp://'+process.env.MESSAGE_BROKER_USERNAME+":"+process.env.MESSAGE_BROKER_PASSWORD+"@"+process.env.MESSAGE_BROKER_HOST, function(err, conn) {
        if (err != null){
          console.error(err);
          process.exit(1);
        }
  
        conn.createChannel(function(err, ch){
          if (err != null){
            reject(err)
          }else{
            Object.keys(dt.channelKey).map(key => {
              ch.assertQueue(dt.channelKey[key]);
            });
            dt.setChannel(ch);
            resolve(dt);
          }
        });
      });

    })
    
  }
  

  setChannel(channel){
    this.channel = channel;
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
      this.channel.consume(emmitCode, function(msg) {
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