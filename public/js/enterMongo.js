const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let User = new Schema({
    username: String,
    password: String,
    email: { type: String, unique: true }
});

module.exports = User;
