// const firebase = require("firebase");
// // Required for side-effects
// require("firebase/firestore");

// // Initialize Cloud Firestore through Firebase
// firebase.initializeApp({
//     apiKey: "AIzaSyCewNSjYDWmhfg1wYHFEIt3ri2rIw9GDqw",
//     authDomain: "chat-app-32877.firebaseapp.com",
//     projectId: "chat-app-32877",
// });

// var db = firebase.firestore();

//Array containing all the users
const users = [];

//Join user to chat
function userJoin(id, username, room) {
    const user = { id, username, room };

    users.push(user);

    //Add user to Firebase
    // db.collection("users")
    //     .add({
    //         username: user.username,
    //         room: user.room,
    //         id: user.id,
    //     })
    //     .then(function (docRef) {
    //         console.log("Document written with ID: ", docRef.id);
    //     })
    //     .catch(function (error) {
    //         console.error("Error adding document: ", error);
    //     });

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
