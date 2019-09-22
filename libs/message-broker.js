class MsgBroker{
  constructor(){
    this.conn = null
    let dt = this;

    require('amqplib/callback_api')
    .connect('amqp://localhost', function(err, conn) {
      if (err != null){
        console.error(err);
        process.exit(1);
      }

      dt.conn = conn; 
    });
  }
  
  

  pushEvent(emmitCode, data, cb){
    this.conn.createChannel(on_open);
    function on_open(err, ch) {
      if (err != null) bail(err);
      ch.assertQueue(emmitCode);
      ch.sendToQueue(emmitCode, Buffer.from(JSON.stringify(data)));
    }
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