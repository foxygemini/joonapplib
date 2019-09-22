class responseJson{
  constructor(res, profiler){
    this.res = res;
    this.id = null;
    this.success = true;
    this.message = "";
    this.data = null;
    this.messages = [];
    this.status = 200;
    this.relogin = false;
    this.customKey = {};
    this.profiler = null;
    if(profiler){
      this.profiler = profiler;
    }
  }

  setId(id){
    this.id = id;
    return this;
  }

  setStatus(status){
    this.status = status;
    return this;
  }

  setStatusNotFound(){
    this.setStatus(404).setSuccessFalse()
    return this;
  }

  setStatusError(){
    this.setStatus(500).setSuccessFalse()
    return this
  }

  setStatusForbidden(){
    this.setStatus(403).setSuccessFalse()
    return this
  }
  
  setSuccess(success){
    this.success = success
    return this;
  }
  
  setSuccessTrue(){
    this.success = true;
    return this;
  }
  
  setSuccessFalse(){
    this.success = false;
    return this;
  }
  
  setMessage(message){
    if(message){
      this.message = message
    }
    return this;
  }
  
  resetMessage(){
    this.message = "";
    return this;
  }
  
  setMessages(messages){
    if(messages){
      this.messages = messages
    }
    return this;
  }
  
  appendMessages(message){
    this.messages.push(message)
    return this;
  }
  
  resetMessages(){
    this.messages = [];
    return this;
  }
  
  setData(data){
    if(data){
      this.data = data
    }
    return this;
  }
  
  appendData(key, value){
    if(key && value) {
      this.data[key] = value
    }
    return this;
  }

  addCustomField(key, value){
    if(key && value){
      this.customKey[key] = value;
    }
    return this;
  }
  
  resetData(){
    this.data = null;
    return this;
  }

  render(){
    if(this.relogin){
      this.setSuccessFalse().resetData().resetMessage().resetMessages();
      this.res.status(this.status).json({success: false, reauth: true})
    }else{
      let res = {success: this.success}
      if(this.message){
        res.message = this.message
      }
  
      if(this.messages.length>0){
        res.messages = this.messages
      }
  
      if(this.data){
        res.data = this.data
      }
      if(this.id){
        res.id = this.id
      }

      if(Object.keys(this.customKey).length>0){
        Object.keys(this.customKey).map(key => {
          res[key] = this.customKey[key];
        })
      }

      if(this.profiler){
        this.profiler.profile("Response sent", {status: this.status, response: res}, __filename, (new Error(1).stack).split("at ")[1].split(":")[2])
        if(this.profiler){
            this.profiler.render();
            this.profiler.reset();
        }
      }
      this.res.status(this.status).json(res)
    }
  }

  renderNotFound(message){
    if(!message){message = "Data not found";}
    this.setStatusNotFound().setMessage(message).render()
  }

  renderError(message){
    if(!message){message = "Something wrong";}
    this.setStatusError().setMessage(message).render()
  }

  renderForbidden(message){
    if(!message){message = "Access Forbidden";}
    this.setStatusForbidden().setMessage(message).render();
  }

  renderFailed(message, messages){
    if(!message){message = "Request Invalid";}
    if(messages){
      this.appendMessages(messages);
    }
    this.setSuccessFalse().setMessage(message).render();
  }

  renderSuccess(message){
    this.setSuccessTrue().setMessage(message).render();
  }

  renderSuccessWithId(message, id){
    this.setSuccessTrue().setId(id).setMessage(message).render();
  }

  forceRelogin(render){
    this.relogin = true;    
    if(render){
      this.render()
    }else{
      return this;
    }
  }
}

module.exports = responseJson;