import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    fullname: {
        type: String, 
        required: true,
        unqiue: true,
    },
    username: {
        type: String, 
        required: true,
        unqiue: true,
    },
    email: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        required: true,
    },
    courses: [{
        type: String,
        required: true,
    }],
    university: {
        type: String,
        required: true,
    },
    major: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    avatar:{
        type: String,
        default: "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
    },
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;