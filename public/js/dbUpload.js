import { initializeApp, firestore } from "firebase";
// Required for side-effects
import "firebase/firestore";

// Initialize Cloud Firestore through Firebase
initializeApp({
    apiKey: "AIzaSyCewNSjYDWmhfg1wYHFEIt3ri2rIw9GDqw",
    authDomain: "chat-app-32877.firebaseapp.com",
    projectId: "chat-app-32877",
});

var db = firestore();

const usernameField = document.getElementById("username-field");
const emailField = document.getElementById("email-field");
const passwordField = document.getElementById("password-field");

document.getElementById("signup_button").onclick = function () {
    enterDB();
};

function enterDB() {
    db.collection("users")
        .add({
            username: usernameField,
            email: emailField,
            password: passwordField,
        })
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
            console.log("Successfull DB input!");
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
}

export default { enterDB };
