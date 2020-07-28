const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let User = new Schema({
    username: String,
    password: String,
    email: { type: String, unique: true },
});

// const User = mongoose.model("User", {
//     username: String,
//     password: String,
//     email: String,
// });

module.exports = User;
