const axios = require("axios");

module.exports = {
  error: async (scene, title, message, filePath, lineNumber, data) => {
    axios.post(process.env.URL_SERVICE_LOG+"/error", {scene, title, message, filePath, lineNumber, data}).then(res => console.log).catch(err => console.log);
  },
  activity: async (scene, status, title, userId, userName, userType, data) => {
    axios.post(process.env.URL_SERVICE_LOG+"/activity", {scene, status, title, userId, userName, userType, data}).then(res => console.log).catch(err => console.log);
  }
}