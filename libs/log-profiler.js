 
let profiles = [];

module.exports = {
  profile: (message, data, filename, linenumber, log, scene, status, resource, user, userType) => {
    if(process.env.NODE_ENV == "development"){
      profiles.push({message, data, filename, linenumber});
    }

    if(log){
      let logData = typeof data === 'object' ? JSON.stringify(data): data, logResource = typeof resource === 'object' ? JSON.stringify(resource): resource;
      var numbers = linenumber.match(/\d+/g).map(Number);

      process.workerQueue.doLog({scene: scene, status: status, userId: (user?user.id:null), userName: (user?user.fullName:null), userType: userType, title: message, message: logData, filePath: filename, lineNumber: numbers.length>0?numbers[0]:-1});
    }
  },
  reset: () => {
    profiles = [];
  },
  render: () => {
    if(process.env.NODE_ENV == "development" && profiles.length>0){
      profiles.map(profile => console.log("`"+profile.message+"`", "in", profile.filename,"line", profile.linenumber,"with data",profile.data))
      profiles = [];
    }
  }
}