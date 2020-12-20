const mongoose = require("mongoose");
const createConnection = function () {
    return new Promise((resolve, reject) => {
        mongoose.connect("mongodb://localhost/Consents", {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            .then(() => {
                console.log("Connection successful")
                resolve(mongoose);
            })
            .catch((error) => {
                console.log(error);
                reject(error)
            });
    });
}

module.exports.connectToDB = createConnection;
module.exports.mongoose = mongoose;