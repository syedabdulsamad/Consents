import mongoose from "mongoose"
const connectToDB = function () {
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
export {
    connectToDB,
    mongoose
};