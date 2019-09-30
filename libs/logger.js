const axios = require("axios");

module.exports = {
  error: (scene, title, message, filePath, lineNumber, data) => {
    axios.post(process.env.URL_SERVICE_LOG+"/v1/error", {scene, title, message, filePath, lineNumber, data}).then(res => console.log).catch(err => console.log);
  },
  activity: (scene, status, title, userId, userName, userType, data) => {
    axios.post(process.env.URL_SERVICE_LOG+"/v1/activity", {scene, status, title, userId, userName, userType, data}).then(res => console.log).catch(err => console.log);
  }
}