const fs = require('fs');

module.exports = (p, c) => {
    fs.readFile(p, (err, data) => {
        if(err) {
          c(err);
          return;
        }
        try {
          c(null, JSON.parse(data));
        } catch(exception) {
          c(exception);
        }
    });
}