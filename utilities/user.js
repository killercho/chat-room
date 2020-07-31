const users = [];

require("dotenv").config();
const url = process.env.URL;
const mongoose = require("mongoose");
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    wtimeout: 3000,
    w: 0,
});

let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error: "));
let query = db
        .collection("users")

//Join user to chat
function userJoin(id, username, room) {
    const user = { id, username, room };

    users.push(user);

    return user;
}

//Get current user
function getCurrentUser(id) {
    return users.find((user) => user.id === id);
}

//User DC
function userDC(id) {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

//Get room users
function getRoomUsers(room) {
    return users.filter((user) => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userDC,
    getRoomUsers,
};
