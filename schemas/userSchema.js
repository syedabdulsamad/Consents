import {
    mongoose
} from "../database_operations/dbConnectivity.js"
import jwt from "jsonwebtoken"

const jwt_secret = process.env.JWT_SECRET_KEY

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    password: {
        type: String,
        required: true,
        minlength: 10
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (email) {
                const regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                regex.test(email);

            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    DOB: {
        type: Date,
        required: true,
        validate: {
            validator: function (dob) {
                const now = new Date();
                const minDate = new Date();
                const maxDate = new Date();
                minDate.setFullYear(now.getFullYear() - 100);
                maxDate.setFullYear(now.getFullYear() - 18);
                return (dob > minDate && dob <= maxDate)
            },
            message: props => `DOB value : (${props.value}) should be older than 18 years and less than 100 years`
        }
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({
        id: this._id,
        exp: Math.floor(Date.now() / 1000) + (15 * 60), // token expires in 15 minutes
    }, jwt_secret);
    return token;

}


const User = mongoose.model("User", userSchema);

export {
    User,
    userSchema
}