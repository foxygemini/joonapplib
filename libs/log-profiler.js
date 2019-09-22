 
let profiles = [];

module.exports = {
  profile: (message, data, filename, linenumber) => {
    if(process.env.NODE_ENV == "development"){
      profiles.push({message, data, filename, linenumber});
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